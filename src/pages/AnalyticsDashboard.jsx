import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, MousePointer, FileText, Globe } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function AnalyticsDashboard() {
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState(7);

  React.useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== 'admin') {
        window.location.href = '/';
      }
      setUser(u);
    }).catch(() => window.location.href = '/');
  }, []);

  const { data: events = [] } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - dateRange);
      return await base44.entities.AnalyticsEvent.filter({});
    },
    enabled: !!user
  });

  const pageViews = events.filter(e => e.eventType === 'page_view');
  const clicks = events.filter(e => e.eventType === 'click');
  const formSubmits = events.filter(e => e.eventType === 'form_submit');

  const pageViewsByPage = pageViews.reduce((acc, e) => {
    acc[e.pageTitle] = (acc[e.pageTitle] || 0) + 1;
    return acc;
  }, {});

  const deviceData = pageViews.reduce((acc, e) => {
    acc[e.deviceType] = (acc[e.deviceType] || 0) + 1;
    return acc;
  }, {});

  const pageData = Object.entries(pageViewsByPage).map(([name, views]) => ({
    name: name || 'Unknown',
    views
  })).sort((a, b) => b.views - a.views).slice(0, 10);

  const deviceChartData = Object.entries(deviceData).map(([name, value]) => ({
    name: name || 'Unknown',
    value
  }));

  const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'];

  const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
  const avgSessionDuration = events
    .filter(e => e.duration)
    .reduce((sum, e, _, arr) => sum + (e.duration / arr.length), 0);

  const dailyViews = pageViews.reduce((acc, e) => {
    const date = new Date(e.created_date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dailyData = Object.entries(dailyViews).map(([date, views]) => ({
    date,
    views
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
      <SEOHead 
        title="Analytics Dashboard"
        description="View website analytics, user behavior, and performance metrics"
      />
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Page Views</CardTitle>
              <Globe className="w-4 h-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pageViews.length.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Unique Sessions</CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueSessions.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Clicks</CardTitle>
              <MousePointer className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clicks.length.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Form Submissions</CardTitle>
              <FileText className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formSubmits.length.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="traffic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="traffic">
            <Card>
              <CardHeader>
                <CardTitle>Daily Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Most Viewed Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={pageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={deviceChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}