import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Loader2, Calendar, DollarSign, MapPin, Truck, Eye, ChevronDown, ChevronUp } from "lucide-react";
import SEOHead from "../components/SEOHead";
import { motion, AnimatePresence } from "framer-motion";
import OrderTracker from "../components/order/OrderTracker";

export default function OrderHistory() {
  const [user, setUser] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState([]);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const toggleExpand = (orderId) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter(id => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      try {
        const allOrders = await base44.entities.Order.filter(
          { customerEmail: user.email },
          '-created_date'
        );
        return allOrders;
      } catch (err) {
        console.error('Orders fetch error:', err);
        return [];
      }
    },
    enabled: !!user?.email,
    retry: 2,
    retryDelay: 1000,
    staleTime: 60000
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const paymentStatusColors = {
    pending: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <SEOHead 
        title="Order History"
        description="View your order history"
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order History & Tracking</h1>
          <p className="text-gray-600">Track and review your past orders</p>
        </div>

        {/* Order Tracker */}
        <OrderTracker />

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="py-6 text-center">
              <p className="text-red-600 mb-3">Unable to load your order history at this time.</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {!user && !isLoading && (
          <Card className="mb-6">
            <CardContent className="py-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Please log in to view your order history</p>
              <Button onClick={() => base44.auth.redirectToLogin()} className="bg-amber-600 hover:bg-amber-700">
                Login
              </Button>
            </CardContent>
          </Card>
        )}

        {user && orders.length === 0 && !isLoading && !error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders yet</p>
            </CardContent>
          </Card>
        ) : user && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrders.includes(order.id);
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b cursor-pointer" onClick={() => toggleExpand(order.id)}>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <CardTitle className="text-lg">
                              Order #{order.orderNumber}
                            </CardTitle>
                            <Badge className={statusColors[order.status] || 'bg-gray-100'}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.created_date).toLocaleDateString('en-US', { 
                                month: 'short', day: 'numeric', year: 'numeric' 
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {order.items?.length || 0} items
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-gray-900">
                              <DollarSign className="w-4 h-4" />
                              ${order.total?.toFixed(2)}
                            </span>
                            {order.trackingNumber && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <Truck className="w-4 h-4" />
                                Tracking Available
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={paymentStatusColors[order.paymentStatus] || 'bg-gray-100'}>
                            {order.paymentStatus}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-6">
                            {/* Order Items */}
                            <div className="mb-6">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Items Ordered
                              </h4>
                              <div className="space-y-3">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                      <span className="font-medium">{item.name}</span>
                                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Tracking Info */}
                            {order.trackingNumber && (
                              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Truck className="w-5 h-5 text-blue-600" />
                                  <h4 className="font-semibold text-blue-900">Tracking Information</h4>
                                </div>
                                <p className="text-sm text-blue-800">
                                  Tracking Number: <span className="font-mono font-bold">{order.trackingNumber}</span>
                                </p>
                              </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Shipping Address */}
                              {order.shippingAddress && (
                                <div>
                                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-600" />
                                    Shipping Address
                                  </h4>
                                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                  </div>
                                </div>
                              )}

                              {/* Order Summary */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-gray-600" />
                                  Order Summary
                                </h4>
                                <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">${order.subtotal?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-medium">${order.tax?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-medium">${order.shipping?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                                    <span>Total:</span>
                                    <span className="text-green-600">${order.total?.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}