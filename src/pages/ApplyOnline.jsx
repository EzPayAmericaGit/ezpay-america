import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, ArrowRight, ArrowLeft, Building2, User, DollarSign, CreditCard, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: 1, name: "Business Information", icon: Building2 },
  { id: 2, name: "Contact Information", icon: User },
  { id: 3, name: "Processing Details", icon: DollarSign },
  { id: 4, name: "Banking Information", icon: CreditCard },
  { id: 5, name: "Review & Submit", icon: FileCheck }
];

const businessTypes = [
  "Retail Store",
  "Restaurant/Bar",
  "E-commerce",
  "Professional Services",
  "Healthcare",
  "Hospitality",
  "Food Truck",
  "Other"
];

const merchantTypes = [
  "Sole Proprietorship",
  "Partnership",
  "LLC",
  "Corporation",
  "Non-Profit"
];

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default function ApplyOnline() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Business Information
    businessLegalName: "",
    dbaName: "",
    businessType: "",
    merchantType: "",
    taxId: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    yearsInBusiness: "",
    
    // Contact Information
    ownerFirstName: "",
    ownerLastName: "",
    ownerTitle: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerSSN: "",
    businessPhone: "",
    businessWebsite: "",
    
    // Processing Details
    monthlyVolume: "",
    averageTicket: "",
    highTicket: "",
    productsServices: "",
    currentProcessor: "",
    reasonForSwitch: "",
    
    // Banking Information
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "checking"
  });

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.businessLegalName) newErrors.businessLegalName = "Required";
      if (!formData.businessType) newErrors.businessType = "Required";
      if (!formData.merchantType) newErrors.merchantType = "Required";
      if (!formData.taxId) newErrors.taxId = "Required";
      if (!formData.businessAddress) newErrors.businessAddress = "Required";
      if (!formData.businessCity) newErrors.businessCity = "Required";
      if (!formData.businessState) newErrors.businessState = "Required";
      if (!formData.businessZip) newErrors.businessZip = "Required";
      if (!formData.yearsInBusiness) newErrors.yearsInBusiness = "Required";
    } else if (step === 2) {
      if (!formData.ownerFirstName) newErrors.ownerFirstName = "Required";
      if (!formData.ownerLastName) newErrors.ownerLastName = "Required";
      if (!formData.ownerEmail) newErrors.ownerEmail = "Required";
      if (!formData.ownerPhone) newErrors.ownerPhone = "Required";
      if (!formData.businessPhone) newErrors.businessPhone = "Required";
    } else if (step === 3) {
      if (!formData.monthlyVolume) newErrors.monthlyVolume = "Required";
      if (!formData.averageTicket) newErrors.averageTicket = "Required";
      if (!formData.highTicket) newErrors.highTicket = "Required";
      if (!formData.productsServices) newErrors.productsServices = "Required";
    } else if (step === 4) {
      if (!formData.bankName) newErrors.bankName = "Required";
      if (!formData.routingNumber) newErrors.routingNumber = "Required";
      if (!formData.accountNumber) newErrors.accountNumber = "Required";
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

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    
    try {
      // Send application via email
      await base44.integrations.Core.SendEmail({
        to: "contact@ezpayamerica.com",
        from_name: "EzPay Online Application",
        subject: `New Merchant Application - ${formData.businessLegalName}`,
        body: `
          <h2>New Merchant Application</h2>
          
          <h3>Business Information</h3>
          <p><strong>Legal Name:</strong> ${formData.businessLegalName}</p>
          <p><strong>DBA Name:</strong> ${formData.dbaName || "N/A"}</p>
          <p><strong>Business Type:</strong> ${formData.businessType}</p>
          <p><strong>Merchant Type:</strong> ${formData.merchantType}</p>
          <p><strong>Tax ID:</strong> ${formData.taxId}</p>
          <p><strong>Address:</strong> ${formData.businessAddress}, ${formData.businessCity}, ${formData.businessState} ${formData.businessZip}</p>
          <p><strong>Years in Business:</strong> ${formData.yearsInBusiness}</p>
          
          <h3>Contact Information</h3>
          <p><strong>Owner Name:</strong> ${formData.ownerFirstName} ${formData.ownerLastName}</p>
          <p><strong>Title:</strong> ${formData.ownerTitle || "N/A"}</p>
          <p><strong>Email:</strong> ${formData.ownerEmail}</p>
          <p><strong>Phone:</strong> ${formData.ownerPhone}</p>
          <p><strong>Business Phone:</strong> ${formData.businessPhone}</p>
          <p><strong>Website:</strong> ${formData.businessWebsite || "N/A"}</p>
          
          <h3>Processing Details</h3>
          <p><strong>Monthly Volume:</strong> $${formData.monthlyVolume}</p>
          <p><strong>Average Ticket:</strong> $${formData.averageTicket}</p>
          <p><strong>High Ticket:</strong> $${formData.highTicket}</p>
          <p><strong>Products/Services:</strong> ${formData.productsServices}</p>
          <p><strong>Current Processor:</strong> ${formData.currentProcessor || "N/A"}</p>
          <p><strong>Reason for Switch:</strong> ${formData.reasonForSwitch || "N/A"}</p>
          
          <h3>Banking Information</h3>
          <p><strong>Bank Name:</strong> ${formData.bankName}</p>
          <p><strong>Account Type:</strong> ${formData.accountType}</p>
          <p><strong>Routing Number:</strong> ${formData.routingNumber}</p>
          <p><strong>Account Number:</strong> ${formData.accountNumber}</p>
        `
      });
      
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
            <p className="text-xl text-gray-600 mb-8">
              Thank you for applying to EzPay America. Our team will review your application and contact you within 24-48 hours.
            </p>
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
              Apply Online
            </h1>
            <p className="text-xl text-gray-800">
              Complete your merchant application in just a few minutes
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
                            Business Legal Name *
                          </label>
                          <Input
                            value={formData.businessLegalName}
                            onChange={(e) => setFormData({...formData, businessLegalName: e.target.value})}
                            className={`h-12 ${errors.businessLegalName ? 'border-red-500' : ''}`}
                          />
                          {errors.businessLegalName && (
                            <p className="text-red-500 text-sm mt-1">{errors.businessLegalName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            DBA Name (if different)
                          </label>
                          <Input
                            value={formData.dbaName}
                            onChange={(e) => setFormData({...formData, dbaName: e.target.value})}
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Type *
                          </label>
                          <Select 
                            value={formData.businessType}
                            onValueChange={(value) => setFormData({...formData, businessType: value})}
                          >
                            <SelectTrigger className={`h-12 ${errors.businessType ? 'border-red-500' : ''}`}>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                              {businessTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.businessType && (
                            <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Merchant Type *
                          </label>
                          <Select 
                            value={formData.merchantType}
                            onValueChange={(value) => setFormData({...formData, merchantType: value})}
                          >
                            <SelectTrigger className={`h-12 ${errors.merchantType ? 'border-red-500' : ''}`}>
                              <SelectValue placeholder="Select merchant type" />
                            </SelectTrigger>
                            <SelectContent>
                              {merchantTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.merchantType && (
                            <p className="text-red-500 text-sm mt-1">{errors.merchantType}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax ID / EIN *
                          </label>
                          <Input
                            value={formData.taxId}
                            onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                            placeholder="XX-XXXXXXX"
                            className={`h-12 ${errors.taxId ? 'border-red-500' : ''}`}
                          />
                          {errors.taxId && (
                            <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years in Business *
                          </label>
                          <Input
                            type="number"
                            value={formData.yearsInBusiness}
                            onChange={(e) => setFormData({...formData, yearsInBusiness: e.target.value})}
                            className={`h-12 ${errors.yearsInBusiness ? 'border-red-500' : ''}`}
                          />
                          {errors.yearsInBusiness && (
                            <p className="text-red-500 text-sm mt-1">{errors.yearsInBusiness}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Address *
                        </label>
                        <Input
                          value={formData.businessAddress}
                          onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                          placeholder="Street Address"
                          className={`h-12 ${errors.businessAddress ? 'border-red-500' : ''}`}
                        />
                        {errors.businessAddress && (
                          <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <Input
                            value={formData.businessCity}
                            onChange={(e) => setFormData({...formData, businessCity: e.target.value})}
                            className={`h-12 ${errors.businessCity ? 'border-red-500' : ''}`}
                          />
                          {errors.businessCity && (
                            <p className="text-red-500 text-sm mt-1">{errors.businessCity}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State *
                          </label>
                          <Select 
                            value={formData.businessState}
                            onValueChange={(value) => setFormData({...formData, businessState: value})}
                          >
                            <SelectTrigger className={`h-12 ${errors.businessState ? 'border-red-500' : ''}`}>
                              <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.businessState && (
                            <p className="text-red-500 text-sm mt-1">{errors.businessState}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code *
                          </label>
                          <Input
                            value={formData.businessZip}
                            onChange={(e) => setFormData({...formData, businessZip: e.target.value})}
                            className={`h-12 ${errors.businessZip ? 'border-red-500' : ''}`}
                          />
                          {errors.businessZip && (
                            <p className="text-red-500 text-sm mt-1">{errors.businessZip}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Contact Information */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Owner First Name *
                          </label>
                          <Input
                            value={formData.ownerFirstName}
                            onChange={(e) => setFormData({...formData, ownerFirstName: e.target.value})}
                            className={`h-12 ${errors.ownerFirstName ? 'border-red-500' : ''}`}
                          />
                          {errors.ownerFirstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.ownerFirstName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Owner Last Name *
                          </label>
                          <Input
                            value={formData.ownerLastName}
                            onChange={(e) => setFormData({...formData, ownerLastName: e.target.value})}
                            className={`h-12 ${errors.ownerLastName ? 'border-red-500' : ''}`}
                          />
                          {errors.ownerLastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.ownerLastName}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title / Position
                        </label>
                        <Input
                          value={formData.ownerTitle}
                          onChange={(e) => setFormData({...formData, ownerTitle: e.target.value})}
                          placeholder="e.g., Owner, President, CEO"
                          className="h-12"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            value={formData.ownerEmail}
                            onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                            className={`h-12 ${errors.ownerEmail ? 'border-red-500' : ''}`}
                          />
                          {errors.ownerEmail && (
                            <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Owner Phone *
                          </label>
                          <Input
                            type="tel"
                            value={formData.ownerPhone}
                            onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                            placeholder="(555) 123-4567"
                            className={`h-12 ${errors.ownerPhone ? 'border-red-500' : ''}`}
                          />
                          {errors.ownerPhone && (
                            <p className="text-red-500 text-sm mt-1">{errors.ownerPhone}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Phone *
                          </label>
                          <Input
                            type="tel"
                            value={formData.businessPhone}
                            onChange={(e) => setFormData({...formData, businessPhone: e.target.value})}
                            placeholder="(555) 123-4567"
                            className={`h-12 ${errors.businessPhone ? 'border-red-500' : ''}`}
                          />
                          {errors.businessPhone && (
                            <p className="text-red-500 text-sm mt-1">{errors.businessPhone}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Website
                          </label>
                          <Input
                            type="url"
                            value={formData.businessWebsite}
                            onChange={(e) => setFormData({...formData, businessWebsite: e.target.value})}
                            placeholder="https://www.example.com"
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Owner SSN (Last 4 digits)
                        </label>
                        <Input
                          value={formData.ownerSSN}
                          onChange={(e) => setFormData({...formData, ownerSSN: e.target.value})}
                          placeholder="XXXX"
                          maxLength={4}
                          className="h-12"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Processing Details */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monthly Volume *
                          </label>
                          <Input
                            type="number"
                            value={formData.monthlyVolume}
                            onChange={(e) => setFormData({...formData, monthlyVolume: e.target.value})}
                            placeholder="50000"
                            className={`h-12 ${errors.monthlyVolume ? 'border-red-500' : ''}`}
                          />
                          {errors.monthlyVolume && (
                            <p className="text-red-500 text-sm mt-1">{errors.monthlyVolume}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Average Ticket *
                          </label>
                          <Input
                            type="number"
                            value={formData.averageTicket}
                            onChange={(e) => setFormData({...formData, averageTicket: e.target.value})}
                            placeholder="50"
                            className={`h-12 ${errors.averageTicket ? 'border-red-500' : ''}`}
                          />
                          {errors.averageTicket && (
                            <p className="text-red-500 text-sm mt-1">{errors.averageTicket}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            High Ticket *
                          </label>
                          <Input
                            type="number"
                            value={formData.highTicket}
                            onChange={(e) => setFormData({...formData, highTicket: e.target.value})}
                            placeholder="500"
                            className={`h-12 ${errors.highTicket ? 'border-red-500' : ''}`}
                          />
                          {errors.highTicket && (
                            <p className="text-red-500 text-sm mt-1">{errors.highTicket}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Products/Services Description *
                        </label>
                        <Textarea
                          value={formData.productsServices}
                          onChange={(e) => setFormData({...formData, productsServices: e.target.value})}
                          placeholder="Describe what you sell or the services you provide..."
                          rows={4}
                          className={errors.productsServices ? 'border-red-500' : ''}
                        />
                        {errors.productsServices && (
                          <p className="text-red-500 text-sm mt-1">{errors.productsServices}</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Processor (if any)
                          </label>
                          <Input
                            value={formData.currentProcessor}
                            onChange={(e) => setFormData({...formData, currentProcessor: e.target.value})}
                            placeholder="e.g., Square, Clover, etc."
                            className="h-12"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Switch
                          </label>
                          <Input
                            value={formData.reasonForSwitch}
                            onChange={(e) => setFormData({...formData, reasonForSwitch: e.target.value})}
                            placeholder="e.g., High fees, poor service"
                            className="h-12"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Banking Information */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <p className="text-sm text-blue-800">
                          <strong>Secure Information:</strong> Your banking details are encrypted and will only be used to set up your merchant account.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name *
                        </label>
                        <Input
                          value={formData.bankName}
                          onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                          className={`h-12 ${errors.bankName ? 'border-red-500' : ''}`}
                        />
                        {errors.bankName && (
                          <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Type *
                        </label>
                        <Select 
                          value={formData.accountType}
                          onValueChange={(value) => setFormData({...formData, accountType: value})}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checking">Checking</SelectItem>
                            <SelectItem value="savings">Savings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Routing Number *
                          </label>
                          <Input
                            value={formData.routingNumber}
                            onChange={(e) => setFormData({...formData, routingNumber: e.target.value})}
                            placeholder="9 digits"
                            maxLength={9}
                            className={`h-12 ${errors.routingNumber ? 'border-red-500' : ''}`}
                          />
                          {errors.routingNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.routingNumber}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Number *
                          </label>
                          <Input
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                            className={`h-12 ${errors.accountNumber ? 'border-red-500' : ''}`}
                          />
                          {errors.accountNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Review & Submit */}
                  {currentStep === 5 && (
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
                            <div><span className="font-semibold">Legal Name:</span> {formData.businessLegalName}</div>
                            <div><span className="font-semibold">DBA:</span> {formData.dbaName || "N/A"}</div>
                            <div><span className="font-semibold">Type:</span> {formData.businessType}</div>
                            <div><span className="font-semibold">Merchant Type:</span> {formData.merchantType}</div>
                            <div><span className="font-semibold">Tax ID:</span> {formData.taxId}</div>
                            <div><span className="font-semibold">Years in Business:</span> {formData.yearsInBusiness}</div>
                            <div className="md:col-span-2"><span className="font-semibold">Address:</span> {formData.businessAddress}, {formData.businessCity}, {formData.businessState} {formData.businessZip}</div>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-amber-600" />
                            Contact Information
                          </h3>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div><span className="font-semibold">Owner:</span> {formData.ownerFirstName} {formData.ownerLastName}</div>
                            <div><span className="font-semibold">Title:</span> {formData.ownerTitle || "N/A"}</div>
                            <div><span className="font-semibold">Email:</span> {formData.ownerEmail}</div>
                            <div><span className="font-semibold">Owner Phone:</span> {formData.ownerPhone}</div>
                            <div><span className="font-semibold">Business Phone:</span> {formData.businessPhone}</div>
                            <div><span className="font-semibold">Website:</span> {formData.businessWebsite || "N/A"}</div>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-amber-600" />
                            Processing Details
                          </h3>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div><span className="font-semibold">Monthly Volume:</span> ${formData.monthlyVolume}</div>
                            <div><span className="font-semibold">Average Ticket:</span> ${formData.averageTicket}</div>
                            <div><span className="font-semibold">High Ticket:</span> ${formData.highTicket}</div>
                            <div><span className="font-semibold">Current Processor:</span> {formData.currentProcessor || "N/A"}</div>
                            <div className="md:col-span-2"><span className="font-semibold">Products/Services:</span> {formData.productsServices}</div>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-amber-600" />
                            Banking Information
                          </h3>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div><span className="font-semibold">Bank:</span> {formData.bankName}</div>
                            <div><span className="font-semibold">Account Type:</span> {formData.accountType}</div>
                            <div><span className="font-semibold">Routing:</span> {formData.routingNumber}</div>
                            <div><span className="font-semibold">Account:</span> ****{formData.accountNumber.slice(-4)}</div>
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
                    {currentStep < 5 ? (
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
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                        {!isSubmitting && <CheckCircle2 className="w-5 h-5 ml-2" />}
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