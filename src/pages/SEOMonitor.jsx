import React, { useState, useEffect, useRef } from "react";
import SEOHead from "../components/SEOHead";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Search, RefreshCw, Loader2, AlertTriangle, CheckCircle2, Link2, Sparkles,
  TrendingUp, Activity, Clock, Plus, X, Monitor, Smartphone, ChevronRight
} from "lucide-react";
import ScoreGauge from "@/components/seo/ScoreGauge";
import MetricPill from "@/components/seo/MetricPill";

const DEFAULT_URL = "https://ezpayamerica.com";
const DEFAULT_KEYWORDS = ["payment processing", "zero fee credit card processing", "POS systems small business", "merchant services", "free POS equipment"];

function priorityBadge(score) {
  if (score === null || score === undefined) return null;
  if (score >= 90) return <Badge className="bg-green-100 text-green-700 text-xs">Good</Badge>;
  if (score >= 50) return <Badge className="bg-amber-100 text-amber-700 text-xs">Needs Work</Badge>;
  return <Badge className="bg-red-100 text-red-700 text-xs">Poor</Badge>;
}

export default function SEOMonitor() {
  const [user, setUser] = useState(null);
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [keywords, setKeywords] = useState(DEFAULT_KEYWORDS);
  const [newKeyword, setNewKeyword] = useState("");
  const [device, setDevice] = useState("desktop");
  const [running, setRunning] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const pollRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== 'admin') window.location.href = '/';
      setUser(u);
    }).catch(() => window.location.href = '/');
  }, []);

  const { data: reports = [] } = useQuery({
    queryKey: ['seoReports'],
    queryFn: () => base44.entities.SEOReport.list('-created_date', 50),
    enabled: !!user,
    refetchInterval: running ? 4000 : false,
  });

  // Auto-select latest complete report
  useEffect(() => {
    if (!selectedReport && reports.length > 0) {
      const latest = reports.find(r => r.status === 'complete') || reports[0];
      setSelectedReport(latest);
    }
  }, [reports]);

  // Stop polling when current running report is complete
  useEffect(() => {
    const runningReport = reports.find(r => r.status === 'running' || r.status === 'pending');
    if (!runningReport && running) {
      setRunning(false);
      queryClient.invalidateQueries({ queryKey: ['seoReports'] });
    }
    if (runningReport) {
      setSelectedReport(runningReport);
    }
  }, [reports]);

  const runAudit = async () => {
    setRunning(true);
    // Create pending record
    const report = await base44.entities.SEOReport.create({
      url: urlInput,
      device,
      status: 'pending',
      keywordRankings: keywords.map(k => ({ keyword: k, position: null, trend: 'unknown' }))
    });
    setSelectedReport(report);
    // Kick off backend audit (non-blocking)
    base44.functions.invoke('runSEOAudit', {
      reportId: report.id,
      url: urlInput,
      device,
      keywords
    }).catch(() => setRunning(false));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords(prev => [...prev, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  // History trend data
  const trendData = [...reports]
    .filter(r => r.status === 'complete' && r.url === urlInput)
    .reverse()
    .slice(-10)
    .map(r => ({
      date: new Date(r.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Performance: r.performance,
      SEO: r.seo,
      Accessibility: r.accessibility,
      'Best Practices': r.bestPractices,
    }));

  const report = selectedReport;
  const isRunning = report?.status === 'running' || report?.status === 'pending';

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <SEOHead noindex={true} title="SEO Monitor" />
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-7 h-7 text-amber-600" />
              SEO Monitor
            </h1>
            <p className="text-gray-500 mt-1">Lighthouse audits, broken links & LLM-powered recommendations</p>
          </div>
          <Badge className={`text-sm px-3 py-1 ${running ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
            {running ? 'Audit Running...' : `${reports.filter(r => r.status === 'complete').length} Scans Complete`}
          </Badge>
        </div>

        {/* Audit Config */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://ezpayamerica.com"
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button
                  variant={device === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDevice('desktop')}
                  className="gap-1"
                >
                  <Monitor className="w-4 h-4" /> Desktop
                </Button>
                <Button
                  variant={device === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDevice('mobile')}
                  className="gap-1"
                >
                  <Smartphone className="w-4 h-4" /> Mobile
                </Button>
                <Button
                  onClick={runAudit}
                  disabled={running || !urlInput}
                  className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
                >
                  {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {running ? 'Running...' : 'Run Audit'}
                </Button>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tracked Keywords</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map(kw => (
                  <span key={kw} className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full px-3 py-1 text-xs font-medium">
                    {kw}
                    <button onClick={() => setKeywords(prev => prev.filter(k => k !== kw))} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <Input
                  value={newKeyword}
                  onChange={e => setNewKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addKeyword()}
                  placeholder="Add keyword..."
                  className="h-8 text-xs"
                />
                <Button size="sm" variant="outline" onClick={addKeyword} className="h-8 px-2">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Running State */}
        {isRunning && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6 flex items-center gap-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800">Audit in progress...</p>
                <p className="text-sm text-blue-600">Running Lighthouse via PageSpeed Insights, checking links, and generating AI recommendations. This takes 20–40 seconds.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {report?.status === 'error' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-700">Audit failed</p>
                <p className="text-sm text-red-600">{report.errorMessage || 'Unknown error'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Results */}
        {report?.status === 'complete' && (
          <Tabs defaultValue="scores" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="scores">Scores</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="links">Broken Links</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="recommendations">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />AI Recs
                </TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <div className="text-xs text-gray-400 hidden sm:block">
                {report.url} · {report.device} · {new Date(report.created_date).toLocaleString()}
              </div>
            </div>

            {/* SCORES TAB */}
            <TabsContent value="scores" className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Lighthouse Scores</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-around gap-6 py-4">
                    <ScoreGauge label="Performance" score={report.performance} size={96} />
                    <ScoreGauge label="Accessibility" score={report.accessibility} size={96} />
                    <ScoreGauge label="Best Practices" score={report.bestPractices} size={96} />
                    <ScoreGauge label="SEO" score={report.seo} size={96} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Core Web Vitals</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <MetricPill metric="fcp" label="FCP" value={report.fcp} />
                    <MetricPill metric="lcp" label="LCP" value={report.lcp} />
                    <MetricPill metric="tbt" label="TBT" value={report.tbt} />
                    <MetricPill metric="cls" label="CLS" value={report.cls} />
                    <MetricPill metric="si"  label="Speed Index" value={report.si} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* OPPORTUNITIES TAB */}
            <TabsContent value="opportunities">
              <Card>
                <CardHeader>
                  <CardTitle>Failed Audits & Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  {(report.opportunities || []).length === 0 ? (
                    <div className="flex items-center gap-2 text-green-600 py-4">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>No major issues found!</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(report.opportunities || []).map((opp, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                          <div className={`mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            opp.score >= 0.5 ? 'bg-amber-400' : 'bg-red-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-gray-800 text-sm">{opp.title}</span>
                              {opp.savings > 0 && (
                                <Badge className="bg-blue-50 text-blue-700 text-xs">
                                  saves ~{(opp.savings / 1000).toFixed(1)}s
                                </Badge>
                              )}
                              {opp.displayValue && (
                                <span className="text-xs text-gray-500">{opp.displayValue}</span>
                              )}
                            </div>
                            {opp.description && (
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{opp.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* BROKEN LINKS TAB */}
            <TabsContent value="links">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-5 h-5" />
                    Broken Links
                    {(report.brokenLinks || []).length > 0 && (
                      <Badge className="bg-red-100 text-red-700">{report.brokenLinks.length} found</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(report.brokenLinks || []).length === 0 ? (
                    <div className="flex items-center gap-2 text-green-600 py-4">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>No broken links detected in the scanned sample.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {report.brokenLinks.map((link, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                          <Badge className="bg-red-100 text-red-700 font-mono text-xs flex-shrink-0">{link.status}</Badge>
                          <a href={link.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-red-700 hover:underline truncate flex-1">
                            {link.url}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* KEYWORDS TAB */}
            <TabsContent value="keywords">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Keyword Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mb-4">
                    <strong>Note:</strong> Live keyword ranking positions require Google Search Console API integration. Connect it in the admin settings to enable real-time rank tracking. Below shows your tracked keywords.
                  </div>
                  <div className="space-y-2">
                    {(report.keywordRankings || []).map((kw, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <span className="font-medium text-gray-800 text-sm">{kw.keyword}</span>
                        <div className="flex items-center gap-2">
                          {kw.position ? (
                            <Badge className="bg-green-100 text-green-700">#{kw.position}</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-500 text-xs">Awaiting GSC</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI RECOMMENDATIONS TAB */}
            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI-Generated Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(report.recommendations || []).length === 0 ? (
                    <p className="text-gray-500 text-sm">No recommendations generated.</p>
                  ) : (
                    <div className="space-y-3">
                      {report.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-white border border-purple-100">
                          <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* HISTORY TAB */}
            <TabsContent value="history" className="space-y-4">
              {trendData.length > 1 ? (
                <Card>
                  <CardHeader><CardTitle>Score Trends Over Time</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Performance" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="SEO" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="Accessibility" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="Best Practices" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    Run at least 2 audits to see trend charts.
                  </CardContent>
                </Card>
              )}

              {/* Report History List */}
              <Card>
                <CardHeader><CardTitle>Audit History</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reports.map(r => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedReport(r)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedReport?.id === r.id ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          r.status === 'complete' ? 'bg-green-500' :
                          r.status === 'error' ? 'bg-red-500' :
                          'bg-blue-400 animate-pulse'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-gray-800 truncate">{r.url}</span>
                            <Badge className="text-xs bg-gray-100 text-gray-600">{r.device || 'desktop'}</Badge>
                          </div>
                          <div className="text-xs text-gray-400">{new Date(r.created_date).toLocaleString()}</div>
                        </div>
                        {r.status === 'complete' && (
                          <div className="flex gap-2 flex-shrink-0">
                            <ScoreGauge label="" score={r.performance} size={36} />
                            <ScoreGauge label="" score={r.seo} size={36} />
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty state */}
        {!report && !running && (
          <Card>
            <CardContent className="py-16 text-center space-y-3">
              <Activity className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-gray-500 text-lg font-medium">No audits yet</p>
              <p className="text-gray-400 text-sm">Enter a URL above and click "Run Audit" to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}