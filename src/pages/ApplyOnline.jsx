import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, ArrowRight, ArrowLeft, Building2, User, DollarSign, FileCheck, Loader2, FileSignature } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, name: "Business Information", icon: Building2 },
  { id: 2, name: "Sales & Delivery", icon: DollarSign },
  { id: 3, name: "Review & Submit", icon: FileCheck }
];

const marketTypes = [
  "Retail",
  "Restaurant",
  "E-commerce",
  "Professional Services",
  "Healthcare",
  "Hospitality",
  "Food Truck",
  "Salon/Spa",
  "Auto Services",
  "Other"
];

const formationTypes = [
  "Sole Proprietorship",
  "Partnership",
  "LLC",
  "Corporation",
  "Non-Profit"
];

export default function ApplyOnline() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [docusignStatus, setDocusignStatus] = useState(null);

  const [formData, setFormData] = useState({
    // Business Information
    dateBusinessStarted: "",
    businessMarketType: "",
    legalBusinessName: "",
    dbaName: "",
    taxId: "",
    businessNameOnTaxReturn: "",
    businessPhone: "",
    businessEmail: "",
    ownerFullName: "",
    businessFormationType: "",
    businessPhysicalAddress: "",
    corporateAddress: "",
    
    // Current Processing
    currentlyAcceptCards: "no",
    currentProcessorName: "",
    currentMerchantId: "",
    numberOfLocations: "1",
    
    // Products & Sales
    productsDescription: "",
    orderMethod: [],
    deliveryTimeframe: "",
    cancellationPolicy: "",
    geographicAreas: "",
    internationalCardPercentage: "",
    warrantyGuaranty: "",
    isSeasonal: "no",
    seasonalMonths: "",
    paymentTiming: ""
  });

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.dateBusinessStarted) newErrors.dateBusinessStarted = "Required";
      if (!formData.businessMarketType) newErrors.businessMarketType = "Required";
      if (!formData.legalBusinessName) newErrors.legalBusinessName = "Required";
      if (!formData.dbaName) newErrors.dbaName = "Required";
      if (!formData.taxId) newErrors.taxId = "Required";
      if (!formData.businessNameOnTaxReturn) newErrors.businessNameOnTaxReturn = "Required";
      if (!formData.businessPhone) newErrors.businessPhone = "Required";
      if (!formData.businessEmail) newErrors.businessEmail = "Required";
      if (!formData.ownerFullName) newErrors.ownerFullName = "Required";
      if (!formData.businessFormationType) newErrors.businessFormationType = "Required";
      if (!formData.businessPhysicalAddress) newErrors.businessPhysicalAddress = "Required";
      if (formData.currentlyAcceptCards === "yes") {
        if (!formData.currentProcessorName) newErrors.currentProcessorName = "Required";
        if (!formData.currentMerchantId) newErrors.currentMerchantId = "Required";
      }
    } else if (step === 2) {
      if (!formData.productsDescription) newErrors.productsDescription = "Required";
      if (formData.orderMethod.length === 0) newErrors.orderMethod = "Required";
      if (!formData.deliveryTimeframe) newErrors.deliveryTimeframe = "Required";
      if (!formData.cancellationPolicy) newErrors.cancellationPolicy = "Required";
      if (!formData.geographicAreas) newErrors.geographicAreas = "Required";
      if (!formData.internationalCardPercentage) newErrors.internationalCardPercentage = "Required";
      if (!formData.warrantyGuaranty) newErrors.warrantyGuaranty = "Required";
      if (!formData.paymentTiming) newErrors.paymentTiming = "Required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const toggleOrderMethod = (method) => {
    const current = formData.orderMethod;
    if (current.includes(method)) {
      setFormData({...formData, orderMethod: current.filter(m => m !== method)});
    } else {
      setFormData({...formData, orderMethod: [...current, method]});
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Send email notification
      await base44.integrations.Core.SendEmail({
        to: "contact@ezpayamerica.com",
        from_name: "EzPay Online Application",
        subject: `New Merchant Application - ${formData.legalBusinessName}`,
        body: `
          <h2>New Merchant Application</h2>
          
          <h3>Business Information</h3>
          <p><strong>Date Business Started:</strong> ${formData.dateBusinessStarted}</p>
          <p><strong>Business Market Type:</strong> ${formData.businessMarketType}</p>
          <p><strong>Legal Business Name:</strong> ${formData.legalBusinessName}</p>
          <p><strong>DBA Name:</strong> ${formData.dbaName}</p>
          <p><strong>Tax ID/EIN/SSN:</strong> ${formData.taxId}</p>
          <p><strong>Business Name on Tax Return:</strong> ${formData.businessNameOnTaxReturn}</p>
          <p><strong>Business Phone:</strong> ${formData.businessPhone}</p>
          <p><strong>Business Email:</strong> ${formData.businessEmail}</p>
          <p><strong>Owner Full Name:</strong> ${formData.ownerFullName}</p>
          <p><strong>Business Formation Type:</strong> ${formData.businessFormationType}</p>
          <p><strong>Physical Address:</strong> ${formData.businessPhysicalAddress}</p>
          <p><strong>Corporate Address:</strong> ${formData.corporateAddress || "Same as physical"}</p>
          
          <h3>Current Processing</h3>
          <p><strong>Currently Accept Cards:</strong> ${formData.currentlyAcceptCards}</p>
          <p><strong>Current Processor:</strong> ${formData.currentProcessorName || "N/A"}</p>
          <p><strong>Current Merchant ID:</strong> ${formData.currentMerchantId || "N/A"}</p>
          <p><strong>Number of Locations:</strong> ${formData.numberOfLocations}</p>
          
          <h3>Products & Sales</h3>
          <p><strong>Products Description:</strong> ${formData.productsDescription}</p>
          <p><strong>Order Methods:</strong> ${formData.orderMethod.join(", ")}</p>
          <p><strong>Delivery Timeframe:</strong> ${formData.deliveryTimeframe}</p>
          <p><strong>Cancellation/Return Policy:</strong> ${formData.cancellationPolicy}</p>
          <p><strong>Geographic Areas:</strong> ${formData.geographicAreas}</p>
          <p><strong>International Card %:</strong> ${formData.internationalCardPercentage}%</p>
          <p><strong>Warranty/Guaranty:</strong> ${formData.warrantyGuaranty}</p>
          <p><strong>Seasonal Business:</strong> ${formData.isSeasonal}</p>
          <p><strong>Seasonal Months:</strong> ${formData.seasonalMonths || "N/A"}</p>
          <p><strong>Payment Timing:</strong> ${formData.paymentTiming}</p>
        `
      });

      // Send DocuSign envelope for e-signature
      const docusignResponse = await base44.functions.invoke('docusignEnvelope', {
        applicationData: formData
      });

      if (docusignResponse.data?.success) {
        setDocusignStatus({
          success: true,
          envelopeId: docusignResponse.data.envelopeId
        });
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error("Application submission error:", error);
      alert("There was an error submitting your application. Please try again or call (865) 316-9625.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep - 1];
  const StepIcon = currentStepData.icon;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Thank you for applying to EzPay America. Our team will review your application and contact you within 24-48 hours.
            </p>
            
            {docusignStatus?.success && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FileSignature className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">E-Signature Required</h3>
                </div>
                <p className="text-blue-800">
                  We've sent a DocuSign email to <strong>{formData.businessEmail}</strong> for your electronic signature. Please check your inbox and sign the merchant application to complete the process.
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Questions? Call us at <a href="tel:8653169625" className="text-amber-600 font-bold">(865) 316-9625</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Apply Online"
        description="Apply for a merchant account with EzPay America. Fast approval, zero transaction fees, free equipment. Complete your application in minutes."
        keywords="merchant account application, apply for credit card processing, merchant services application, payment processing signup"
      />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Online Merchant Application
            </h1>
            <p className="text-xl text-gray-800">
              Please complete the form below to get started
            </p>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
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
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <p className={`mt-2 text-sm font-medium text-center hidden md:block ${
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
                );
              })}
            </div>
          </div>

          {/* Form Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <StepIcon className="w-8 h-8" />
                    {currentStepData.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Step 1: Business Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Business Started *
                          </label>
                          <Input
                            type="date"
                            value={formData.dateBusinessStarted}
                            onChange={(e) => setFormData({...formData, dateBusinessStarted: e.target.value})}
                            className={`h-12 ${errors.dateBusinessStarted ? 'border-red-500' : ''}`}
                          />
                          {errors.dateBusinessStarted && <p className="text-red-500 text-sm mt-1">{errors.dateBusinessStarted}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Market Type *
                          </label>
                          <Select 
                            value={formData.businessMarketType}
                            onValueChange={(value) => setFormData({...formData, businessMarketType: value})}
                          >
                            <SelectTrigger className={`h-12 ${errors.businessMarketType ? 'border-red-500' : ''}`}>
                              <SelectValue placeholder="Select market type" />
                            </SelectTrigger>
                            <SelectContent>
                              {marketTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.businessMarketType && <p className="text-red-500 text-sm mt-1">{errors.businessMarketType}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Legal Business Name *
                          </label>
                          <Input
                            value={formData.legalBusinessName}
                            onChange={(e) => setFormData({...formData, legalBusinessName: e.target.value})}
                            className={`h-12 ${errors.legalBusinessName ? 'border-red-500' : ''}`}
                          />
                          {errors.legalBusinessName && <p className="text-red-500 text-sm mt-1">{errors.legalBusinessName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Doing Business As (DBA) *
                          </label>
                          <Input
                            value={formData.dbaName}
                            onChange={(e) => setFormData({...formData, dbaName: e.target.value})}
                            className={`h-12 ${errors.dbaName ? 'border-red-500' : ''}`}
                          />
                          {errors.dbaName && <p className="text-red-500 text-sm mt-1">{errors.dbaName}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Taxpayer ID # (EIN) or SSN# *
                          </label>
                          <Input
                            value={formData.taxId}
                            onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                            placeholder="Use SSN if you don't have an EIN"
                            className={`h-12 ${errors.taxId ? 'border-red-500' : ''}`}
                          />
                          {errors.taxId && <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name On Tax Return *
                          </label>
                          <Input
                            value={formData.businessNameOnTaxReturn}
                            onChange={(e) => setFormData({...formData, businessNameOnTaxReturn: e.target.value})}
                            className={`h-12 ${errors.businessNameOnTaxReturn ? 'border-red-500' : ''}`}
                          />
                          {errors.businessNameOnTaxReturn && <p className="text-red-500 text-sm mt-1">{errors.businessNameOnTaxReturn}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Phone Number *
                          </label>
                          <Input
                            type="tel"
                            value={formData.businessPhone}
                            onChange={(e) => setFormData({...formData, businessPhone: e.target.value})}
                            className={`h-12 ${errors.businessPhone ? 'border-red-500' : ''}`}
                          />
                          {errors.businessPhone && <p className="text-red-500 text-sm mt-1">{errors.businessPhone}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Email *
                          </label>
                          <Input
                            type="email"
                            value={formData.businessEmail}
                            onChange={(e) => setFormData({...formData, businessEmail: e.target.value})}
                            className={`h-12 ${errors.businessEmail ? 'border-red-500' : ''}`}
                          />
                          {errors.businessEmail && <p className="text-red-500 text-sm mt-1">{errors.businessEmail}</p>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Owner Full Name *
                          </label>
                          <Input
                            value={formData.ownerFullName}
                            onChange={(e) => setFormData({...formData, ownerFullName: e.target.value})}
                            className={`h-12 ${errors.ownerFullName ? 'border-red-500' : ''}`}
                          />
                          {errors.ownerFullName && <p className="text-red-500 text-sm mt-1">{errors.ownerFullName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Formation Type *
                          </label>
                          <Select 
                            value={formData.businessFormationType}
                            onValueChange={(value) => setFormData({...formData, businessFormationType: value})}
                          >
                            <SelectTrigger className={`h-12 ${errors.businessFormationType ? 'border-red-500' : ''}`}>
                              <SelectValue placeholder="Select formation type" />
                            </SelectTrigger>
                            <SelectContent>
                              {formationTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.businessFormationType && <p className="text-red-500 text-sm mt-1">{errors.businessFormationType}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Physical Address *
                        </label>
                        <Input
                          value={formData.businessPhysicalAddress}
                          onChange={(e) => setFormData({...formData, businessPhysicalAddress: e.target.value})}
                          placeholder="Street, City, State, ZIP"
                          className={`h-12 ${errors.businessPhysicalAddress ? 'border-red-500' : ''}`}
                        />
                        {errors.businessPhysicalAddress && <p className="text-red-500 text-sm mt-1">{errors.businessPhysicalAddress}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Corporate Address (if different from physical)
                        </label>
                        <Input
                          value={formData.corporateAddress}
                          onChange={(e) => setFormData({...formData, corporateAddress: e.target.value})}
                          className="h-12"
                        />
                      </div>

                      <div className="border-t pt-6 mt-6">
                        <h3 className="text-lg font-semibold mb-4">Current Payment Processing</h3>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Do you currently accept Visa/MC/Discover? *
                          </label>
                          <Select 
                            value={formData.currentlyAcceptCards}
                            onValueChange={(value) => setFormData({...formData, currentlyAcceptCards: value})}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.currentlyAcceptCards === "yes" && (
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Payment Processor Name *
                              </label>
                              <Input
                                value={formData.currentProcessorName}
                                onChange={(e) => setFormData({...formData, currentProcessorName: e.target.value})}
                                className={`h-12 ${errors.currentProcessorName ? 'border-red-500' : ''}`}
                              />
                              {errors.currentProcessorName && <p className="text-red-500 text-sm mt-1">{errors.currentProcessorName}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Merchant ID Number *
                              </label>
                              <Input
                                value={formData.currentMerchantId}
                                onChange={(e) => setFormData({...formData, currentMerchantId: e.target.value})}
                                className={`h-12 ${errors.currentMerchantId ? 'border-red-500' : ''}`}
                              />
                              {errors.currentMerchantId && <p className="text-red-500 text-sm mt-1">{errors.currentMerchantId}</p>}
                            </div>
                          </div>
                        )}

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Locations *
                          </label>
                          <Select 
                            value={formData.numberOfLocations}
                            onValueChange={(value) => setFormData({...formData, numberOfLocations: value})}
                          >
                            <SelectTrigger className="h-12 w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3+">3 or More</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Sales & Delivery */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description of Products Sold *
                        </label>
                        <Textarea
                          value={formData.productsDescription}
                          onChange={(e) => setFormData({...formData, productsDescription: e.target.value})}
                          rows={3}
                          className={errors.productsDescription ? 'border-red-500' : ''}
                        />
                        {errors.productsDescription && <p className="text-red-500 text-sm mt-1">{errors.productsDescription}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          How Does The Customer Order Your Products Or Service? *
                        </label>
                        <div className="flex flex-wrap gap-4">
                          {["In-Person", "By Phone", "By Mail", "Over The Internet"].map((method) => (
                            <div key={method} className="flex items-center gap-2">
                              <Checkbox
                                checked={formData.orderMethod.includes(method)}
                                onCheckedChange={() => toggleOrderMethod(method)}
                              />
                              <span className="text-sm">{method}</span>
                            </div>
                          ))}
                        </div>
                        {errors.orderMethod && <p className="text-red-500 text-sm mt-1">{errors.orderMethod}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What Is The Delivery Time Frame To The Customer? *
                        </label>
                        <Input
                          value={formData.deliveryTimeframe}
                          onChange={(e) => setFormData({...formData, deliveryTimeframe: e.target.value})}
                          placeholder="e.g., Immediate, 1-3 days, 1-2 weeks"
                          className={`h-12 ${errors.deliveryTimeframe ? 'border-red-500' : ''}`}
                        />
                        {errors.deliveryTimeframe && <p className="text-red-500 text-sm mt-1">{errors.deliveryTimeframe}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What is your cancellation or return policy? *
                        </label>
                        <Textarea
                          value={formData.cancellationPolicy}
                          onChange={(e) => setFormData({...formData, cancellationPolicy: e.target.value})}
                          rows={2}
                          className={errors.cancellationPolicy ? 'border-red-500' : ''}
                        />
                        {errors.cancellationPolicy && <p className="text-red-500 text-sm mt-1">{errors.cancellationPolicy}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          In what geographic areas will the product be marketed and sold? *
                        </label>
                        <Input
                          value={formData.geographicAreas}
                          onChange={(e) => setFormData({...formData, geographicAreas: e.target.value})}
                          placeholder="e.g., Local, Statewide, National, International"
                          className={`h-12 ${errors.geographicAreas ? 'border-red-500' : ''}`}
                        />
                        {errors.geographicAreas && <p className="text-red-500 text-sm mt-1">{errors.geographicAreas}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What percentage of sales transactions are with international cards? *
                        </label>
                        <Input
                          type="number"
                          value={formData.internationalCardPercentage}
                          onChange={(e) => setFormData({...formData, internationalCardPercentage: e.target.value})}
                          placeholder="0-100"
                          min="0"
                          max="100"
                          className={`h-12 w-32 ${errors.internationalCardPercentage ? 'border-red-500' : ''}`}
                        />
                        {errors.internationalCardPercentage && <p className="text-red-500 text-sm mt-1">{errors.internationalCardPercentage}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What is your warranty/guaranty? *
                        </label>
                        <Input
                          value={formData.warrantyGuaranty}
                          onChange={(e) => setFormData({...formData, warrantyGuaranty: e.target.value})}
                          className={`h-12 ${errors.warrantyGuaranty ? 'border-red-500' : ''}`}
                        />
                        {errors.warrantyGuaranty && <p className="text-red-500 text-sm mt-1">{errors.warrantyGuaranty}</p>}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Is Your Business Seasonal? *
                          </label>
                          <Select 
                            value={formData.isSeasonal}
                            onValueChange={(value) => setFormData({...formData, isSeasonal: value})}
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {formData.isSeasonal === "yes" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              What Months Are You Active?
                            </label>
                            <Input
                              value={formData.seasonalMonths}
                              onChange={(e) => setFormData({...formData, seasonalMonths: e.target.value})}
                              placeholder="e.g., May - September"
                              className="h-12"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          At What Point Are You Paid In Full? *
                        </label>
                        <Select 
                          value={formData.paymentTiming}
                          onValueChange={(value) => setFormData({...formData, paymentTiming: value})}
                        >
                          <SelectTrigger className={`h-12 ${errors.paymentTiming ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select payment timing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="at_service">100% At time of service</SelectItem>
                            <SelectItem value="in_advance">100% Paid In Advance For Future Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.paymentTiming && <p className="text-red-500 text-sm mt-1">{errors.paymentTiming}</p>}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review & Submit */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                        <p className="text-sm text-amber-800">
                          <strong>Please review your information before submitting.</strong> You can go back to any step to make changes.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-amber-600" />
                            Business Information
                          </h3>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div><span className="font-semibold">Legal Name:</span> {formData.legalBusinessName}</div>
                            <div><span className="font-semibold">DBA:</span> {formData.dbaName}</div>
                            <div><span className="font-semibold">Market Type:</span> {formData.businessMarketType}</div>
                            <div><span className="font-semibold">Formation:</span> {formData.businessFormationType}</div>
                            <div><span className="font-semibold">Owner:</span> {formData.ownerFullName}</div>
                            <div><span className="font-semibold">Phone:</span> {formData.businessPhone}</div>
                            <div><span className="font-semibold">Email:</span> {formData.businessEmail}</div>
                            <div><span className="font-semibold">Locations:</span> {formData.numberOfLocations}</div>
                            <div className="md:col-span-2"><span className="font-semibold">Address:</span> {formData.businessPhysicalAddress}</div>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-amber-600" />
                            Sales & Delivery
                          </h3>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="md:col-span-2"><span className="font-semibold">Products:</span> {formData.productsDescription}</div>
                            <div><span className="font-semibold">Order Methods:</span> {formData.orderMethod.join(", ")}</div>
                            <div><span className="font-semibold">Delivery:</span> {formData.deliveryTimeframe}</div>
                            <div><span className="font-semibold">Geographic Areas:</span> {formData.geographicAreas}</div>
                            <div><span className="font-semibold">International %:</span> {formData.internationalCardPercentage}%</div>
                            <div><span className="font-semibold">Seasonal:</span> {formData.isSeasonal === "yes" ? `Yes (${formData.seasonalMonths})` : "No"}</div>
                            <div><span className="font-semibold">Payment Timing:</span> {formData.paymentTiming === "at_service" ? "At time of service" : "Paid in advance"}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="flex items-start gap-3">
                          <input type="checkbox" className="mt-1" required />
                          <span className="text-sm text-gray-700">
                            I certify that the information provided is accurate and complete. I authorize EzPay America to verify this information and process my application.
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-12">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      disabled={currentStep === 1}
                      className="px-8 py-6 text-lg"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Previous
                    </Button>
                    {currentStep < 3 ? (
                      <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg"
                      >
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-6 text-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <CheckCircle2 className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}