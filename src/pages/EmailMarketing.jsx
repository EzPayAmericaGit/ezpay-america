import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "../components/SEOHead";
import { base44 } from "@/api/base44Client";
import { Mail, Send, Users, BarChart3, Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EmailMarketing() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
    targetAudience: "all",
    imageUrl: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await base44.entities.EmailCampaign.list('-created_date', 50);
      setCampaigns(data || []);
    } catch (error) {
      console.error("Load campaigns error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCampaign = async () => {
    setCreating(true);
    try {
      if (editingCampaign) {
        await base44.entities.EmailCampaign.update(editingCampaign.id, formData);
      } else {
        await base44.entities.EmailCampaign.create(formData);
      }
      
      setShowDialog(false);
      setFormData({ name: "", subject: "", content: "", targetAudience: "all", imageUrl: "" });
      setEditingCampaign(null);
      loadCampaigns();
    } catch (error) {
      console.error("Save campaign error:", error);
      alert("Error saving campaign");
    } finally {
      setCreating(false);
    }
  };

  const sendCampaign = async (campaignId) => {
    if (!confirm("Are you sure you want to send this campaign?")) return;
    
    try {
      const result = await base44.functions.invoke('sendEmailCampaign', { campaignId });
      alert(`Campaign sent! ${result.data.sent} emails delivered successfully.`);
      loadCampaigns();
    } catch (error) {
      console.error("Send campaign error:", error);
      alert("Error sending campaign");
    }
  };

  const deleteCampaign = async (id) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    
    try {
      await base44.entities.EmailCampaign.delete(id);
      loadCampaigns();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const openEditDialog = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      targetAudience: campaign.targetAudience,
      imageUrl: campaign.imageUrl || ""
    });
    setShowDialog(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      const imageUrl = result.file_url;
      setFormData({
        ...formData, 
        imageUrl: imageUrl,
        content: formData.content + `<img src="${imageUrl}" alt="Email image" style="max-width: 100%; height: auto;" />`
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      scheduled: 'bg-blue-100 text-blue-700',
      sending: 'bg-amber-100 text-amber-700',
      sent: 'bg-green-100 text-green-700',
      paused: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SEOHead title="Email Marketing" description="Manage email campaigns and newsletters" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Email Marketing</h1>
            <p className="text-gray-600 mt-2">Create and send email campaigns to your audience</p>
          </div>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingCampaign(null);
                  setFormData({ name: "", subject: "", content: "", targetAudience: "all", imageUrl: "" });
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Spring Promotion 2024"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line *</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g., Special Offer: Zero-Fee Processing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience *</label>
                  <Select value={formData.targetAudience} onValueChange={(value) => setFormData({...formData, targetAudience: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Contacts</SelectItem>
                      <SelectItem value="pending_applications">Pending Applications</SelectItem>
                      <SelectItem value="approved_merchants">Approved Merchants</SelectItem>
                      <SelectItem value="demo_requests">Demo Requests</SelectItem>
                      <SelectItem value="website_visitors">Website Visitors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image (Optional)</label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    {uploading && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </div>
                    )}
                    {formData.imageUrl && (
                      <div className="flex items-center gap-2">
                        <img src={formData.imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded" />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setFormData({...formData, imageUrl: ""})}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Content *</label>
                  <ReactQuill 
                    value={formData.content}
                    onChange={(value) => setFormData({...formData, content: value})}
                    className="bg-white"
                    style={{ height: '300px', marginBottom: '50px' }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={saveCampaign}
                    disabled={!formData.name || !formData.subject || !formData.content || creating}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaigns List */}
        <div className="grid gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">Subject: {campaign.subject}</p>
                    <p className="text-sm text-gray-500">
                      Target: {campaign.targetAudience.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {campaign.status === 'draft' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(campaign)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => sendCampaign(campaign.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {campaign.status === 'sent' && (
                  <div className="grid grid-cols-5 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{campaign.totalRecipients}</p>
                      <p className="text-sm text-gray-500">Recipients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{campaign.sent}</p>
                      <p className="text-sm text-gray-500">Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{campaign.opened}</p>
                      <p className="text-sm text-gray-500">Opened</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{campaign.clicked}</p>
                      <p className="text-sm text-gray-500">Clicked</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{campaign.bounced}</p>
                      <p className="text-sm text-gray-500">Bounced</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {campaigns.length === 0 && !loading && (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-6">Create your first email campaign to get started</p>
                <Button 
                  onClick={() => setShowDialog(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}