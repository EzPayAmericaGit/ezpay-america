import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, TrendingDown, Users, MousePointer, FileText, Globe, Activity, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import SEOHead from "../components/SEOHead";

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#EC4899'];

function StatCard({ title, value, icon: Icon, color, change, changeLabel }) {
  const isPositive = change >= 0;
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-10 bg-gradient-to-br ${color}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-500"}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{Math.abs(change)}% {changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsDashboard() {
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState("7");

  React.useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== 'admin') window.location.href = '/';
      setUser(u);
    }).catch(() => window.location.href = '/');
  }, []);

  const { data: events = [] } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: () => base44.entities.AnalyticsEvent.filter({}),
    enabled: !!user
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['applications_count'],
    queryFn: () => base44.entities.MerchantApplication.filter({}),
    enabled: !!user
  });

  const { data: demoRequests = [] } = useQuery({
    queryKey: ['demo_requests'],
    queryFn: () => base44.entities.DemoRequest.filter({}),
    enabled: !!user
  });

  // Filter events by date range
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parseInt(dateRange));
  const filtered = events.filter(e => new Date(e.created_date) >= cutoff);

  const pageViews = filtered.filter(e => e.eventType === 'page_view');
  const clicks = filtered.filter(e => e.eventType === 'click');
  const formSubmits = filtered.filter(e => e.eventType === 'form_submit');
  const uniqueSessions = new Set(filtered.map(e => e.sessionId)).size;

  // Previous period for comparison
  const prevCutoff = new Date(cutoff);
  prevCutoff.setDate(prevCutoff.getDate() - parseInt(dateRange));
  const prev = events.filter(e => {
    const d = new Date(e.created_date);
    return d >= prevCutoff && d < cutoff;
  });
  const prevPageViews = prev.filter(e => e.eventType === 'page_view').length;
  const pvChange = prevPageViews > 0 ? Math.round(((pageViews.length - prevPageViews) / prevPageViews) * 100) : 0;

  // Daily traffic
  const dailyMap = {};
  pageViews.forEach(e => {
    const d = new Date(e.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyMap[d] = (dailyMap[d] || 0) + 1;
  });
  const dailyData = Object.entries(dailyMap)
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Top pages
  const pageMap = {};
  pageViews.forEach(e => { pageMap[e.pageTitle || e.pagePath || 'Unknown'] = (pageMap[e.pageTitle || e.pagePath || 'Unknown'] || 0) + 1; });
  const topPages = Object.entries(pageMap).map(([name, views]) => ({ name, views })).sort((a, b) => b.views - a.views).slice(0, 8);

  // Devices
  const deviceMap = {};
  filtered.forEach(e => { if (e.deviceType) deviceMap[e.deviceType] = (deviceMap[e.deviceType] || 0) + 1; });
  const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));

  // Traffic sources (UTM)
  const sourceMap = {};
  filtered.forEach(e => { const s = e.utmSource || 'Direct'; sourceMap[s] = (sourceMap[s] || 0) + 1; });
  const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

  // Event type breakdown
  const eventTypeMap = {};
  filtered.forEach(e => { eventTypeMap[e.eventType] = (eventTypeMap[e.eventType] || 0) + 1; });
  const eventData = Object.entries(eventTypeMap).map(([name, value]) => ({ name, value }));

  // Conversions by day
  const convMap = {};
  formSubmits.forEach(e => {
    const d = new Date(e.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    convMap[d] = (convMap[d] || 0) + 1;
  });
  const convData = Object.entries(convMap).map(([date, conversions]) => ({ date, conversions })).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <SEOHead title="Analytics Dashboard" description="Dynamic analytics dashboard for EzPay America" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Real-time insights across all landing pages and traffic sources</p>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Page Views" value={pageViews.length.toLocaleString()} icon={Globe} color="from-amber-500 to-orange-600" change={pvChange} changeLabel="vs prev period" />
          <StatCard title="Unique Sessions" value={uniqueSessions.toLocaleString()} icon={Users} color="from-blue-500 to-blue-700" />
          <StatCard title="Form Submissions" value={formSubmits.length.toLocaleString()} icon={FileText} color="from-green-500 to-green-700" />
          <StatCard title="Applications" value={applications.length.toLocaleString()} icon={Activity} color="from-purple-500 to-purple-700" />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-xs text-gray-500 mb-1">Clicks</p>
            <p className="text-2xl font-bold text-gray-900">{clicks.length.toLocaleString()}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500 mb-1">Demo Requests</p>
            <p className="text-2xl font-bold text-gray-900">{demoRequests.length.toLocaleString()}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500 mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {pageViews.length > 0 ? ((formSubmits.length / pageViews.length) * 100).toFixed(2) : 0}%
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500 mb-1">Events / Session</p>
            <p className="text-2xl font-bold text-gray-900">
              {uniqueSessions > 0 ? (filtered.length / uniqueSessions).toFixed(1) : 0}
            </p>
          </Card>
        </div>

        <Tabs defaultValue="traffic" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 h-auto">
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="traffic">
            <Card>
              <CardHeader><CardTitle>Daily Page Views</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={360}>
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#F59E0B" strokeWidth={2} fill="url(#viewGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions">
            <Card>
              <CardHeader><CardTitle>Daily Form Submissions</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart data={convData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <Card>
              <CardHeader><CardTitle>Most Viewed Pages</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {topPages.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-5 text-right">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{p.name}</span>
                          <span className="text-sm text-gray-500 ml-2">{p.views.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(p.views / topPages[0].views) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Traffic Sources</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={sourceData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Event Types Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={eventData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Device Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={deviceData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Summary Stats</CardTitle></CardHeader>
                <CardContent className="space-y-4 pt-2">
                  {[
                    { label: "Total Events", value: filtered.length },
                    { label: "Unique Sessions", value: uniqueSessions },
                    { label: "Avg Events / Session", value: uniqueSessions > 0 ? (filtered.length / uniqueSessions).toFixed(1) : 0 },
                    { label: "Pending Applications", value: applications.filter(a => a.status === 'submitted').length },
                    { label: "Pending Demo Requests", value: demoRequests.filter(d => d.status === 'pending').length },
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="text-sm text-gray-600">{s.label}</span>
                      <span className="font-bold text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}