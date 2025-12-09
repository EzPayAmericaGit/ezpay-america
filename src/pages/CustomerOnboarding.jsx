import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "../components/SEOHead";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Circle, Package, GraduationCap, Plug, CreditCard, ArrowRight, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const steps = [
  { id: 1, name: "Welcome", icon: CheckCircle2, description: "Get started with your account" },
  { id: 2, name: "Equipment", icon: Package, description: "Order your POS equipment" },
  { id: 3, name: "Training", icon: GraduationCap, description: "Schedule training session" },
  { id: 4, name: "Integration", icon: Plug, description: "Connect your systems" },
  { id: 5, name: "First Transaction", icon: CreditCard, description: "Process your first sale" },
  { id: 6, name: "Complete", icon: CheckCircle2, description: "You're all set!" }
];

export default function CustomerOnboarding() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Equipment form
  const [equipmentForm, setEquipmentForm] = useState({
    terminalType: "",
    quantity: "1",
    accessories: [],
    shippingAddress: ""
  });

  // Training form
  const [trainingForm, setTrainingForm] = useState({
    preferredDate: "",
    preferredTime: "",
    attendees: "1"
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const userProgress = await base44.entities.OnboardingProgress.filter({
        merchantId: currentUser.id
      });

      if (userProgress && userProgress.length > 0) {
        setProgress(userProgress[0]);
        setCurrentStep(userProgress[0].currentStep);
      } else {
        // Create new progress record
        const newProgress = await base44.entities.OnboardingProgress.create({
          merchantId: currentUser.id,
          currentStep: 1
        });
        setProgress(newProgress);
      }
    } catch (error) {
      console.error("Load progress error:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeStep = async (stepData = {}) => {
    setSaving(true);
    try {
      const updates = {
        currentStep: currentStep + 1,
        completedSteps: [...(progress.completedSteps || []), currentStep],
        ...stepData
      };

      if (currentStep === 6) {
        updates.onboardingCompleted = true;
        updates.completedDate = new Date().toISOString();
      }

      await base44.entities.OnboardingProgress.update(progress.id, updates);
      
      setProgress({ ...progress, ...updates });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Complete step error:", error);
      alert("Error saving progress. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SEOHead title="Customer Onboarding" description="Complete your merchant account setup" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to EzPay America!</h1>
        <p className="text-xl text-gray-600 mb-12">Let's get you set up and ready to accept payments</p>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    currentStep > step.id ? 'bg-green-500' :
                    currentStep === step.id ? 'bg-amber-500 scale-110' :
                    'bg-gray-300'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    ) : (
                      <step.icon className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <p className={`mt-2 text-sm font-medium text-center ${
                    currentStep >= step.id ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 transition-all ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <CardTitle className="text-2xl">{steps[currentStep - 1].name}</CardTitle>
              <p className="text-amber-50">{steps[currentStep - 1].description}</p>
            </CardHeader>
            <CardContent className="p-8">
              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Welcome, {user?.full_name}!</h3>
                  <p className="text-lg text-gray-600">
                    Congratulations on being approved for your EzPay America merchant account! We're excited to help you grow your business.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                    <h4 className="font-bold text-gray-900 mb-2">What's Next?</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Order your POS equipment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Schedule training with our experts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Integrate with your existing systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Process your first transaction</span>
                      </li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => completeStep({ accountSetup: true })}
                    disabled={saving}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Let's Get Started"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Equipment */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Order Your Equipment</h3>
                  <p className="text-gray-600">Select the POS equipment that fits your business needs</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Terminal Type *</label>
                      <Select value={equipmentForm.terminalType} onValueChange={(value) => setEquipmentForm({...equipmentForm, terminalType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select terminal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail-standard">Retail Standard POS</SelectItem>
                          <SelectItem value="retail-pro">Retail Pro POS</SelectItem>
                          <SelectItem value="restaurant-basic">Restaurant Basic POS</SelectItem>
                          <SelectItem value="restaurant-advanced">Restaurant Advanced POS</SelectItem>
                          <SelectItem value="mobile">Mobile Card Reader</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <Input 
                        type="number" 
                        min="1"
                        value={equipmentForm.quantity}
                        onChange={(e) => setEquipmentForm({...equipmentForm, quantity: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address *</label>
                    <Textarea
                      value={equipmentForm.shippingAddress}
                      onChange={(e) => setEquipmentForm({...equipmentForm, shippingAddress: e.target.value})}
                      rows={3}
                      placeholder="Enter your business shipping address"
                    />
                  </div>

                  <Button 
                    onClick={() => completeStep({ 
                      equipmentOrdered: true, 
                      equipmentDetails: equipmentForm 
                    })}
                    disabled={!equipmentForm.terminalType || !equipmentForm.shippingAddress || saving}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Place Order"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 3: Training */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Schedule Your Training</h3>
                  <p className="text-gray-600">Book a training session with one of our payment experts</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                      <Input 
                        type="date"
                        value={trainingForm.preferredDate}
                        onChange={(e) => setTrainingForm({...trainingForm, preferredDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
                      <Select value={trainingForm.preferredTime} onValueChange={(value) => setTrainingForm({...trainingForm, preferredTime: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9am">9:00 AM</SelectItem>
                          <SelectItem value="10am">10:00 AM</SelectItem>
                          <SelectItem value="11am">11:00 AM</SelectItem>
                          <SelectItem value="1pm">1:00 PM</SelectItem>
                          <SelectItem value="2pm">2:00 PM</SelectItem>
                          <SelectItem value="3pm">3:00 PM</SelectItem>
                          <SelectItem value="4pm">4:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={() => completeStep({ 
                      trainingScheduled: true,
                      trainingDate: `${trainingForm.preferredDate} ${trainingForm.preferredTime}`
                    })}
                    disabled={!trainingForm.preferredDate || !trainingForm.preferredTime || saving}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Schedule Training"}
                    <Calendar className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 4: Integration */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">System Integration</h3>
                  <p className="text-gray-600">Connect EzPay with your existing business systems</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: "QuickBooks", icon: "💼", status: "Available" },
                      { name: "Shopify", icon: "🛒", status: "Available" },
                      { name: "WooCommerce", icon: "🌐", status: "Available" },
                      { name: "Square", icon: "⬜", status: "Available" }
                    ].map((integration) => (
                      <Card key={integration.name} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{integration.icon}</span>
                            <div>
                              <h4 className="font-bold text-gray-900">{integration.name}</h4>
                              <p className="text-sm text-green-600">{integration.status}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button 
                    onClick={() => completeStep({ integrationCompleted: true })}
                    disabled={saving}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Next Step"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 5: First Transaction */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Process Your First Transaction</h3>
                  <p className="text-gray-600">Let's test your system with a sample transaction</p>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-8">
                    <div className="text-center space-y-4">
                      <CreditCard className="w-16 h-16 text-green-600 mx-auto" />
                      <h4 className="text-xl font-bold text-gray-900">Test Transaction</h4>
                      <p className="text-gray-700">Use test card: 4242 4242 4242 4242</p>
                      <p className="text-sm text-gray-600">Any future date, any CVC</p>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Process Test Payment
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      onClick={() => completeStep({ firstTransactionProcessed: true })}
                      disabled={saving}
                      variant="outline"
                      className="px-8 py-6 text-lg"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "I've Processed My First Transaction"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 6: Complete */}
              {currentStep === 6 && (
                <div className="space-y-6 text-center py-8">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Congratulations!</h3>
                  <p className="text-xl text-gray-600">
                    Your onboarding is complete. You're now ready to accept payments!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg">
                      Go to Dashboard
                    </Button>
                    <Button variant="outline" className="px-8 py-6 text-lg">
                      Contact Support
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}