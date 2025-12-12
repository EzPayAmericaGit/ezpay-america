import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";

export default function NotificationSettings() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const existingPrefs = await base44.entities.NotificationPreference.filter({
        userEmail: currentUser.email
      });

      if (existingPrefs.length > 0) {
        setPreferences(existingPrefs[0]);
      } else {
        // Default preferences
        setPreferences({
          applicationSubmitted: true,
          applicationStatusChange: true,
          orderConfirmation: true,
          orderStatusChange: true,
          promotionalEmails: false,
          newsletterEmails: false
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      if (preferences.id) {
        await base44.entities.NotificationPreference.update(preferences.id, {
          ...preferences,
          userEmail: user.email
        });
      } else {
        const created = await base44.entities.NotificationPreference.create({
          ...preferences,
          userEmail: user.email
        });
        setPreferences(created);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Email Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose which email notifications you'd like to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Application Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Application Updates</h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="app-submitted">Application Submitted</Label>
              <p className="text-sm text-gray-600">Receive confirmation when you submit an application</p>
            </div>
            <Switch
              id="app-submitted"
              checked={preferences?.applicationSubmitted}
              onCheckedChange={() => togglePreference('applicationSubmitted')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="app-status">Application Status Changes</Label>
              <p className="text-sm text-gray-600">Get notified when your application status updates</p>
            </div>
            <Switch
              id="app-status"
              checked={preferences?.applicationStatusChange}
              onCheckedChange={() => togglePreference('applicationStatusChange')}
            />
          </div>
        </div>

        {/* Order Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Order Updates</h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="order-confirm">Order Confirmation</Label>
              <p className="text-sm text-gray-600">Receive confirmation when your payment is successful</p>
            </div>
            <Switch
              id="order-confirm"
              checked={preferences?.orderConfirmation}
              onCheckedChange={() => togglePreference('orderConfirmation')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="order-status">Order Status Changes</Label>
              <p className="text-sm text-gray-600">Get notified when your order status changes</p>
            </div>
            <Switch
              id="order-status"
              checked={preferences?.orderStatusChange}
              onCheckedChange={() => togglePreference('orderStatusChange')}
            />
          </div>
        </div>

        {/* Marketing Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Marketing & News</h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="promo">Promotional Emails</Label>
              <p className="text-sm text-gray-600">Receive special offers and promotions</p>
            </div>
            <Switch
              id="promo"
              checked={preferences?.promotionalEmails}
              onCheckedChange={() => togglePreference('promotionalEmails')}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="newsletter">Newsletter</Label>
              <p className="text-sm text-gray-600">Stay updated with industry news and tips</p>
            </div>
            <Switch
              id="newsletter"
              checked={preferences?.newsletterEmails}
              onCheckedChange={() => togglePreference('newsletterEmails')}
            />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
          
          {saved && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">Preferences saved!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}