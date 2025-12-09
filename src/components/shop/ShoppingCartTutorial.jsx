import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, CreditCard, Package, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShoppingCartTutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenShopTutorial');
    if (!hasSeenTutorial) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const steps = [
    {
      icon: ShoppingCart,
      title: "Welcome to Our Shop!",
      description: "Browse our payment processing equipment and add items to your cart. Click 'Add to cart' on any product to get started."
    },
    {
      icon: Package,
      title: "Manage Your Cart",
      description: "Use the + and - buttons to adjust quantities. Your cart total updates automatically. View your cart anytime by clicking the cart icon."
    },
    {
      icon: CreditCard,
      title: "Easy Checkout",
      description: "When ready, click the cart button to proceed to checkout. We accept all major credit cards with secure payment processing."
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenShopTutorial', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleSkip}
          />

          {/* Tutorial Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <Card className="shadow-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                    <CurrentIcon className="w-6 h-6 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSkip}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {steps[currentStep].description}
                </p>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {steps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentStep
                          ? "w-8 bg-amber-500"
                          : "w-2 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip Tutorial
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    {currentStep < steps.length - 1 ? (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      "Get Started"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}