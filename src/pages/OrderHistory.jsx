import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Loader2, Calendar, DollarSign, MapPin, Truck, Eye, ChevronDown, ChevronUp, Search, CheckCircle2, Clock, Box } from "lucide-react";
import SEOHead from "../components/SEOHead";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderHistory() {
  const [user, setUser] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [guestOrderNumber, setGuestOrderNumber] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showGuestLookup, setShowGuestLookup] = useState(false);

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

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const allOrders = await base44.entities.Order.filter(
        { customerEmail: user.email },
        '-created_date'
      );
      return allOrders;
    },
    enabled: !!user?.email
  });

  const { data: guestOrder, isLoading: isLoadingGuest, refetch: refetchGuest } = useQuery({
    queryKey: ['guestOrder', guestOrderNumber, guestEmail],
    queryFn: async () => {
      if (!guestOrderNumber || !guestEmail) return null;
      const results = await base44.entities.Order.filter({ 
        orderNumber: guestOrderNumber,
        customerEmail: guestEmail.toLowerCase()
      });
      return results.length > 0 ? results[0] : null;
    },
    enabled: false
  });

  const handleGuestLookup = () => {
    if (guestOrderNumber && guestEmail) {
      refetchGuest();
    }
  };

  const getOrderStatusSteps = (order) => {
    const steps = [
      { label: 'Order Placed', status: 'pending', icon: CheckCircle2 },
      { label: 'Processing', status: 'processing', icon: Clock },
      { label: 'Shipped', status: 'shipped', icon: Truck },
      { label: 'Delivered', status: 'delivered', icon: Package }
    ];

    const currentIndex = steps.findIndex(s => s.status === order.status);
    return steps.map((step, idx) => ({
      ...step,
      completed: idx <= currentIndex,
      active: idx === currentIndex
    }));
  };

  const getEstimatedDelivery = (order) => {
    if (order.status === 'delivered') return 'Delivered';
    if (!order.created_date) return 'TBD';
    
    const orderDate = new Date(order.created_date);
    const estimatedDays = order.status === 'shipped' ? 3 : 5;
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
    
    return estimatedDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

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

        {/* Guest Order Lookup */}
        {!user && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Track Your Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Enter your order number and email to track your order status
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Order Number"
                  value={guestOrderNumber}
                  onChange={(e) => setGuestOrderNumber(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleGuestLookup}
                  disabled={!guestOrderNumber || !guestEmail || isLoadingGuest}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {isLoadingGuest ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Track Order'}
                </Button>
              </div>
              {guestOrder && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  {renderOrderCard(guestOrder)}
                </motion.div>
              )}
              {guestOrder === null && guestOrderNumber && guestEmail && !isLoadingGuest && (
                <p className="text-red-600 mt-4">Order not found. Please check your order number and email.</p>
              )}
            </CardContent>
          </Card>
        )}

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => renderOrderCard(order))}
          </div>
        )}
      </div>
    </div>
  );

  function renderOrderCard(order) {
    const isExpanded = expandedOrders.includes(order.id);
    const statusSteps = getOrderStatusSteps(order);
    const estimatedDelivery = getEstimatedDelivery(order);
    
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
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
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
                  {order.status !== 'delivered' && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Clock className="w-4 h-4" />
                      Est. Delivery: {estimatedDelivery}
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
                  {/* Order Status Timeline */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Order Status
                    </h4>
                    <div className="relative">
                      <div className="flex justify-between">
                        {statusSteps.map((step, idx) => {
                          const Icon = step.icon;
                          return (
                            <div key={idx} className="flex flex-col items-center flex-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                step.completed ? 'bg-green-500 text-white' : 
                                step.active ? 'bg-blue-500 text-white' : 
                                'bg-gray-200 text-gray-400'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className={`text-xs text-center ${
                                step.completed || step.active ? 'text-gray-900 font-medium' : 'text-gray-400'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                        <div 
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${(statusSteps.filter(s => s.completed).length - 1) * 33.33}%` }}
                        />
                      </div>
                    </div>
                  </div>

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
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-blue-900">Tracking Information</h4>
                        </div>
                        {order.status !== 'delivered' && (
                          <span className="text-sm text-blue-700">
                            Est. Delivery: {estimatedDelivery}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blue-800 mb-2">
                        Tracking Number: <span className="font-mono font-bold">{order.trackingNumber}</span>
                      </p>
                      <a
                        href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        Track with UPS <Eye className="w-3 h-3" />
                      </a>
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
  }
}