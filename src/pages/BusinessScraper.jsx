import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Loader2, Building2, Mail, Phone, MapPin, User, Trash2, CheckCircle2, XCircle } from "lucide-react";

export default function BusinessScraper() {
  const [url, setUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState(null);
  const [authStatus, setAuthStatus] = useState({ loading: true, isAdmin: false });
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        setAuthStatus({ loading: false, isAdmin: user?.role === 'admin' });
      } catch {
        setAuthStatus({ loading: false, isAdmin: false });
      }
    };
    checkAuth();
  }, []);

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['scrapedBusinesses'],
    queryFn: () => base44.entities.ScrapedBusiness.list('-created_date')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ScrapedBusiness.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['scrapedBusinesses'])
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ScrapedBusiness.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['scrapedBusinesses'])
  });

  const scrapeWebsite = async () => {
    if (!url) return;
    
    setIsScraping(true);
    setScrapedData(null);
    
    try {
      const { markdown } = await base44.functions.invoke('fetchWebsite', { 
        url, 
        formats: ['markdown'] 
      });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a business data extraction AI. Analyze this website content and extract all business information.

Website URL: ${url}

Website Content:
${markdown}

Extract the following information if available:
- Business name
- Owner/contact person name
- Email addresses (all found)
- Phone numbers (all found)
- Physical address
- Industry/business type
- Business description
- Social media links (Facebook, Instagram, LinkedIn, Twitter, etc.)
- Any other relevant business information

Be thorough and extract ALL contact information found on the page.`,
        response_json_schema: {
          type: "object",
          properties: {
            businessName: { type: "string" },
            ownerName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            address: { type: "string" },
            industry: { type: "string" },
            description: { type: "string" },
            socialMedia: { 
              type: "object",
              properties: {
                facebook: { type: "string" },
                instagram: { type: "string" },
                linkedin: { type: "string" },
                twitter: { type: "string" }
              }
            },
            additionalInfo: { type: "object" },
            confidence: { type: "string", enum: ["high", "medium", "low"] }
          }
        }
      });

      const businessData = {
        websiteUrl: url,
        businessName: result.businessName || "Not found",
        ownerName: result.ownerName || "Not found",
        email: result.email || "Not found",
        phone: result.phone || "Not found",
        address: result.address || "Not found",
        industry: result.industry || "Unknown",
        description: result.description || "",
        socialMedia: result.socialMedia || {},
        additionalInfo: result.additionalInfo || {},
        status: "new"
      };

      await base44.entities.ScrapedBusiness.create(businessData);
      setScrapedData(businessData);
      queryClient.invalidateQueries(['scrapedBusinesses']);
      setUrl("");
    } catch (error) {
      console.error("Scraping error:", error);
      alert("Failed to scrape website. Please try again.");
    } finally {
      setIsScraping(false);
    }
  };

  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-amber-100 text-amber-800",
    interested: "bg-green-100 text-green-800",
    not_interested: "bg-gray-100 text-gray-800"
  };

  if (authStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!authStatus.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Admin access required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Search className="w-8 h-8 text-amber-600" />
            AI Business Scraper
          </h1>
          <p className="text-gray-600 mt-2">
            Extract business information from any website automatically
          </p>
        </div>

        {/* Scraper Input */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Input
                placeholder="Enter website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && scrapeWebsite()}
                className="h-12 flex-1"
              />
              <Button
                onClick={scrapeWebsite}
                disabled={!url || isScraping}
                className="bg-amber-600 hover:bg-amber-700 px-8"
              >
                {isScraping ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Scrape Website
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Latest Scraped Result */}
        {scrapedData && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                Successfully Scraped - New Lead Added
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Business:</span> {scrapedData.businessName}</div>
                <div><span className="font-semibold">Email:</span> {scrapedData.email}</div>
                <div><span className="font-semibold">Phone:</span> {scrapedData.phone}</div>
                <div><span className="font-semibold">Industry:</span> {scrapedData.industry}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scraped Businesses List */}
        <Card>
          <CardHeader>
            <CardTitle>Scraped Businesses ({businesses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No businesses scraped yet. Enter a URL above to start.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {businesses.map((business) => (
                  <Card key={business.id} className="border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-amber-600" />
                            {business.businessName}
                          </h3>
                          <a 
                            href={business.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {business.websiteUrl}
                          </a>
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={business.status}
                            onValueChange={(value) => updateMutation.mutate({ id: business.id, data: { status: value }})}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="interested">Interested</SelectItem>
                              <SelectItem value="not_interested">Not Interested</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteMutation.mutate(business.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        {business.ownerName && business.ownerName !== "Not found" && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{business.ownerName}</span>
                          </div>
                        )}
                        {business.email && business.email !== "Not found" && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
                              {business.email}
                            </a>
                          </div>
                        )}
                        {business.phone && business.phone !== "Not found" && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                              {business.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      {business.address && business.address !== "Not found" && (
                        <div className="flex items-start gap-2 text-sm mb-4">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span>{business.address}</span>
                        </div>
                      )}

                      {business.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{business.description}</p>
                      )}

                      <div className="flex gap-2">
                        <Badge className="bg-purple-100 text-purple-800">{business.industry}</Badge>
                        <Badge className={statusColors[business.status]}>{business.status.replace('_', ' ')}</Badge>
                      </div>

                      {business.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <Textarea
                            value={business.notes}
                            onChange={(e) => updateMutation.mutate({ 
                              id: business.id, 
                              data: { notes: e.target.value }
                            })}
                            placeholder="Add notes..."
                            rows={2}
                            className="text-sm"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}