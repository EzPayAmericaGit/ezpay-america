import React, { useState, useEffect } from "react";
import SEOHead from "../components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2, XCircle, AlertTriangle, ExternalLink, Search,
  RefreshCw, FileText, Globe, Loader2, Info
} from "lucide-react";

const BASE_URL = "https://ezpayamerica.com";

// All public landing page routes
const LANDING_PAGES = [
  { label: "Home", path: "/" },
  { label: "Apply Online", path: "/ApplyOnline" },
  { label: "Services", path: "/Services" },
  { label: "EzPay POS", path: "/EzPayPOSHome" },
  { label: "Cash Discount Program", path: "/CashDiscountProgram" },
  { label: "Tap to Pay", path: "/TapToPay" },
  { label: "Gift Card Program", path: "/GiftCardProgram" },
  { label: "Loyalty Program", path: "/LoyaltyProgram" },
  { label: "POS Financing", path: "/PointOfSaleFinancing" },
  { label: "Retail Payment Solutions", path: "/RetailPaymentSolutions" },
  { label: "ACH Payments", path: "/ACHPayments" },
  { label: "Mobile Payments", path: "/MobilePayments" },
  { label: "E-Commerce", path: "/ECommerce" },
  { label: "Merchant Cash Advance", path: "/MerchantCashAdvance" },
  { label: "Merchant Capital", path: "/MerchantCapital" },
  { label: "Fraud Detection", path: "/FraudDetection" },
  { label: "Web Payment Pages", path: "/WebPaymentPages" },
  { label: "Branded Payment Gateway", path: "/BrandedPaymentGateway" },
  { label: "Retail Merchants", path: "/RetailMerchants" },
  { label: "Restaurant Merchants", path: "/RestaurantMerchants" },
  { label: "Retail POS", path: "/RetailPOS" },
  { label: "Restaurant POS", path: "/RestaurantPOS" },
  { label: "Book Appointment", path: "/BookAppointment" },
  { label: "FAQ", path: "/FAQ" },
  { label: "News", path: "/News" },
  { label: "Contact", path: "/Contact" },
  { label: "Affiliate Signup", path: "/AffiliateSignup" },
  { label: "Affiliate Leaderboard", path: "/AffiliateLeaderboard" },
  { label: "Full Service Restaurant POS", path: "/FullServiceRestaurantPOS" },
  { label: "Quick Service POS", path: "/QuickServicePOS" },
  { label: "Coffee POS", path: "/CoffeePOS" },
  { label: "Food Truck POS", path: "/FoodTruckPOS" },
  { label: "Bar/Tavern POS", path: "/BarTavernPOS" },
  { label: "Bakery POS", path: "/BakeryPOS" },
  { label: "Hair Salon POS", path: "/HairSalonPOS" },
  { label: "Dental Office POS", path: "/DentalOfficePOS" },
  { label: "Law Firm POS", path: "/LawFirmPOS" },
  { label: "HVAC POS", path: "/HVACCompanyPOS" },
  { label: "Plumbing POS", path: "/PlumbingServicesPOS" },
];

const COMMON_ISSUES = [
  {
    id: "spa_js",
    label: "JavaScript SPA — requires rendering",
    detail: "Google must render JS to see content. Pages may be queued for rendering, causing delays of days to weeks.",
    severity: "warning",
  },
  {
    id: "no_prerender",
    label: "No server-side rendering / prerendering",
    detail: "Without SSR or prerendering, Googlebot sees a blank HTML shell until it renders the JS. Consider using a prerendering service.",
    severity: "error",
  },
  {
    id: "sitemap_url",
    label: "Sitemap may reference wrong URLs",
    detail: "The sitemap index must point to /api/sitemapXml?type=... not /sitemap.xml?type=... — confirm this is fixed.",
    severity: "warning",
  },
  {
    id: "canonical",
    label: "Canonical tags set dynamically",
    detail: "Canonical tags are injected by React (SEOHead component). Until JS renders, Google may not see them.",
    severity: "warning",
  },
  {
    id: "robots_txt",
    label: "robots.txt served via backend function",
    detail: "robots.txt is at /api/robotsTxt — confirm Google Search Console shows it resolving correctly.",
    severity: "info",
  },
  {
    id: "crawl_budget",
    label: "Large site — crawl budget concern",
    detail: "With 200+ location pages × 60+ business types, Google may deprioritize lower-value pages. Focus on key pages first.",
    severity: "warning",
  },
];

