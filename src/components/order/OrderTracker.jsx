import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Truck, MapPin, Calendar, DollarSign, Loader2, CheckCircle2, Clock, Box } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function OrderTracker() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchedOrder(null);

    try {
      const orders = await base44.entities.Order.filter({ 
        orderNumber: orderNumber.trim() 
      });

      if (orders.length === 0) {
        setError("Order not found. Please check your order number and try again.");
      } else {
        setSearchedOrder(orders[0]);
      }
    } catch (err) {
      console.error('Order search error:', err);
      setError("Unable to search for orders at this time. Please try again or call (865) 316-9625.");
    } finally {
      setIsSearching(false);
    }
  };

  const getEstimatedDelivery = (order) => {
    if (order.status === 'delivered') return null;
    if (!order.created_date) return 'Calculating...';

    const orderDate = new Date(order.created_date);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + 7); // 7 days delivery estimate

    return estimatedDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: CheckCircle2 },
    { key: 'processing', label: 'Processing', icon: Box },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Package }
  ];

  const getStatusIndex = (status) => {
    const index = statusSteps.findIndex(s => s.key === status);
    return index === -1 ? 0 : index;
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

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Track Your Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="Enter your order number (e.g., ORD-12345)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="flex-1 h-12"
            />
            <Button 
              type="submit" 
              disabled={isSearching}
              className="bg-amber-600 hover:bg-amber-700 h-12 px-8"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Track
                </>
              )}
            </Button>
          </form>
          {error && (
            <p className="text-red-600 text-sm mt-3">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Order Details */}
      {searchedOrder && (
        <Card className="border-2 border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Order #{searchedOrder.orderNumber}</CardTitle>
              <div className="flex gap-2">
                <Badge className={statusColors[searchedOrder.status]}>
                  {searchedOrder.status}
                </Badge>
                <Badge className={paymentStatusColors[searchedOrder.paymentStatus]}>
                  {searchedOrder.paymentStatus}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Status Progress */}
            {searchedOrder.status !== 'cancelled' && (
              <div className="mb-8">
                <h4 className="font-semibold mb-4">Order Progress</h4>
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500"
                      style={{ width: `${(getStatusIndex(searchedOrder.status) / (statusSteps.length - 1)) * 100}%` }}
                    />
                  </div>
                  
                  {statusSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = getStatusIndex(searchedOrder.status) >= index;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white scale-110' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <p className={`mt-2 text-xs font-medium text-center ${
                          isActive ? 'text-amber-600' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Estimated Delivery */}
            {searchedOrder.status !== 'delivered' && searchedOrder.status !== 'cancelled' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Estimated Delivery</p>
                    <p className="text-blue-700">{getEstimatedDelivery(searchedOrder)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Number */}
            {searchedOrder.trackingNumber && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Tracking Number</h4>
                </div>
                <p className="text-purple-800 font-mono font-bold text-lg">
                  {searchedOrder.trackingNumber}
                </p>
                <a 
                  href={`https://www.ups.com/track?tracknum=${searchedOrder.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline text-sm mt-2 inline-block"
                >
                  Track on UPS website →
                </a>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Items
                </h4>
                <div className="space-y-2">
                  {searchedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {searchedOrder.shippingAddress && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="font-medium">{searchedOrder.customerName}</p>
                    <p className="text-gray-700">{searchedOrder.shippingAddress.address}</p>
                    <p className="text-gray-700">
                      {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state} {searchedOrder.shippingAddress.zip}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Order Total
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${searchedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${searchedOrder.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">${searchedOrder.shipping?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-green-600">${searchedOrder.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Date */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              Order placed on {new Date(searchedOrder.created_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>

            {/* Notes */}
            {searchedOrder.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> {searchedOrder.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}