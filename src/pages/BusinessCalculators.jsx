import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function BusinessCalculators() {
  const [savingsCalc, setSavingsCalc] = useState({
    monthlyVolume: "",
    currentRate: "",
    averageTicket: ""
  });

  const [savingsResult, setSavingsResult] = useState(null);

  const calculateSavings = () => {
    const volume = parseFloat(savingsCalc.monthlyVolume) || 0;
    const rate = parseFloat(savingsCalc.currentRate) || 0;
    const ticket = parseFloat(savingsCalc.averageTicket) || 0;

    const currentFees = volume * (rate / 100);
    const ezpayFees = 0; // Zero-fee processing
    const monthlySavings = currentFees - ezpayFees;
    const annualSavings = monthlySavings * 12;
    const transactions = volume / ticket;

    setSavingsResult({
      monthlySavings,
      annualSavings,
      currentFees,
      transactions: Math.round(transactions)
    });
  };

  const [roiCalc, setRoiCalc] = useState({
    currentSystemCost: "",
    monthlySavings: "",
    setupCost: ""
  });

  const [roiResult, setRoiResult] = useState(null);

  const calculateROI = () => {
    const currentCost = parseFloat(roiCalc.currentSystemCost) || 0;
    const savings = parseFloat(roiCalc.monthlySavings) || 0;
    const setup = parseFloat(roiCalc.setupCost) || 0;

    const monthsToBreakEven = setup / savings;
    const firstYearSavings = (savings * 12) - setup;
    const fiveYearSavings = (savings * 60) - setup;

    setRoiResult({
      monthsToBreakEven: monthsToBreakEven.toFixed(1),
      firstYearSavings,
      fiveYearSavings
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Business Calculators"
        description="Calculate your savings with EzPay America's zero-fee payment processing. Use our calculators to see how much you can save on transaction fees and compare ROI."
        keywords="payment processing calculator, transaction fee calculator, merchant services savings, ROI calculator, business calculator"
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
            <Calculator className="w-16 h-16 text-gray-900 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Business Calculators
            </h1>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              See how much you can save with EzPay America's zero-fee payment processing
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculators Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Savings Calculator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-xl border-2 border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <DollarSign className="w-8 h-8" />
                    Savings Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Processing Volume ($)
                    </label>
                    <Input
                      type="number"
                      value={savingsCalc.monthlyVolume}
                      onChange={(e) => setSavingsCalc({...savingsCalc, monthlyVolume: e.target.value})}
                      placeholder="50000"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Processing Rate (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={savingsCalc.currentRate}
                      onChange={(e) => setSavingsCalc({...savingsCalc, currentRate: e.target.value})}
                      placeholder="2.9"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Transaction Amount ($)
                    </label>
                    <Input
                      type="number"
                      value={savingsCalc.averageTicket}
                      onChange={(e) => setSavingsCalc({...savingsCalc, averageTicket: e.target.value})}
                      placeholder="45"
                      className="h-12"
                    />
                  </div>

                  <Button 
                    onClick={calculateSavings}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-12 text-lg"
                  >
                    Calculate Savings
                  </Button>

                  {savingsResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Current Monthly Fees:</span>
                        <span className="text-2xl font-bold text-red-600">
                          ${savingsResult.currentFees.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">EzPay Monthly Fees:</span>
                        <span className="text-2xl font-bold text-green-600">$0.00</span>
                      </div>
                      <div className="border-t-2 border-green-300 pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-bold">Monthly Savings:</span>
                          <span className="text-3xl font-bold text-green-600">
                            ${savingsResult.monthlySavings.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 font-bold">Annual Savings:</span>
                          <span className="text-3xl font-bold text-green-600">
                            ${savingsResult.annualSavings.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-center pt-2">
                        Based on {savingsResult.transactions.toLocaleString()} transactions per month
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* ROI Calculator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-xl border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <TrendingUp className="w-8 h-8" />
                    ROI Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current System Monthly Cost ($)
                    </label>
                    <Input
                      type="number"
                      value={roiCalc.currentSystemCost}
                      onChange={(e) => setRoiCalc({...roiCalc, currentSystemCost: e.target.value})}
                      placeholder="500"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Monthly Savings ($)
                    </label>
                    <Input
                      type="number"
                      value={roiCalc.monthlySavings}
                      onChange={(e) => setRoiCalc({...roiCalc, monthlySavings: e.target.value})}
                      placeholder="1200"
                      className="h-12"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use the Savings Calculator above to estimate</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      One-Time Setup Cost ($)
                    </label>
                    <Input
                      type="number"
                      value={roiCalc.setupCost}
                      onChange={(e) => setRoiCalc({...roiCalc, setupCost: e.target.value})}
                      placeholder="0"
                      className="h-12"
                    />
                    <p className="text-xs text-gray-500 mt-1">EzPay offers free equipment and setup</p>
                  </div>

                  <Button 
                    onClick={calculateROI}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white h-12 text-lg"
                  >
                    Calculate ROI
                  </Button>

                  {roiResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Break-Even Point:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {roiResult.monthsToBreakEven} months
                        </span>
                      </div>
                      <div className="border-t-2 border-blue-300 pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-900 font-bold">First Year Savings:</span>
                          <span className="text-3xl font-bold text-green-600">
                            ${roiResult.firstYearSavings.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 font-bold">5-Year Savings:</span>
                          <span className="text-3xl font-bold text-green-600">
                            ${roiResult.fiveYearSavings.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Choose EzPay America?
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-amber-600">Zero Transaction Fees</h4>
                    <p className="text-gray-600">
                      Unlike traditional processors, we offer zero-fee processing, saving you thousands annually.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-amber-600">Free Equipment</h4>
                    <p className="text-gray-600">
                      Get state-of-the-art payment terminals at no cost. No monthly rental fees.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-amber-600">No Contracts</h4>
                    <p className="text-gray-600">
                      Month-to-month service with no long-term commitments or cancellation fees.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses already saving with EzPay America's zero-fee payment processing.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to={createPageUrl("ApplyOnline")}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                  Apply Online Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}