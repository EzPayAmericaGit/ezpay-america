import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const navigationItems = React.useMemo(() => [
    { title: "Home", url: createPageUrl("Home") },
    { 
      title: "Services", 
      url: createPageUrl("Services"),
      submenu: [
        { title: "Retail Merchants", url: createPageUrl("RetailMerchants") },
        { title: "Restaurant Merchants", url: createPageUrl("RestaurantMerchants") },
        { title: "Web Payment Pages", url: createPageUrl("WebPaymentPages") },
        { title: "Get A Merchant Cash Advance", url: createPageUrl("MerchantCashAdvance") },
        { title: "Retail Payment Solutions", url: createPageUrl("RetailPaymentSolutions") }
      ]
    },
    { 
      title: "EzPay POS", 
      url: createPageUrl("EzPayPOSHome"),
      submenu: [
        { title: "Retail POS", url: createPageUrl("RetailPOS") },
        { title: "Restaurant POS", url: createPageUrl("RestaurantPOS") },
        { title: "Cafe & Coffee Shops", url: createPageUrl("CoffeePOS") },
        { title: "Bagel Shops", url: createPageUrl("BagelShopPOS") },
        { title: "Food Trucks", url: createPageUrl("FoodTruckPOS") },
        { title: "Deli Shops", url: createPageUrl("DeliShopPOS") },
        { title: "Bars & Taverns", url: createPageUrl("BarTavernPOS") },
        { title: "Grocery Stores", url: createPageUrl("GroceryStorePOS") },
        { title: "CBD Stores", url: createPageUrl("CBDStorePOS") },
        { title: "Vape Stores", url: createPageUrl("VapeStorePOS") },
        { title: "Mini Markets", url: createPageUrl("MiniMarketPOS") },
        { title: "Liquor Stores", url: createPageUrl("LiquorStorePOS") },
        { title: "Gift Shops", url: createPageUrl("GiftShopPOS") }
      ]
    },
    { title: "Quiz", url: createPageUrl("Quiz") },
    { title: "Apply Online", url: createPageUrl("ApplyOnline") },
    { title: "Contact Us", url: createPageUrl("Contact") },
    { title: "Support", url: createPageUrl("Support") },
    { title: "News", url: createPageUrl("News") }
  ], [user]);

  // Live Chat - Opens Crisp chat or alternative
  const openLiveChat = () => {
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  // Make openLiveChat available globally
  React.useEffect(() => {
    window.openLiveChat = openLiveChat;
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AnalyticsTracker />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png" 
                alt="EzPay America - Zero-Fee Payment Processing Solutions"
                className="w-12 h-12 object-contain"
                style={{ filter: 'saturate(1.4) hue-rotate(-5deg) brightness(0.95)' }}
                loading="eager"
                width="48"
                height="48"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  EzPay America
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                item.submenu ? (
                  <div 
                    key={item.title}
                    className="relative group"
                  >
                    <Link
                      to={item.url}
                      className={`flex items-center gap-1 text-gray-700 hover:text-amber-600 font-medium transition-colors ${
                        location.pathname === item.url ? "text-amber-600" : ""
                      }`}
                    >
                      {item.title}
                      <ChevronDown className="w-4 h-4" />
                    </Link>
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.url}
                            className="block px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`text-gray-700 hover:text-amber-600 font-medium transition-colors ${
                      location.pathname === item.url ? "text-amber-600" : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                )
              ))}
              <a href="tel:8653169625">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
                  <Phone className="w-4 h-4 mr-2" />
                  (865) 316-9625
                </Button>
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-4 space-y-3">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  {item.submenu ? (
                    <>
                      <Link
                        to={item.url}
                        className={`block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors ${
                          location.pathname === item.url ? "bg-amber-50 text-amber-600" : ""
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.url}
                          className="block px-8 py-2 text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={item.url}
                      className={`block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors ${
                        location.pathname === item.url ? "bg-amber-50 text-amber-600" : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
              <a href="tel:8653169625" className="block pt-2">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  (865) 316-9625
                </Button>
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-0">
        {children}
      </main>
    </div>
  );
}