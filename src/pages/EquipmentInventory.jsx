import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Search, DollarSign, Calendar, AlertTriangle, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import SEOHead from "../components/SEOHead";

export default function EquipmentInventory() {
  const [user, setUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    terminalType: "",
    serialNumber: "",
    merchantName: "",
    merchantMID: "",
    businessContactName: "",
    businessPhoneNumber: "",
    ownerCellNumber: "",
    emailAddress: "",
    streetAddress: "",
    city: "",
    state: "",
    dateShipped: "",
    dateReturned: "",
    terminalCost: "",
    agentAssigned: "",
    warrantyDocumentUrl: "",
    status: "in_stock",
    isActive: true,
    hasBeenReturned: false
  });
  const [uploadingWarranty, setUploadingWarranty] = useState(false);

  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== 'admin') {
        window.location.href = '/';
      }
      setUser(u);
    }).catch(() => window.location.href = '/');
  }, []);

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list('-created_date'),
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Equipment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['equipment']);
      setShowDialog(false);
      resetForm();
      toast.success('Equipment added successfully');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Equipment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['equipment']);
      setShowDialog(false);
      resetForm();
      toast.success('Equipment updated successfully');
    }
  });

  const resetForm = () => {
    setFormData({
      terminalType: "",
      serialNumber: "",
      merchantName: "",
      merchantMID: "",
      businessContactName: "",
      businessPhoneNumber: "",
      ownerCellNumber: "",
      emailAddress: "",
      streetAddress: "",
      city: "",
      state: "",
      dateShipped: "",
      dateReturned: "",
      terminalCost: "",
      agentAssigned: "",
      warrantyDocumentUrl: "",
      status: "in_stock",
      isActive: true,
      hasBeenReturned: false
    });
    setEditingEquipment(null);
  };

  const handleSubmit = () => {
    if (editingEquipment) {
      updateMutation.mutate({ id: editingEquipment.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item) => {
    setEditingEquipment(item);
    setFormData({
      terminalType: item.terminalType || "",
      serialNumber: item.serialNumber || "",
      merchantName: item.merchantName || "",
      merchantMID: item.merchantMID || "",
      businessContactName: item.businessContactName || "",
      businessPhoneNumber: item.businessPhoneNumber || "",
      ownerCellNumber: item.ownerCellNumber || "",
      emailAddress: item.emailAddress || "",
      streetAddress: item.streetAddress || "",
      city: item.city || "",
      state: item.state || "",
      dateShipped: item.dateShipped || "",
      dateReturned: item.dateReturned || "",
      terminalCost: item.terminalCost || "",
      agentAssigned: item.agentAssigned || "",
      warrantyDocumentUrl: item.warrantyDocumentUrl || "",
      status: item.status || "in_stock",
      isActive: item.isActive ?? true,
      hasBeenReturned: item.hasBeenReturned ?? false
    });
    setShowDialog(true);
  };

  const handleWarrantyUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingWarranty(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, warrantyDocumentUrl: file_url });
      toast.success("Warranty document uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload warranty document");
    } finally {
      setUploadingWarranty(false);
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = 
      item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merchantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merchantMID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.terminalType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    in_stock: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    assigned: "bg-green-100 text-green-800",
    returned: "bg-gray-100 text-gray-800",
    maintenance: "bg-orange-100 text-orange-800"
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
      <SEOHead 
        title="Equipment Inventory" 
        robots="noindex, nofollow"
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Equipment Inventory</h1>
            <p className="text-gray-600 mt-1">Manage terminal equipment and assignments</p>
          </div>
          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Terminal Type</label>
                  <Input
                    placeholder="e.g., Clover Mini, Pax A920"
                    value={formData.terminalType}
                    onChange={(e) => setFormData({ ...formData, terminalType: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Serial Number</label>
                  <Input
                    placeholder="Serial Number"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Merchant Name</label>
                  <Input
                    placeholder="Merchant Name"
                    value={formData.merchantName}
                    onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Merchant MID#</label>
                  <Input
                    placeholder="MID Number"
                    value={formData.merchantMID}
                    onChange={(e) => setFormData({ ...formData, merchantMID: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Business Contact Name</label>
                  <Input
                    placeholder="Contact Name"
                    value={formData.businessContactName}
                    onChange={(e) => setFormData({ ...formData, businessContactName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Business Phone Number</label>
                  <Input
                    placeholder="(555) 555-5555"
                    value={formData.businessPhoneNumber}
                    onChange={(e) => setFormData({ ...formData, businessPhoneNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Owner Cell Number</label>
                  <Input
                    placeholder="(555) 555-5555"
                    value={formData.ownerCellNumber}
                    onChange={(e) => setFormData({ ...formData, ownerCellNumber: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Email Address</label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.emailAddress}
                    onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Street Address</label>
                  <Input
                    placeholder="Street Address"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">State</label>
                  <Input
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date Shipped</label>
                  <Input
                    type="date"
                    value={formData.dateShipped}
                    onChange={(e) => setFormData({ ...formData, dateShipped: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date Returned</label>
                  <Input
                    type="date"
                    value={formData.dateReturned}
                    onChange={(e) => setFormData({ ...formData, dateReturned: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Terminal Cost</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.terminalCost}
                    onChange={(e) => setFormData({ ...formData, terminalCost: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Agent Assigned</label>
                  <Input
                    placeholder="Agent Name"
                    value={formData.agentAssigned}
                    onChange={(e) => setFormData({ ...formData, agentAssigned: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-3 pt-2 border-t">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <span className="text-sm font-medium">Active Terminal</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.hasBeenReturned}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasBeenReturned: checked })}
                    />
                    <span className="text-sm font-medium">Terminal Has Been Returned</span>
                  </label>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <label className="text-sm font-medium mb-2 block">Equipment Warranty Document</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="warranty-upload"
                      className="hidden"
                      onChange={handleWarrantyUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('warranty-upload').click()}
                      disabled={uploadingWarranty}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingWarranty ? "Uploading..." : "Upload Equipment Warranty"}
                    </Button>
                    {formData.warrantyDocumentUrl && (
                      <a 
                        href={formData.warrantyDocumentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        View Document
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!formData.terminalType || !formData.serialNumber}
                className="w-full bg-amber-600 hover:bg-amber-700 mt-4"
              >
                {editingEquipment ? 'Update Equipment' : 'Add Equipment'}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by serial number, merchant name, MID, or terminal type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Unreturned Inactive Terminals Report */}
        {equipment.filter(item => !item.isActive && !item.hasBeenReturned).length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Inactive Terminals Not Returned ({equipment.filter(item => !item.isActive && !item.hasBeenReturned).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {equipment.filter(item => !item.isActive && !item.hasBeenReturned).map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Terminal</p>
                        <p className="font-semibold text-red-700">{item.terminalType}</p>
                        <p className="text-xs text-gray-600">SN: {item.serialNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Contact</p>
                        <p className="font-medium text-sm">{item.businessContactName || '-'}</p>
                        <p className="text-xs text-gray-600">{item.businessPhoneNumber || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Merchant</p>
                        <p className="font-medium">{item.merchantName || '-'}</p>
                        <p className="text-xs text-gray-600">MID: {item.merchantMID || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Shipped</p>
                        <p className="text-sm">{item.dateShipped || '-'}</p>
                      </div>
                      <div className="flex items-center justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                          className="border-red-300 text-red-700 hover:bg-red-100"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Equipment List */}
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">Loading equipment...</p>
            </CardContent>
          </Card>
        ) : filteredEquipment.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No equipment found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEquipment.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Terminal Type</p>
                        <p className="font-semibold flex items-center gap-2">
                          <Package className="w-4 h-4 text-amber-600" />
                          {item.terminalType}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">SN: {item.serialNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Contact</p>
                        <p className="font-medium">{item.businessContactName || '-'}</p>
                        <p className="text-xs text-gray-600">Bus: {item.businessPhoneNumber || '-'}</p>
                        <p className="text-xs text-gray-600">Cell: {item.ownerCellNumber || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Merchant</p>
                        <p className="font-medium">{item.merchantName || '-'}</p>
                        <p className="text-xs text-gray-600">MID: {item.merchantMID || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-sm">{item.streetAddress || '-'}</p>
                        <p className="text-xs text-gray-600">{item.city ? `${item.city}, ${item.state || ''}` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Dates
                        </p>
                        <p className="text-sm">Shipped: {item.dateShipped || '-'}</p>
                        <p className="text-sm">Returned: {item.dateReturned || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Details
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          ${item.terminalCost ? item.terminalCost.toFixed(2) : '0.00'}
                        </p>
                        <p className="text-xs text-gray-600">Agent: {item.agentAssigned || '-'}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <Badge className={statusColors[item.status]}>
                        {item.status?.replace('_', ' ')}
                      </Badge>
                      <div className="flex gap-2">
                        <Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">
                          {item.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant={item.hasBeenReturned ? "default" : "outline"} className="text-xs">
                          {item.hasBeenReturned ? 'Returned' : 'Not Returned'}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}