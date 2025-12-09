import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Newspaper, FileText, Users, ShieldAlert, Loader2, UserCircle } from "lucide-react";

export default function Admin() {
  const [authStatus, setAuthStatus] = useState({ loading: true, isAdmin: false });

  useEffect(() => {
    // Prevent search engine indexing
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role === 'admin') {
          setAuthStatus({ loading: false, isAdmin: true });
        } else {
          setAuthStatus({ loading: false, isAdmin: false });
        }
      } catch (e) {
        setAuthStatus({ loading: false, isAdmin: false });
      }
    };
    checkAuth();

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

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
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You must be an admin to access this page.</p>
            <Button onClick={() => base44.auth.redirectToLogin()}>
              Login as Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Link to={createPageUrl("NewsAdmin")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-purple-600" />
                  News Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage news articles, create AI-generated content, and optimize SEO.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminDashboard")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-amber-600" />
                  Application Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Review and manage merchant applications with AI assistance.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("UserManagement")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage user accounts and permissions.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("CustomerOnboarding")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="w-6 h-6 text-green-600" />
                  My Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  View your onboarding status and account details.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}