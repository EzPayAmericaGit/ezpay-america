import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, FileText, Users, ShieldAlert, Loader2, UserCircle, BarChart3, Mail, ShoppingBag, Settings, CreditCard, Receipt, DollarSign, Briefcase, Package, ClipboardList, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function Admin() {
  const [authStatus, setAuthStatus] = useState({ loading: true, isAdmin: false });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 50),
    enabled: authStatus.isAdmin
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: () => base44.entities.MerchantApplication.list('-created_date', 50),
    enabled: authStatus.isAdmin
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list('-created_date', 50),
    enabled: authStatus.isAdmin
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 50),
    enabled: authStatus.isAdmin
  });

  useEffect(() => {
    // Prevent search engine indexing
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role === 'admin') {
          setAuthStatus({ loading: false, isAdmin: true });
        } else {
          setAuthStatus({ loading: false, isAdmin: false });
        }
      } catch (e) {
        setAuthStatus({ loading: false, isAdmin: false });
      }
    };
    checkAuth();

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  // Calculate stats
  const stats = {
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    pendingApplications: applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length,
    lowStockProducts: products.filter(p => p.stock < 10 && p.active).length,
    recentTransactions: transactions.filter(t => {
      const today = new Date();
      const txDate = new Date(t.created_date);
      return today - txDate < 24 * 60 * 60 * 1000;
    }).length,
    totalRevenue: transactions.filter(t => t.status === 'approved').reduce((sum, t) => sum + (t.amount || 0), 0)
  };

  if (authStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!authStatus.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You must be an admin to access this page.</p>
            <Button onClick={() => base44.auth.redirectToLogin()}>
              Login as Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Pending Orders</p>
                  <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
                </div>
                <Package className="w-12 h-12 text-blue-200" />
              </div>
              <Link to={createPageUrl("OrdersAdmin")} className="text-sm text-blue-100 hover:text-white mt-3 inline-block">
                View all →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">New Applications</p>
                  <p className="text-3xl font-bold mt-2">{stats.pendingApplications}</p>
                </div>
                <ClipboardList className="w-12 h-12 text-purple-200" />
              </div>
              <Link to={createPageUrl("AdminDashboard")} className="text-sm text-purple-100 hover:text-white mt-3 inline-block">
                Review now →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Low Stock Items</p>
                  <p className="text-3xl font-bold mt-2">{stats.lowStockProducts}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-amber-200" />
              </div>
              <Link to={createPageUrl("ProductAdmin")} className="text-sm text-amber-100 hover:text-white mt-3 inline-block">
                Manage inventory →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Today's Revenue</p>
                  <p className="text-3xl font-bold mt-2">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-200" />
              </div>
              <Link to={createPageUrl("TransactionHistory")} className="text-sm text-green-100 hover:text-white mt-3 inline-block">
                View details →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Payment Processing Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Processing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link to={createPageUrl("ProcessPayment")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    Process Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Securely process customer payments through NMI Gateway.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("TransactionHistory")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-6 h-6 text-blue-600" />
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    View and manage all payment transactions and statuses.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Business Management Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Management</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link to={createPageUrl("AdminDashboard")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    Admin Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Review and manage merchant applications with AI assistance.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("BusinessDashboard")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-indigo-600" />
                    Business Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    View sales metrics, revenue trends, and business analytics.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("CRM")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-teal-600" />
                    CRM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Manage customer relationships, leads, and interactions.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("Invoicing")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-orange-600" />
                    Invoicing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Create and manage professional invoices for customers.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("OrdersAdmin")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-6 h-6 text-cyan-600" />
                    Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Manage customer orders and shipping information.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("ApplicationTracker")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-pink-600" />
                    Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Track and manage merchant application submissions.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("UserManagement")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-600" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Manage user accounts and permissions.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Store & Content Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Store & Content</h2>
          <div className="grid md:grid-cols-2 gap-6">
          <Link to={createPageUrl("Analytics")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  View website analytics, traffic data, and user behavior insights.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("EmailMarketing")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-red-600" />
                  Email Marketing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create and manage email campaigns to reach your audience.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("ProductAdmin")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-orange-600" />
                  Product Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage EzCart products, upload images, and set pricing.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("SettingsAdmin")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-gray-600" />
                  Store Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Configure tax rates and shipping costs for EzCart.
                </p>
              </CardContent>
            </Card>
          </Link>

            <Link to={createPageUrl("NewsAdmin")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="w-6 h-6 text-purple-600" />
                    News Admin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Manage news articles, create AI-generated content, and optimize SEO.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("CustomerOnboarding")}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="w-6 h-6 text-green-600" />
                    My Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    View your onboarding status and account details.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}