import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Truck, CreditCard, Smartphone, BarChart3, Zap, Shield, Wifi,
  Clock, HeadphonesIcon, CheckCircle2, ArrowRight, ChevronDown, ChevronUp,
  MapPin, Star, AlertCircle, TrendingUp, DollarSign
} from "lucide-react";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-amber-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-amber-500 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 leading-relaxed bg-white">{a}</div>}
    </div>
  );
}

const FEATURES = [
  { icon: Smartphone, title: "Mobile-First POS — Tablet or Smartphone", description: "Your full food truck operation lives on a standard tablet or smartphone — no bulky countertop hardware, no cables, nothing that can't handle a festival environment. Mount it in the window, hand it to a second cashier, or use it as a roaming order-taker during your heaviest rushes. Your POS goes wherever you go.", color: "from-amber-500 to-orange-600" },
  { icon: Wifi, title: "4G LTE, WiFi & True Offline Mode", description: "Process payments on cellular data at every location without depending on any venue WiFi network. Offline mode captures transactions locally on the device when you hit a dead zone or network congestion — at a festival, in a tunnel, at a remote catering site. Transactions sync automatically the moment you reconnect. You've never lost a sale from connectivity.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero Transaction Fees — At Every Spot You Park", description: "Whether you're at a Tuesday lunch corner, a Saturday farmers market, or a 3,000-person festival — every card payment has zero processing fees. EzPay America's cash discount program ensures the entire sale amount reaches your account. Keep every dollar you earn at every location you run.", color: "from-green-500 to-emerald-600" },
  { icon: Zap, title: "Speed Queue Processing for Busy Windows", description: "Quick-key menu buttons for your top items let your cashier ring up orders in seconds. NFC tap-to-pay means card processing completes faster than cash handling. Numbered order queue with customer-facing display keeps the crowd organized. The more efficiently you process each order, the more customers you serve per hour.", color: "from-purple-500 to-purple-600" },
  { icon: Truck, title: "Event Mode & Catering Configuration", description: "Switch to event mode before a festival or catering gig — streamlined single-item ordering, high-volume counter, and category-level tracking for event menu reporting. Pre-order management for catering events lets customers order ahead and pick up on schedule, reducing window congestion during peak service.", color: "from-yellow-500 to-amber-600" },
  { icon: BarChart3, title: "Location & Revenue Analytics", description: "At the end of every week, see exactly which spots made you the most money — revenue by location, revenue by day and hour, top-selling menu items at each venue, and average ticket size trends. Use the data to cut unprofitable spots, double down on your best locations, and build a smarter route.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "PCI-Compliant Mobile Card Reader", description: "Full EMV chip, magnetic swipe, and NFC contactless in a compact mobile reader that pairs via Bluetooth. Accepts Apple Pay, Google Pay, Samsung Pay, and every major card network. Battery life covers a full day of service. Fully encrypted, PCI DSS Level 1 certified — complete fraud protection in a device the size of your hand.", color: "from-pink-500 to-pink-600" },
  { icon: Clock, title: "Order Queue & Customer Notifications", description: "Numbered order queue with text notification capability keeps customers informed without crowding the window. Give customers their number, let them walk around, and ping them when their order is ready. Reduce window congestion, improve the customer experience, and move more orders per hour.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Support Before Your Biggest Events", description: "Call us before a major festival, a private catering event, or a high-stakes weekend and we'll do a pre-event check to make sure everything is dialed in. Our support team is available any hour of the day — not just during business hours, not just during the week.", color: "from-indigo-500 to-indigo-600" },
];

const LOCATIONS = [
  { place: "Farmers Markets", icon: "🌿", desc: "WiFi or cellular — no market network dependency. Work any booth layout." },
  { place: "Festivals & Events", icon: "🎪", desc: "Event mode built for high-volume, fast-moving queue processing." },
  { place: "Office Lunch Rounds", icon: "🏢", desc: "Fast line processing keeps the lunch rush profitable and the crowd happy." },
  { place: "Private Catering", icon: "🍽️", desc: "Pre-order management, event totals tracking, and per-event reporting." },
  { place: "Street & Pop-Up Spots", icon: "🌆", desc: "4G LTE means you're never dependent on public or venue WiFi." },
  { place: "Breweries & Taprooms", icon: "🍺", desc: "Quick tap-to-pay service for outdoor events and taproom guest areas." },
  { place: "Corporate Campuses", icon: "🏗️", desc: "Route consistency tools and employee meal program compatibility." },
  { place: "Sporting Events & Stadiums", icon: "🏟️", desc: "High-volume mode, fast reader, and offline backup for crowded venues." },
  { place: "Food Truck Parks", icon: "🅿️", desc: "Multi-location reporting tracks revenue separately for each truck in your fleet." },
];

const FAQS = [
  { q: "How does a food truck accept credit cards with zero fees?", a: "EzPay America's cash discount program displays two prices at the point of sale: a cash price and a card price that includes a small service fee (typically 3–4%). Customers paying with cash receive the lower price. Card customers pay the card price. You pay $0 in processing fees — the same model that gas stations across America have used for decades. Fully legal, fully compliant with Visa and Mastercard rules, and transparent to your customers." },
  { q: "What happens if I lose cell signal at an event?", a: "Nothing stops. The EzPay mobile POS has full offline processing — transactions are stored on the device during any connectivity loss and sync automatically when signal is restored. No sales lost, no void required, no awkward moment at the window. We've had food truck operators run entire festival days in offline mode and reconcile everything in the truck on the drive home." },
  { q: "What card reader hardware do food trucks get?", a: "EzPay America provides a free mobile card reader with EMV chip, magnetic swipe, and NFC contactless capability (Apple Pay, Google Pay, tap cards). The reader pairs with your tablet or smartphone via Bluetooth and holds a full day's battery charge. Extra readers are available for multi-window trucks or two-cashier setups." },
  { q: "Can I use it at multiple locations and track revenue by spot?", a: "Yes — your merchant account works everywhere you go without location-specific configuration. Revenue reports break down by date and location so you can see which spots are your most profitable, which events return the best per-hour numbers, and where you should add or remove stops on your route." },
  { q: "Does the food truck POS support modifiers and daily specials?", a: "Yes. Build your full menu with categories, modifier options (toppings, size, protein swaps, dietary variations), combo deals, and daily specials that activate automatically on your configured schedule. Quick-key buttons for your 10 most-ordered items mean your busiest rushes never slow down at the register." },
  { q: "Do I need a data plan?", a: "A cellular data plan on your tablet or a dedicated mobile hotspot device is recommended for full real-time functionality. Most food truck operators use a tablet with a built-in SIM (like iPad with cellular) or a hotspot device. Offline mode means a lost connection never stops service — you just sync when you're back online." },
  { q: "Can the system handle a fleet of multiple food trucks?", a: "Yes. EzPay America supports multi-truck fleets under a single merchant account with individual reporting per truck. Owners see consolidated revenue across the entire fleet plus truck-by-truck performance breakdowns. Each truck operates independently with its own device and reader." },
];

export default function FoodTruckPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Food Truck POS System – Mobile Zero-Fee Payment Processing for Food Trucks | EzPay America"
        description="The best POS system for food trucks. 4G LTE mobile payments, full offline mode, zero transaction fees, fast queue processing, and a free mobile card reader. Works at festivals, farmers markets, catering events, and every location you park. Apply free today."
        keywords="food truck POS system, mobile POS for food trucks, food truck payment processing, food truck credit card reader, best POS for food truck 2025, food truck merchant services, mobile food vendor payments, zero fee food truck processing, food truck cash discount program, festival payment processing, food truck card reader offline mode, food truck point of sale, food truck Square alternative, mobile payment processor food truck"
        url="https://ezpayamerica.com/FoodTruckPOS"
        pageSchema={[{
          "@type": "Product",
          "name": "EzPay America Food Truck POS System",
          "description": "Mobile POS system for food trucks with 4G LTE, full offline mode, zero transaction fees, and free mobile card reader. Works at every location.",
          "brand": { "@type": "Brand", "name": "EzPay America" },
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "143", "bestRating": "5" }
        }]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-900 via-amber-900 to-slate-900 pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 40%, #f59e0b 0%, transparent 55%)" }} />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-full text-sm font-semibold text-amber-300">
              <Truck className="w-4 h-4" /> Food Truck POS — Works Anywhere. Costs Nothing.
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              The POS That<br />Goes Where<br />
              <span className="text-amber-400">Your Truck Goes</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              EzPay America's food truck POS processes payments anywhere your truck stops — festivals, markets, lunch routes, catering events, and private spots — on <strong className="text-white">4G LTE, WiFi, or offline mode</strong> with <strong className="text-white">$0 in transaction fees</strong> and a free mobile card reader.
            </p>
            <ul className="space-y-3">
              {[
                "Works on 4G LTE, WiFi, and full offline mode",
                "Free mobile card reader — EMV chip + NFC + swipe",
                "Zero transaction fees at every location you sell",
                "Fast walk-up queue processing built for busy windows",
                "Event & catering mode with pre-order management",
                "Revenue tracked per location — see your best spots",
              ].map(b => (
                <li key={b} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all">
                  Get Your Free Food Truck POS <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="tel:8653169625">
                <button className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                  Call (865) 316-9625
                </button>
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=700&h=500&fit=crop"
              alt="Food truck mobile POS system with 4G LTE zero-fee payment processing"
              className="rounded-3xl shadow-2xl w-full h-auto border border-white/10"
              loading="eager" width="700" height="500"
            />
          </div>
        </div>
      </section>

      {/* Cost Reality */}
      <section className="bg-amber-50 border-y border-amber-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <AlertCircle className="w-12 h-12 text-amber-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">What Square Is Taking From Your Food Truck Right Now</h2>
              <p className="text-gray-700 leading-relaxed">
                A food truck processing <strong>$15,000/month</strong> with Square pays <strong>$390+ per month</strong> in transaction fees at 2.6% + 10¢. Over a year, that's <strong>$4,680+ going to Square</strong> — from a business with already-tight margins. EzPay America brings that cost to <strong>$0</strong>. For a fleet operator running three trucks at $15k each, the savings exceed <strong>$14,000 per year</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where It Works */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Accept Payments Anywhere You Park</h2>
          <p className="text-gray-300 mb-10">Zero fees, full functionality — everywhere your truck goes. No venue WiFi required. No signal, no problem.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {LOCATIONS.map(p => (
              <div key={p.place} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-amber-500 transition-colors text-center space-y-2">
                <div className="text-3xl">{p.icon}</div>
                <div className="font-bold text-white">{p.place}</div>
                <div className="text-gray-400 text-sm">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Built for Mobile. Built for Volume. Built for the Street.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Every feature engineered specifically for food trucks, mobile vendors, and high-volume outdoor food service — not retrofitted from a countertop retail system.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Food Truck Operators Choose EzPay America Over Square and PayPal</h2>
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>
              Running a food truck is a margin game. You're managing food costs, labor, fuel, commissary fees, and event permit costs while pricing your menu to attract customers in a competitive street-food market. At 2.6% + 10¢ per swipe, Square takes $390 per month from a truck doing $15,000 in card sales — money that could cover an extra festival permit, a month of commissary, or a month of ingredient supplies.
            </p>
            <p>
              EzPay America's cash discount program eliminates that expense entirely. The service fee is displayed transparently on the payment terminal before the customer taps or swipes. Food truck customers — particularly at festivals and markets — are accustomed to seeing price boards and making purchase decisions based on posted prices. The cash discount model works well in these environments because the pricing is visible before the transaction begins, not revealed as an additional charge after.
            </p>
            <p>
              The offline mode is the single most important differentiator for food truck operators. Festival WiFi is notoriously unreliable. Street corners don't have network infrastructure. Catering venues have inconsistent cellular coverage. Standard payment processors that require an active internet connection create unacceptable risk for a food truck running during a 3-hour lunch rush. EzPay America processes transactions locally during any connectivity gap and reconciles automatically — no voided sales, no awkward cash-only signs.
            </p>
            <p>
              For food truck operators building a serious business, the analytics matter as much as the payments. Revenue tracked by date and location reveals which spots are truly profitable — accounting for time spent, competition, and foot traffic versus volume on other routes. Menu analytics show which items drive ticket averages and which are drag items slowing down your line. Smart operators use this data to trim menus, adjust routes, and focus on the venues and hours that generate the best return.
            </p>
          </div>
        </div>
      </section>

      {/* Savings */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Stop Giving Your Earnings to Square</h2>
          <p className="text-gray-500 mb-10">Square charges 2.6% + 10¢ per swipe. EzPay America charges $0. The difference adds up fast.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { vol: "$5k/mo", save: "$130", yr: "$1,560/yr" },
              { vol: "$10k/mo", save: "$260", yr: "$3,120/yr" },
              { vol: "$20k/mo", save: "$520", yr: "$6,240/yr" },
              { vol: "$40k/mo", save: "$1,040", yr: "$12,480/yr" },
            ].map(r => (
              <div key={r.vol} className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow text-center space-y-2">
                <div className="text-amber-600 font-bold text-lg">{r.vol}</div>
                <div className="text-gray-400 text-sm">Monthly Volume</div>
                <div className="border-t border-amber-100 pt-3 mt-2">
                  <div className="text-3xl font-bold text-green-600">{r.save}</div>
                  <div className="text-gray-500 text-sm">saved/month</div>
                  <div className="text-gray-900 font-bold mt-1">{r.yr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Food Truck POS — Your Questions Answered</h2>
          <p className="text-gray-500 text-center mb-10">Real answers to what food truck operators ask before switching from Square:</p>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-white fill-white" />)}
          </div>
          <h2 className="text-4xl font-bold">Power Your Food Truck With EzPay America</h2>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">Mobile. Zero fees. Free hardware. Works offline. Approved in 24 hours. The most complete food truck POS available — at no cost.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("ApplyOnline")}>
              <button className="w-full sm:w-auto bg-white text-amber-600 hover:bg-amber-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-colors">
                Apply Free — No Contract
              </button>
            </Link>
            <a href="tel:8653169625">
              <button className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-xl font-semibold text-lg transition-colors">
                Call (865) 316-9625
              </button>
            </a>
          </div>
          <p className="text-amber-200 text-sm">Approved in 24 hours · Free mobile hardware · No monthly fees · No transaction fees</p>
        </div>
      </section>
    </div>
  );
}