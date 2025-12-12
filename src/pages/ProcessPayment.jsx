import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Loader2, CheckCircle2, XCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function ProcessPayment() {
  const [formData, setFormData] = useState({
    amount: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    customerName: '',
    customerEmail: '',
    description: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);

    try {
      const { data } = await base44.functions.invoke('processPayment', {
        amount: parseFloat(formData.amount),
        cardNumber: formData.cardNumber,
        expirationDate: formData.expirationDate,
        cvv: formData.cvv,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        description: formData.description
      });

      setResult(data);

      if (data.success) {
        setFormData({
          amount: '',
          cardNumber: '',
          expirationDate: '',
          cvv: '',
          customerName: '',
          customerEmail: '',
          description: ''
        });
      }
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Process Payment</h1>
          <p className="text-gray-600">Securely process customer payments</p>
        </div>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className={`border-2 ${result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {result.success ? (
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-600" />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                      {result.success ? 'Payment Approved' : 'Payment Declined'}
                    </h3>
                    <p className={`${result.success ? 'text-green-700' : 'text-red-700'} mt-1`}>
                      {result.message}
                    </p>
                    {result.success && result.transactionId && (
                      <p className="text-sm text-gray-600 mt-2">
                        Transaction ID: <span className="font-mono">{result.transactionId}</span>
                      </p>
                    )}
                    {result.success && result.authCode && (
                      <p className="text-sm text-gray-600">
                        Auth Code: <span className="font-mono">{result.authCode}</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Payment Form */}
        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <CardTitle className="flex items-center gap-3">
              <CreditCard className="w-6 h-6" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="pl-8 text-lg h-12"
                    required
                  />
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <Input
                    placeholder="John Smith"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    className="h-12"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    className="h-12"
                    required
                  />
                </div>
              </div>

              {/* Card Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                  maxLength={19}
                  className="h-12 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date *
                  </label>
                  <Input
                    placeholder="MM/YY"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({...formData, expirationDate: formatExpiry(e.target.value)})}
                    maxLength={5}
                    className="h-12 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV *
                  </label>
                  <Input
                    type="password"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                    maxLength={4}
                    className="h-12 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <Textarea
                  placeholder="Payment for..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                />
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Secure Payment Processing</p>
                  <p className="text-blue-700 mt-1">
                    All payments are processed securely through NMI Gateway with industry-standard encryption.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-14 text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Process Payment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}