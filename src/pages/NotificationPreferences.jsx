import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";
import NotificationSettings from "../components/NotificationSettings";
import SEOHead from "../components/SEOHead";

export default function NotificationPreferences() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <SEOHead 
        title="Notification Preferences"
        description="Manage your email notification preferences for EzPay America"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to={createPageUrl("MyAccount")}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to My Account
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Notification Preferences
          </h1>
          <p className="text-lg text-gray-600">
            Control which email notifications you receive from EzPay America
          </p>
        </div>

        <NotificationSettings />
      </div>
    </div>
  );
}