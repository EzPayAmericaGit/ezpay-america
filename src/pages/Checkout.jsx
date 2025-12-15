import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Loader2, ShoppingBag, ChevronRight, User, MapPin, CreditCard, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "../components/SEOHead";
import { motion, AnimatePresence } from "framer-motion";

export default function Checkout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
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

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [taxRate, setTaxRate] = useState(0.08);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        
        // Pre-fill form with saved user data
        if (userData) {
          setFormData(prev => ({
            ...prev,
            firstName: userData.firstName || prev.firstName,
            lastName: userData.lastName || prev.lastName,
            email: userData.email || prev.email,
            phone: userData.phone || prev.phone,
            address: userData.shippingAddress?.address || prev.address,
            city: userData.shippingAddress?.city || prev.city,
            state: userData.shippingAddress?.state || prev.state,
            zip: userData.shippingAddress?.zip || prev.zip
          }));
          
          if (userData.shippingAddress?.zip) {
            calculateShipping(userData.shippingAddress.zip);
          }
        }
      } catch (error) {
        console.log('User not logged in');
      }
    };
    loadUser();
  }, []);

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

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "Required";
      if (!formData.lastName.trim()) newErrors.lastName = "Required";
      if (!formData.email.trim()) newErrors.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
      if (!formData.phone.trim()) newErrors.phone = "Required";
    } else if (step === 2) {
      if (!formData.address.trim()) newErrors.address = "Required";
      if (!formData.city.trim()) newErrors.city = "Required";
      if (!formData.state.trim()) newErrors.state = "Required";
      if (!formData.zip.trim()) newErrors.zip = "Required";
      else if (formData.zip.length !== 5) newErrors.zip = "Must be 5 digits";
    } else if (step === 3) {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Required";
      else if (formData.cardNumber.length < 15) newErrors.cardNumber = "Invalid card number";
      if (!formData.expiry.trim()) newErrors.expiry = "Required";
      if (!formData.cvv.trim()) newErrors.cvv = "Required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setProcessing(true);

    try {
      // Save shipping info for logged-in users
      if (user) {
        await base44.auth.updateMe({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip
          }
        });
      }

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

  const steps = [
    { id: 1, name: 'Contact', icon: User },
    { id: 2, name: 'Shipping', icon: MapPin },
    { id: 3, name: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
      <SEOHead 
        title="Checkout - EzCart"
        description="Complete your purchase securely"
        keywords="checkout, secure payment"
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-sm text-blue-800">
              👋 Welcome back, <strong>{user.full_name || user.email}</strong>! Your information has been pre-filled.
            </p>
          </motion.div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Secure Checkout</h1>
        
        {/* Step Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.id 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white scale-110' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <p className={`mt-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 transition-all ${
                    currentStep > step.id ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Contact Information
                      </CardTitle>
                      <p className="text-sm text-amber-600 font-semibold mt-2">
                        NOTE: THIS PURCHASE REQUIRES A NEW APPROVED MERCHANT APPLICATION WITH EzPay America Inc.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className={errors.firstName ? 'border-red-500' : ''}
                          />
                          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <Input
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className={errors.lastName ? 'border-red-500' : ''}
                          />
                          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <Input
                          type="tel"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                      <Button 
                        type="button"
                        onClick={handleNext}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 h-12"
                      >
                        Continue to Shipping
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {currentStep === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Input
                          placeholder="Street Address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Input
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className={errors.city ? 'border-red-500' : ''}
                          />
                          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div>
                          <Input
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            className={errors.state ? 'border-red-500' : ''}
                          />
                          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                        </div>
                        <div>
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
                            className={errors.zip ? 'border-red-500' : ''}
                          />
                          {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                        </div>
                      </div>
                      {shippingCost > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-50 border border-green-200 p-4 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-green-600" />
                            <p className="text-sm text-green-800">
                              <strong>Shipping:</strong> ${shippingCost.toFixed(2)} (UPS Ground)
                            </p>
                          </div>
                        </motion.div>
                      )}
                      <div className="flex gap-4">
                        <Button 
                          type="button"
                          onClick={handleBack}
                          variant="outline"
                          className="flex-1 h-12"
                        >
                          Back
                        </Button>
                        <Button 
                          type="button"
                          onClick={handleNext}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 h-12"
                        >
                          Continue to Payment
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {currentStep === 3 && (
                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Payment Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Input
                            placeholder="Card Number"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})}
                            maxLength={16}
                            className={errors.cardNumber ? 'border-red-500' : ''}
                          />
                          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Input
                              placeholder="MM/YY"
                              value={formData.expiry}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                }
                                setFormData({...formData, expiry: value});
                              }}
                              maxLength={5}
                              className={errors.expiry ? 'border-red-500' : ''}
                            />
                            {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                          </div>
                          <div>
                            <Input
                              placeholder="CVV"
                              value={formData.cvv}
                              onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                              maxLength={4}
                              type="password"
                              className={errors.cvv ? 'border-red-500' : ''}
                            />
                            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <p className="text-sm text-blue-800">
                            🔒 Your payment information is encrypted and secure
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <Button 
                            type="button"
                            onClick={handleBack}
                            variant="outline"
                            className="flex-1 h-12"
                            disabled={processing}
                          >
                            Back
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={processing}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-12 text-lg font-semibold"
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
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
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