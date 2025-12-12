import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Receipt, CheckCircle2, XCircle, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 100)
  });

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    const matchesMerchant = user?.role === 'admin' || txn.merchantId === user?.id;
    return matchesSearch && matchesStatus && matchesMerchant;
  });

  const statusConfig = {
    approved: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    declined: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
    pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
    error: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
    refunded: { icon: Receipt, color: "text-blue-600", bg: "bg-blue-100" }
  };

  const totalAmount = filteredTransactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const approvedCount = filteredTransactions.filter(txn => txn.status === 'approved').length;
  const approvedAmount = filteredTransactions.filter(txn => txn.status === 'approved').reduce((sum, txn) => sum + (txn.amount || 0), 0);

  const stats = [
    {
      title: "Total Transactions",
      value: filteredTransactions.length,
      icon: Receipt,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Approved",
      value: approvedCount,
      icon: CheckCircle2,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Total Volume",
      value: `$${totalAmount.toFixed(2)}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Approved Amount",
      value: `$${approvedAmount.toFixed(2)}`,
      icon: DollarSign,
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Receipt className="w-8 h-8 text-amber-600" />
            Transaction History
          </h1>
          <p className="text-gray-600 mt-1">View and manage all payment transactions</p>
        </div>

        {/* Stats Grid */}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by transaction ID, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                Loading transactions...
              </CardContent>
            </Card>
          ) : filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                No transactions found
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((txn) => {
              const StatusIcon = statusConfig[txn.status]?.icon || Clock;
              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 ${statusConfig[txn.status]?.bg || 'bg-gray-100'} rounded-xl flex items-center justify-center`}>
                            <StatusIcon className={`w-6 h-6 ${statusConfig[txn.status]?.color || 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-gray-900">
                                {txn.customerName || 'Unknown Customer'}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[txn.status]?.bg || 'bg-gray-100'} ${statusConfig[txn.status]?.color || 'text-gray-600'}`}>
                                {txn.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{txn.customerEmail}</p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                              <span>TXN: <span className="font-mono">{txn.transactionId || 'N/A'}</span></span>
                              {txn.last4 && <span>Card: •••• {txn.last4}</span>}
                              {txn.authCode && <span>Auth: {txn.authCode}</span>}
                            </div>
                            {txn.description && (
                              <p className="text-sm text-gray-600 mt-2">{txn.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ${txn.amount?.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(txn.created_date).toLocaleString()}
                          </div>
                          {txn.responseText && (
                            <div className="text-xs text-gray-500 mt-2 max-w-xs">
                              {txn.responseText}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}