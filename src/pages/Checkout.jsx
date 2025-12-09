import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "../components/SEOHead";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ezCart');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [taxRate, setTaxRate] = useState(0.08);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await base44.entities.Settings.list();
        const taxSetting = settings.find(s => s.settingKey === 'tax_rate');
        if (taxSetting) {
          setTaxRate(parseFloat(taxSetting.settingValue) / 100);
        }
      } catch (error) {
        console.error('Failed to load settings');
      }
    };
    loadSettings();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;

  const calculateShipping = async (zipCode) => {
    if (zipCode.length !== 5) return;
    
    setCalculatingShipping(true);
    try {
      const { data } = await base44.functions.invoke('calculateUPSShipping', {
        zipCode,
        items: cart
      });
      
      if (data.success) {
        setShippingCost(data.shippingCost);
      }
    } catch (error) {
      setShippingCost(12.99);
    } finally {
      setCalculatingShipping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const orderNumber = `EZ${Date.now()}`;
      
      const { data } = await base44.functions.invoke('processNMIPayment', {
        orderData: {
          orderNumber,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerPhone: formData.phone,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip
          },
          items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          subtotal,
          tax,
          shipping: shippingCost,
          total
        },
        paymentData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          cardNumber: formData.cardNumber,
          expiry: formData.expiry,
          cvv: formData.cvv
        }
      });

      if (data.success) {
        localStorage.removeItem('ezCart');
        setOrderId(data.orderId);
        setOrderComplete(true);
      } else {
        alert(data.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      alert('Payment processing error. Please try again.');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <Button onClick={() => navigate(createPageUrl("Shop"))}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Complete!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and will be processed shortly.
            </p>
            <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
            <Button onClick={() => navigate(createPageUrl("Shop"))}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
      <SEOHead 
        title="Checkout - EzCart"
        description="Complete your purchase securely"
        keywords="checkout, secure payment"
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <p className="text-sm text-amber-600 font-semibold mt-2">
                    NOTE: THIS PURCHASE REQUIRES A NEW APPROVED MERCHANT APPLICATION WITH EzPay America Inc.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                    <Input
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                    />
                    <Input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      required
                    />
                    <Input
                      placeholder="ZIP"
                      value={formData.zip}
                      onChange={(e) => {
                        const zip = e.target.value;
                        setFormData({...formData, zip});
                        if (zip.length === 5) {
                          calculateShipping(zip);
                        }
                      }}
                      maxLength={5}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    maxLength={16}
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                      maxLength={5}
                      required
                    />
                    <Input
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                      maxLength={4}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 h-12"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${total.toFixed(2)}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping (UPS Ground)</span>
                    <span>
                      {calculatingShipping ? (
                        <Loader2 className="w-4 h-4 animate-spin inline" />
                      ) : shippingCost > 0 ? (
                        `$${shippingCost.toFixed(2)}`
                      ) : (
                        'Enter ZIP'
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}