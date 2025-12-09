import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";

export default function SettingsAdmin() {
  const queryClient = useQueryClient();
  const [taxRate, setTaxRate] = useState("");
  const [flatShipping, setFlatShipping] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const allSettings = await base44.entities.Settings.list();
      return allSettings;
    }
  });

  React.useEffect(() => {
    const taxSetting = settings.find(s => s.settingKey === 'tax_rate');
    const shippingSetting = settings.find(s => s.settingKey === 'flat_shipping_rate');
    
    if (taxSetting) setTaxRate(taxSetting.settingValue);
    if (shippingSetting) setFlatShipping(shippingSetting.settingValue);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const taxSetting = settings.find(s => s.settingKey === 'tax_rate');
      const shippingSetting = settings.find(s => s.settingKey === 'flat_shipping_rate');

      if (taxSetting) {
        await base44.entities.Settings.update(taxSetting.id, {
          settingValue: taxRate
        });
      } else {
        await base44.entities.Settings.create({
          settingKey: 'tax_rate',
          settingValue: taxRate,
          description: 'Sales tax rate percentage (e.g., 8 for 8%)'
        });
      }

      if (shippingSetting) {
        await base44.entities.Settings.update(shippingSetting.id, {
          settingValue: flatShipping
        });
      } else {
        await base44.entities.Settings.create({
          settingKey: 'flat_shipping_rate',
          settingValue: flatShipping,
          description: 'Flat shipping rate in dollars (fallback if UPS API fails)'
        });
      }

      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Store Settings</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tax Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="8.00"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the sales tax percentage (e.g., 8 for 8%)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Flat Shipping Rate ($)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="12.99"
                value={flatShipping}
                onChange={(e) => setFlatShipping(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-sm text-gray-500 mt-1">
                Fallback shipping rate if UPS API fails or ZIP-based calculation unavailable
              </p>
            </div>
          </CardContent>
        </Card>

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
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}