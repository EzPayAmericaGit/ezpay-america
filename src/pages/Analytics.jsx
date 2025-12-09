import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { base44 } from "@/api/base44Client";
import { TrendingUp, Users, Eye, MousePointer, Clock, Globe, Smartphone, Monitor, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    conversionRate: 0
  });
  const [chartData, setChartData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [trafficSources, setTrafficSources] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const daysAgo = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const events = await base44.entities.AnalyticsEvent.filter({
        created_date: { $gte: startDate.toISOString() }
      }, '-created_date', 10000);

      // Calculate metrics
      const pageViews = events.filter(e => e.eventType === 'page_view');
      const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
      
      const sessionDurations = events
        .filter(e => e.duration)
        .map(e => e.duration);
      const avgDuration = sessionDurations.length > 0
        ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
        : 0;

      // Bounce rate (sessions with only 1 page view)
      const sessionPageCounts = {};
      pageViews.forEach(e => {
        sessionPageCounts[e.sessionId] = (sessionPageCounts[e.sessionId] || 0) + 1;
      });
      const bouncedSessions = Object.values(sessionPageCounts).filter(count => count === 1).length;
      const bounceRate = uniqueSessions > 0 ? (bouncedSessions / uniqueSessions) * 100 : 0;

      // Conversion rate (applications / unique visitors)
      const conversions = events.filter(e => e.eventType === 'application_complete').length;
      const conversionRate = uniqueSessions > 0 ? (conversions / uniqueSessions) * 100 : 0;

      setStats({
        totalPageViews: pageViews.length,
        uniqueVisitors: uniqueSessions,
        avgSessionDuration: Math.round(avgDuration),
        bounceRate: Math.round(bounceRate),
        conversionRate: conversionRate.toFixed(2)
      });

      // Chart data - daily page views
      const dailyViews = {};
      pageViews.forEach(e => {
        const date = new Date(e.created_date).toLocaleDateString();
        dailyViews[date] = (dailyViews[date] || 0) + 1;
      });
      setChartData(
        Object.entries(dailyViews).map(([date, views]) => ({ date, views }))
      );

      // Device breakdown
      const devices = {};
      events.forEach(e => {
        if (e.deviceType) {
          devices[e.deviceType] = (devices[e.deviceType] || 0) + 1;
        }
      });
      setDeviceData(
        Object.entries(devices).map(([name, value]) => ({ name, value }))
      );

      // Top pages
      const pageCounts = {};
      pageViews.forEach(e => {
        if (e.pagePath) {
          pageCounts[e.pagePath] = (pageCounts[e.pagePath] || 0) + 1;
        }
      });
      setTopPages(
        Object.entries(pageCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([page, views]) => ({ page, views }))
      );

      // Traffic sources
      const sources = {};
      events.forEach(e => {
        const source = e.utmSource || e.referrer || 'Direct';
        sources[source] = (sources[source] || 0) + 1;
      });
      setTrafficSources(
        Object.entries(sources)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([source, visits]) => ({ source, visits }))
      );

    } catch (error) {
      console.error("Analytics load error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SEOHead title="Analytics Dashboard" description="View website analytics and metrics" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-8 h-8 text-blue-500" />
                <ArrowUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-gray-600">Total Page Views</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPageViews.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.uniqueVisitors.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-sm text-gray-600">Avg Session Duration</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgSessionDuration}s</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <MousePointer className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600">Bounce Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.bounceRate}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.conversionRate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Page Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <div key={index} className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-gray-700">{page.page}</span>
                    <span className="font-semibold text-gray-900">{page.views}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trafficSources}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}