function SeverityIcon({ severity }) {
  if (severity === "error") return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
  if (severity === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
  return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
}

function IndexCheckRow({ label, path, onCheck, checkResult }) {
  const url = `${BASE_URL}${path}`;
  const googleSearchUrl = `https://www.google.com/search?q=site:${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-800">{label}</div>
        <div className="text-xs text-gray-400 truncate">{path}</div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {checkResult === "loading" && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        {checkResult === "indexed" && <Badge className="bg-green-100 text-green-700 text-xs">Likely Indexed</Badge>}
        {checkResult === "not_indexed" && <Badge className="bg-red-100 text-red-700 text-xs">Not in Sitemap</Badge>}
        <a
          href={googleSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Check on Google (site: query)"
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Search className="w-3.5 h-3.5 text-gray-400" />
        </a>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open page"
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </a>
      </div>
    </div>
  );
}

export default function IndexingStatus() {
  const [user, setUser] = useState(null);
  const [sitemapData, setSitemapData] = useState(null);
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [sitemapError, setSitemapError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== "admin") window.location.href = "/";
      setUser(u);
    }).catch(() => (window.location.href = "/"));
  }, []);

  const { data: articles = [] } = useQuery({
    queryKey: ["newsArticles"],
    queryFn: () => base44.entities.NewsArticle.filter({ published: true }, "-created_date", 200),
    enabled: !!user,
  });

  const fetchSitemap = async () => {
    setSitemapLoading(true);
    setSitemapError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/sitemapXml?type=static`);
      const text = await res.text();
      // Extract all <loc> tags
      const locs = [...text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
      setSitemapData(locs);
    } catch (e) {
      setSitemapError("Failed to fetch sitemap: " + e.message);
    } finally {
      setSitemapLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchSitemap();
  }, [user]);

  const isInSitemap = (path) => {
    if (!sitemapData) return null;
    const url = `${BASE_URL}${path}`;
    return sitemapData.some(loc => loc === url || loc === url + "/") ? "indexed" : "not_indexed";
  };

  const isArticleInSitemap = (slug) => {
    if (!sitemapData) return null;
    // articles are in news sitemap, not static — mark as "news"
    return "news";
  };

  const filteredLanding = LANDING_PAGES.filter(p =>
    p.label.toLowerCase().includes(search.toLowerCase()) ||
    p.path.toLowerCase().includes(search.toLowerCase())
  );

  const filteredArticles = articles.filter(a =>
    (a.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.slug || "").toLowerCase().includes(search.toLowerCase())
  );

  // Summary stats
  const inSitemapCount = sitemapData
    ? LANDING_PAGES.filter(p => isInSitemap(p.path) === "indexed").length
    : 0;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <SEOHead noindex={true} title="Indexing Status" />
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-7 h-7 text-amber-600" />
              Indexing Status
            </h1>
            <p className="text-gray-500 mt-1">Understand why Google may not be crawling your pages</p>
          </div>
          <Button
            variant="outline"
            onClick={fetchSitemap}
            disabled={sitemapLoading}
            className="gap-2 self-start"
          >
            {sitemapLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh Sitemap
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{LANDING_PAGES.length}</div>
              <div className="text-xs text-gray-500 mt-1">Landing Pages</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{inSitemapCount}</div>
              <div className="text-xs text-gray-500 mt-1">In Static Sitemap</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{articles.length}</div>
              <div className="text-xs text-gray-500 mt-1">Published Articles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${sitemapError ? "text-red-600" : "text-green-600"}`}>
                {sitemapLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : sitemapError ? "Error" : "OK"}
              </div>
              <div className="text-xs text-gray-500 mt-1">Sitemap Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Sitemap error */}
        {sitemapError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-semibold text-red-700">Sitemap fetch failed</p>
                <p className="text-sm text-red-600">{sitemapError}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="issues">
          <TabsList>
            <TabsTrigger value="issues">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
              Known Issues
            </TabsTrigger>
            <TabsTrigger value="landing">
              <Globe className="w-3.5 h-3.5 mr-1.5" />
              Landing Pages
            </TabsTrigger>
            <TabsTrigger value="articles">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Articles ({articles.length})
            </TabsTrigger>
            <TabsTrigger value="sitemap">
              Sitemap Check
            </TabsTrigger>
          </TabsList>

          {/* KNOWN ISSUES TAB */}
          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>Why Google Isn't Crawling Your Pages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {COMMON_ISSUES.map(issue => (
                  <div key={issue.id} className={`flex items-start gap-3 p-4 rounded-lg border ${
                    issue.severity === "error" ? "bg-red-50 border-red-200" :
                    issue.severity === "warning" ? "bg-amber-50 border-amber-200" :
                    "bg-blue-50 border-blue-200"
                  }`}>
                    <SeverityIcon severity={issue.severity} />
                    <div>
                      <p className={`font-semibold text-sm ${
                        issue.severity === "error" ? "text-red-800" :
                        issue.severity === "warning" ? "text-amber-800" :
                        "text-blue-800"
                      }`}>{issue.label}</p>
                      <p className={`text-xs mt-0.5 leading-relaxed ${
                        issue.severity === "error" ? "text-red-700" :
                        issue.severity === "warning" ? "text-amber-700" :
                        "text-blue-700"
                      }`}>{issue.detail}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                  <p className="font-semibold text-gray-800 text-sm">Recommended Actions</p>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal ml-4">
                    <li>Submit sitemaps in <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">Google Search Console</a> → <strong>/api/sitemapXml</strong></li>
                    <li>Use the "URL Inspection" tool in GSC to request indexing for key pages</li>
                    <li>Verify robots.txt is accessible: <a href={`${BASE_URL}/api/robotsTxt`} target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">/api/robotsTxt</a></li>
                    <li>Consider a prerendering service (e.g. Prerender.io) to serve static HTML to crawlers</li>
                    <li>Check "Coverage" report in GSC for crawl errors on specific URLs</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LANDING PAGES TAB */}
          <TabsContent value="landing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <span>Landing Page Sitemap Coverage</span>
                  {sitemapLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search pages..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="mb-4"
                />
                <div className="text-xs text-gray-500 mb-3">
                  <span className="inline-flex items-center gap-1 mr-3">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block" /> In static sitemap
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-400 rounded-full inline-block" /> Missing from sitemap
                  </span>
                  <span className="ml-3 text-gray-400">Click <Search className="w-3 h-3 inline" /> to run a site: query on Google</span>
                </div>
                {filteredLanding.map(p => (
                  <IndexCheckRow
                    key={p.path}
                    label={p.label}
                    path={p.path}
                    checkResult={sitemapLoading ? "loading" : isInSitemap(p.path)}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ARTICLES TAB */}
          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>Published News Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 mb-4">
                  Articles are in the <strong>news sitemap</strong> at <code className="bg-blue-100 px-1 rounded">/api/sitemapXml?type=news</code>. Use Google Search Console → Sitemaps to submit it. Click <Search className="w-3 h-3 inline" /> to run a site: query for each article.
                </div>
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="mb-4"
                />
                {filteredArticles.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-6">No published articles found.</p>
                )}
                {filteredArticles.map(a => (
                  <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-800 truncate">{a.title}</div>
                      <div className="text-xs text-gray-400">/news/{a.slug || a.id}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">News Sitemap</Badge>
                      {a.meta_title ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">Has Meta</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">No Meta</Badge>
                      )}
                      <a
                        href={`https://www.google.com/search?q=site:${BASE_URL}/news/${a.slug || a.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Search className="w-3.5 h-3.5 text-gray-400" />
                      </a>
                      <a
                        href={`${BASE_URL}/news/${a.slug || a.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SITEMAP CHECK TAB */}
          <TabsContent value="sitemap">
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Sitemap Index", url: `${BASE_URL}/api/sitemapXml`, desc: "Master index — submit this to GSC" },
                  { label: "Static Pages Sitemap", url: `${BASE_URL}/api/sitemapXml?type=static`, desc: `Contains ${sitemapData ? sitemapData.length : "..."} pages` },
                  { label: "News Articles Sitemap", url: `${BASE_URL}/api/sitemapXml?type=news`, desc: `Contains ${articles.length} articles` },
                  { label: "Location Pages Sitemap", url: `${BASE_URL}/api/sitemapXml?type=locations`, desc: "60+ business types × 50 cities" },
                  { label: "CMS Pages Sitemap", url: `${BASE_URL}/api/sitemapXml?type=cms`, desc: "SitePage entity entries" },
                  { label: "robots.txt", url: `${BASE_URL}/api/robotsTxt`, desc: "Must be accessible to crawlers" },
                ].map(item => (
                  <div key={item.url} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-600 hover:underline flex items-center gap-1 flex-shrink-0"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}

                <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-semibold text-amber-800 mb-1">Submit to Google Search Console</p>
                  <p className="text-xs text-amber-700">Go to <strong>GSC → Sitemaps</strong> and add: <code className="bg-amber-100 px-1 rounded">https://ezpayamerica.com/api/sitemapXml</code></p>
                  <a
                    href="https://search.google.com/search-console/sitemaps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-600 hover:underline mt-2"
                  >
                    Open Google Search Console <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}