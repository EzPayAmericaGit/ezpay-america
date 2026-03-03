import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, Users, FileText, Package, ShoppingCart, Lock, Loader2, Shield, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SEOHead from "../components/SEOHead";

export default function BusinessDashboard() {
  const [authStatus, setAuthStatus] = useState({ 
    loading: true, 
    isAdmin: false, 
    passwordVerified: false,
    twoFactorVerified: false
  });
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeExpiry, setCodeExpiry] = useState(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role === 'admin') {
          setAuthStatus({ loading: false, isAdmin: true, passwordVerified: false, twoFactorVerified: false });
        } else {
          setAuthStatus({ loading: false, isAdmin: false, passwordVerified: false, twoFactorVerified: false });
        }
      } catch (e) {
        setAuthStatus({ loading: false, isAdmin: false, passwordVerified: false, twoFactorVerified: false });
      }
    };
    checkAuth();
  }, []);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    // Credentials are validated server-side via the 2FA function (admin role required)
    setSending(true);
    try {
      const { data } = await base44.functions.invoke('send2FACode', { 
        phoneNumber: '+18653216338' 
      });
      
      if (data.success) {
        setCodeExpiry(data.expiresAt);
        setAuthStatus(prev => ({ ...prev, passwordVerified: true }));
        setError("");
      } else {
        setError("Failed to send verification code. Ensure you are logged in as an admin.");
      }
    } catch (err) {
      setError("Failed to send verification code. Ensure you are logged in as an admin.");
    }
    setSending(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      // Verification is done server-side — code never travels back to client
      const { data } = await base44.functions.invoke('verify2FACode', {
        code: verificationCode
      });

      if (data.success) {
        setAuthStatus(prev => ({ ...prev, twoFactorVerified: true }));
        setError("");
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    }
    setSending(false);
  };

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 100),
    enabled: authStatus.twoFactorVerified
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list(),
    enabled: authStatus.twoFactorVerified
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list(),
    enabled: authStatus.twoFactorVerified
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.MerchantApplication.list(),
    enabled: authStatus.twoFactorVerified
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: () => base44.entities.AuditLog.list('-created_date', 50),
    enabled: authStatus.twoFactorVerified
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 100),
    enabled: authStatus.twoFactorVerified
  });

  if (authStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SEOHead 
          title="Business Dashboard"
          robots="noindex, nofollow"
        />
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!authStatus.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SEOHead 
          title="Business Dashboard"
          robots="noindex, nofollow"
        />
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You must be an admin to access this dashboard.</p>
            <Button onClick={() => base44.auth.redirectToLogin()}>
              Login as Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!authStatus.passwordVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
        <SEOHead 
          title="Business Dashboard"
          robots="noindex, nofollow"
        />
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-amber-600" />
              Dashboard Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  You must be logged in as an admin to access this dashboard. Click below to send a 2FA code to the registered admin phone.
                </p>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!authStatus.twoFactorVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
        <SEOHead 
          title="Business Dashboard - 2FA"
          robots="noindex, nofollow"
        />
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-amber-600" />
              Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                A verification code has been sent to (865) 321-6338
              </p>
            </div>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Verification Code</label>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                Verify & Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate enhanced metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const leadCount = customers.filter(c => c.status === 'lead').length;
  
  // Transaction metrics
  const totalTransactions = transactions.length;
  const approvedTransactions = transactions.filter(t => t.status === 'approved').length;
  const declinedTransactions = transactions.filter(t => t.status === 'declined').length;
  const transactionVolume = transactions
    .filter(t => t.status === 'approved')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  
  // Application metrics
  const pendingApplications = applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length;
  const approvedApplications = applications.filter(a => a.status === 'approved').length;

  // Revenue by month (last 6 months)
  const revenueByMonth = orders.reduce((acc, order) => {
    const month = new Date(order.created_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + (order.total || 0);
    return acc;
  }, {});

  const monthlyData = Object.entries(revenueByMonth)
    .map(([month, revenue]) => ({ month, revenue }))
    .slice(-6);

  // Transaction trends
  const transactionsByMonth = transactions.reduce((acc, txn) => {
    const month = new Date(txn.created_date).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { month, approved: 0, declined: 0, volume: 0 };
    }
    if (txn.status === 'approved') {
      acc[month].approved++;
      acc[month].volume += txn.amount || 0;
    } else if (txn.status === 'declined') {
      acc[month].declined++;
    }
    return acc;
  }, {});

  const transactionTrendData = Object.values(transactionsByMonth).slice(-6);

  // Customer status distribution
  const customerStatusData = [
    { name: 'Active', value: customers.filter(c => c.status === 'active').length, color: '#10b981' },
    { name: 'Leads', value: customers.filter(c => c.status === 'lead').length, color: '#3b82f6' },
    { name: 'Inactive', value: customers.filter(c => c.status === 'inactive').length, color: '#6b7280' },
    { name: 'Churned', value: customers.filter(c => c.status === 'churned').length, color: '#ef4444' }
  ];

  // Order status distribution
  const orderStatusData = [
    { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, fill: '#10b981' },
    { name: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, fill: '#3b82f6' },
    { name: 'Processing', value: orders.filter(o => o.status === 'processing').length, fill: '#f59e0b' },
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, fill: '#6b7280' }
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      change: "+12.5%"
    },
    {
      title: "Transaction Volume",
      value: `$${transactionVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
      change: "+8.2%"
    },
    {
      title: "Active Customers",
      value: activeCustomers,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      change: `+${leadCount} leads`
    },
    {
      title: "Pending Applications",
      value: pendingApplications,
      icon: FileText,
      color: "from-amber-500 to-orange-600",
      change: `${approvedApplications} approved`
    }
  ];

  const severityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEOHead 
        title="Business Dashboard"
        robots="noindex, nofollow"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            2FA Secured
          </Badge>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    {stat.change && (
                      <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Customer Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={customerStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.total?.toFixed(2)}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Recent Invoices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div key={invoice.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-600">{invoice.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${invoice.total?.toFixed(2)}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Transaction Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{totalTransactions}</p>
                    </div>
                    <Activity className="w-10 h-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Approved</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">{approvedTransactions}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Declined</p>
                      <p className="text-2xl font-bold text-red-600 mt-2">{declinedTransactions}</p>
                    </div>
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={transactionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" fill="#10b981" name="Approved" />
                    <Bar dataKey="declined" fill="#ef4444" name="Declined" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((txn) => (
                    <div key={txn.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{txn.transactionId || 'N/A'}</p>
                        <p className="text-sm text-gray-600">
                          {txn.merchantName} • {txn.customerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(txn.created_date).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${txn.amount?.toFixed(2)}</p>
                        <Badge className={txn.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {txn.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Audit Trail Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No audit logs yet</p>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">{log.action}</p>
                              <Badge className={severityColors[log.severity]}>
                                {log.severity}
                              </Badge>
                              <Badge className={statusColors[log.status]}>
                                {log.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {log.userName || log.userEmail}
                            </p>
                            {log.entityType && (
                              <p className="text-xs text-gray-500">
                                Entity: {log.entityType} {log.entityId && `(ID: ${log.entityId})`}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(log.created_date).toLocaleString()}
                          </p>
                        </div>
                        {log.changes && (
                          <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-1">Changes:</p>
                            <pre className="text-xs text-gray-600 overflow-x-auto">
                              {JSON.stringify(log.changes, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.ipAddress && (
                          <p className="text-xs text-gray-500 mt-2">
                            IP: {log.ipAddress}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}