import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft, RefreshCw, Store, Briefcase, ShoppingBag, Coffee, Home, Activity, AlertCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const steps = [
  { id: 1, name: "Getting Started", icon: Store },
  { id: 2, name: "Upgrade", icon: RefreshCw },
  { id: 3, name: "Industry", icon: Briefcase },
  { id: 4, name: "System", icon: Activity },
  { id: 5, name: "Sales", icon: ShoppingBag },
  { id: 6, name: "Timeline", icon: Coffee }
];

const industries = {
  retail: ["Grocery", "Apparel", "Liquor", "Sporting Goods", "Nursery", "Other"],
  foodBeverage: ["Full Service", "Quick Service", "Bar/NightClub", "Coffee Shop", "Food Truck", "Other"],
  services: ["Home Services", "Agency", "Hotel", "Clinic", "Auto", "Other"],
  highRisk: ["CBD", "Smoke/Vape", "Kratom", "SEO/Digital Marketing", "Credit Repair", "Nutraceutical", "Other"]
};

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessType: "",
    upgradeReasons: [],
    currentProvider: "",
    industry: "",
    subSector: "",
    systems: [],
    monthlySales: 10000,
    timeline: "",
    // Contact form
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    state: "",
    message: ""
  });

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setShowResults(false);
    setFormData({
      businessType: "",
      upgradeReasons: [],
      currentProvider: "",
      industry: "",
      subSector: "",
      systems: [],
      monthlySales: 10000,
      timeline: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      businessName: "",
      state: "",
      message: ""
    });
  };

  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await base44.functions.invoke('sendContactEmail', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      businessName: formData.businessName,
      service: 'Quiz Lead',
      message: `Business Type: ${formData.businessType === 'existing' ? 'Existing' : 'New'} | Industry: ${formData.industry} - ${formData.subSector} | Provider: ${formData.currentProvider || 'N/A'} | Upgrade: ${formData.upgradeReasons.join(', ') || 'N/A'} | Systems: ${formData.systems.join(', ') || 'N/A'} | Sales: $${formData.monthlySales.toLocaleString()} | Timeline: ${formData.timeline} | State: ${formData.state} | Message: ${formData.message || 'None'}`
    });
    
    setIsSubmitting(false);
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Payment Solution Finder Quiz - Find Your Perfect POS System"
        description="Take our quick interactive quiz to discover the best payment processing and POS solution tailored to your business type, industry, and needs. Get personalized recommendations in minutes with free consultation included."
        keywords="payment solution quiz, POS system finder, payment processing quiz, merchant services quiz, business payment quiz, find my POS system, POS system selector, payment solution finder, business type quiz, industry solution finder, which POS system, best POS for my business, payment processing recommendations, merchant services finder, business needs assessment, solution matcher, payment calculator, POS comparison tool, free consultation, business evaluation quiz, payment needs analysis, custom solution finder, tailored recommendations, personalized payment solutions"
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Quiz</h1>
            <p className="text-xl text-gray-800 mb-8">
              Work smarter, automate for efficiency, and open up new revenue streams.
            </p>
            <Link to={createPageUrl("ApplyOnline")}>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg shadow-xl">
                Apply Online
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {!showResults ? (
        <section className="py-20 bg-gray-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        currentStep >= step.id ? 'bg-amber-500' : 'bg-gray-700'
                      }`}>
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className={`mt-2 text-sm font-medium ${
                        currentStep >= step.id ? 'text-amber-400' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 ${
                        currentStep > step.id ? 'bg-amber-500' : 'bg-gray-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Question Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-2xl bg-white">
                  <CardContent className="p-8 md:p-12">
                    {/* Step 1: Getting Started */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">What Defines <span className="text-amber-600">You Best?</span></h2>
                        <p className="text-gray-600">Please select one of the below options.</p>
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          <button
                            onClick={() => setFormData({...formData, businessType: "existing"})}
                            className={`p-8 rounded-2xl border-2 transition-all ${
                              formData.businessType === "existing"
                                ? "border-amber-500 bg-amber-50"
                                : "border-gray-200 hover:border-amber-300"
                            }`}
                          >
                            <RefreshCw className={`w-12 h-12 mx-auto mb-4 ${
                              formData.businessType === "existing" ? "text-amber-600" : "text-gray-400"
                            }`} />
                            <h3 className="text-xl font-bold text-gray-900">I have an existing business.</h3>
                          </button>
                          <button
                            onClick={() => setFormData({...formData, businessType: "new"})}
                            className={`p-8 rounded-2xl border-2 transition-all ${
                              formData.businessType === "new"
                                ? "border-amber-500 bg-amber-50"
                                : "border-gray-200 hover:border-amber-300"
                            }`}
                          >
                            <Store className={`w-12 h-12 mx-auto mb-4 ${
                              formData.businessType === "new" ? "text-amber-600" : "text-gray-400"
                            }`} />
                            <h3 className="text-xl font-bold text-gray-900">I'm opening a new business.</h3>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Upgrade */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Why Are You Looking To Upgrade?</h2>
                        <p className="text-gray-600">Select as many as you'd like.</p>
                        <div className="grid md:grid-cols-3 gap-4 mt-8">
                          {["It's slow", "It's hard to use", "Limited Functionality", "High Fees", "Other"].map((reason) => (
                            <button
                              key={reason}
                              onClick={() => setFormData({
                                ...formData,
                                upgradeReasons: toggleArrayItem(formData.upgradeReasons, reason)
                              })}
                              className={`p-6 rounded-xl border-2 transition-all ${
                                formData.upgradeReasons.includes(reason)
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-gray-200 hover:border-amber-300"
                              }`}
                            >
                              <h3 className="font-bold text-gray-900">{reason}</h3>
                            </button>
                          ))}
                        </div>
                        <div className="mt-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Who is your current provider? *
                          </label>
                          <Select value={formData.currentProvider} onValueChange={(value) => setFormData({...formData, currentProvider: value})}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Square">Square</SelectItem>
                              <SelectItem value="Clover">Clover</SelectItem>
                              <SelectItem value="Toast">Toast</SelectItem>
                              <SelectItem value="Revel">Revel</SelectItem>
                              <SelectItem value="Aloha">Aloha</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Industry */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">What Industry Are You In?</h2>
                        <p className="text-gray-600">If you don't have a business yet, please select the industry it will be under.</p>
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          {[
                            { value: "retail", label: "Retail", icon: ShoppingBag },
                            { value: "foodBeverage", label: "Food & Beverage", icon: Coffee },
                            { value: "services", label: "Services", icon: Briefcase },
                            { value: "highRisk", label: "High Risk", icon: AlertCircle }
                          ].map((ind) => (
                            <button
                              key={ind.value}
                              onClick={() => setFormData({...formData, industry: ind.value, subSector: ""})}
                              className={`p-8 rounded-2xl border-2 transition-all ${
                                formData.industry === ind.value
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-gray-200 hover:border-amber-300"
                              }`}
                            >
                              <ind.icon className={`w-12 h-12 mx-auto mb-4 ${
                                formData.industry === ind.value ? "text-amber-600" : "text-gray-400"
                              }`} />
                              <h3 className="text-xl font-bold text-gray-900">{ind.label}</h3>
                            </button>
                          ))}
                        </div>
                        {formData.industry && (
                          <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Please select a sub-sector:
                            </label>
                            <Select value={formData.subSector} onValueChange={(value) => setFormData({...formData, subSector: value})}>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select sub-sector" />
                              </SelectTrigger>
                              <SelectContent>
                                {industries[formData.industry]?.map((sub) => (
                                  <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 4: System */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">What Systems Apply To You?</h2>
                        <p className="text-gray-600">You can select multiple or unsure if you don't have a preference or haven't decided yet.</p>
                        <div className="grid md:grid-cols-3 gap-4 mt-8">
                          {[
                            "Mobile / Handhelds",
                            "Unique Barcodes",
                            "Integrated Scale",
                            "Gift Cards",
                            "E-Commerce / Online Ordering",
                            "Loyalty",
                            "Inventory",
                            "E-Invoicing"
                          ].map((system) => (
                            <button
                              key={system}
                              onClick={() => setFormData({
                                ...formData,
                                systems: toggleArrayItem(formData.systems, system)
                              })}
                              className={`p-6 rounded-xl border-2 transition-all ${
                                formData.systems.includes(system)
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-gray-200 hover:border-amber-300"
                              }`}
                            >
                              <h3 className="font-bold text-gray-900">{system}</h3>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 5: Sales */}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Monthly Sales Volume</h2>
                        <p className="text-gray-600">Slide to select your approximate monthly sales.</p>
                        <div className="mt-8">
                          <div className="text-center mb-6">
                            <span className="text-4xl font-bold text-amber-600">
                              ${formData.monthlySales.toLocaleString()}
                            </span>
                          </div>
                          <Slider
                            value={[formData.monthlySales]}
                            onValueChange={([value]) => setFormData({...formData, monthlySales: value})}
                            min={0}
                            max={100000}
                            step={2500}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-2">
                            <span>$0</span>
                            <span>$100,000</span>
                          </div>
                        </div>
                        <div className="mt-6">
                          <button
                            onClick={() => setFormData({...formData, monthlySales: 0})}
                            className="text-amber-600 hover:text-amber-700 font-medium"
                          >
                            I don't have numbers yet
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 6: Timeline */}
                    {currentStep === 6 && (
                      <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">How Soon Are You Looking To Implement?</h2>
                        <p className="text-gray-600">It's ok to guess if you don't have a set timeframe.</p>
                        <div className="grid md:grid-cols-3 gap-6 mt-8">
                          {[
                            { value: "urgent", label: "< 1 month", subtitle: "Urgent" },
                            { value: "2-3months", label: "2-3 month", subtitle: "Standard" },
                            { value: "4+months", label: "+4 month", subtitle: "Standard" }
                          ].map((time) => (
                            <button
                              key={time.value}
                              onClick={() => setFormData({...formData, timeline: time.value})}
                              className={`p-8 rounded-2xl border-2 transition-all ${
                                formData.timeline === time.value
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-gray-200 hover:border-amber-300"
                              }`}
                            >
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{time.label}</h3>
                              <p className="text-gray-600">{time.subtitle}</p>
                            </button>
                          ))}
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
                      <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg"
                      >
                        {currentStep === 6 ? "See Results" : "Next"}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Based On Your Answers We Recommend
                </h2>
                <p className="text-xl text-gray-300">
                  In order to provide the best solution for you meet with a local sales rep. If you're interested fill out the contact form below and someone will be in touch!
                </p>
                <div className="flex gap-4 justify-center mt-6">
                  <Button onClick={handleReset} variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-50">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </Button>
                  <Link to={createPageUrl("Home")}>
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      Return To Site
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Recommended Solutions */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {[
                  { name: "Pay Simple", image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop" },
                  { name: "EzPay POS", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop" },
                  { name: "Clover", image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300&fit=crop" }
                ].map((solution, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-none shadow-xl overflow-hidden">
                      <img 
                        src={solution.image} 
                        alt={`${solution.name} - Complete POS and payment processing solution for your business`} 
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        width="400"
                        height="300"
                      />
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{solution.name}</h3>
                        <p className="text-gray-600">
                          Manage everything from one system built for restaurant and retail businesses.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="border-none shadow-2xl">
                  <CardContent className="p-8">
                    {contactSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ArrowRight className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                        <p className="text-gray-600">A representative will contact you shortly.</p>
                      </div>
                    ) : (
                    <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in touch with a rep today.</h3>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input 
                          placeholder="First name" 
                          className="h-12" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                        />
                        <Input 
                          placeholder="Last name" 
                          className="h-12" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                        />
                      </div>
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        className="h-12" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                      <Input 
                        type="tel" 
                        placeholder="Phone number" 
                        className="h-12" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                      <Input 
                        placeholder="Business Name" 
                        className="h-12" 
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        required
                      />
                      <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NC">North Carolina</SelectItem>
                          <SelectItem value="TN">Tennessee</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea 
                        placeholder="Message" 
                        rows={4} 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-12 text-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </form>
                    </>
                    )}
                  </CardContent>
                </Card>

                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556742521-9713bf272865?w=800&h=600&fit=crop"
                    alt="Business owner reviewing payment processing solutions and POS system recommendations"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="800"
                    height="600"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}