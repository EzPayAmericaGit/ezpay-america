import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Upload, Loader2, Search, Filter, Package, DollarSign, Eye, EyeOff, Star, X, ArrowUpDown } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function ProductAdmin() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_date");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    images: [],
    active: true,
    sku: "",
    isBundle: false,
    bundleItems: [],
    regularPrice: "",
    salePrice: "",
    featured: false
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      resetForm();
      setDialogOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Product.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      resetForm();
      setDialogOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image: result.file_url });
    } catch (error) {
      alert('Failed to upload image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const currentImages = formData.images || [];
    if (currentImages.length + files.length > 4) {
      alert('Maximum 4 images allowed');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(file => base44.integrations.Core.UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map(r => r.file_url);
      setFormData({ ...formData, images: [...currentImages, ...newImageUrls] });
    } catch (error) {
      alert('Failed to upload images');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      regularPrice: formData.regularPrice ? parseFloat(formData.regularPrice) : undefined,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "",
      images: [],
      active: true,
      sku: "",
      isBundle: false,
      bundleItems: [],
      regularPrice: "",
      salePrice: "",
      featured: false
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      stock: product.stock?.toString() || "0",
      image: product.image || "",
      images: product.images || [],
      active: product.active !== false,
      sku: product.sku || "",
      isBundle: product.isBundle || false,
      bundleItems: product.bundleItems || [],
      regularPrice: product.regularPrice?.toString() || "",
      salePrice: product.salePrice?.toString() || "",
      featured: product.featured || false
    });
    setDialogOpen(true);
  };

  const toggleBundleItem = (productId) => {
    const existing = formData.bundleItems.find(item => item.productId === productId);
    if (existing) {
      setFormData({
        ...formData,
        bundleItems: formData.bundleItems.filter(item => item.productId !== productId)
      });
    } else {
      setFormData({
        ...formData,
        bundleItems: [...formData.bundleItems, { productId, quantity: 1 }]
      });
    }
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && product.active) ||
      (statusFilter === "inactive" && !product.active) ||
      (statusFilter === "bundle" && product.isBundle) ||
      (statusFilter === "featured" && product.featured);
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case "name":
        aValue = a.name?.toLowerCase() || "";
        bValue = b.name?.toLowerCase() || "";
        break;
      case "price":
        aValue = a.price || 0;
        bValue = b.price || 0;
        break;
      case "stock":
        aValue = a.stock || 0;
        bValue = b.stock || 0;
        break;
      case "created_date":
      default:
        aValue = new Date(a.created_date);
        bValue = new Date(b.created_date);
        break;
    }
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.active).length,
    inactive: products.filter(p => !p.active).length,
    bundles: products.filter(p => p.isBundle).length,
    featured: products.filter(p => p.featured).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <SEOHead title="Product Management" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your store inventory</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Data */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Product Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">SKU</label>
                      <Input
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        placeholder="PROD-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        placeholder="Electronics"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Pricing</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Regular Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.regularPrice}
                        onChange={(e) => setFormData({...formData, regularPrice: e.target.value})}
                        placeholder="99.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Sale Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.salePrice}
                        onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                        placeholder="79.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Final Price * </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Inventory</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Product Images */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Product Images (Up to 4)</h3>
                  
                  {formData.images?.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img src={img} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded border" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(formData.images?.length || 0) < 4 && (
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultipleImageUpload}
                        disabled={uploading}
                        className="flex-1"
                      />
                      {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {formData.images?.length || 0} of 4 images uploaded
                  </p>
                </div>

                {/* Bundle Configuration */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={formData.isBundle}
                      onCheckedChange={(checked) => setFormData({...formData, isBundle: checked})}
                    />
                    <label className="text-sm font-medium">This is a product bundle</label>
                  </div>

                  {formData.isBundle && (
                    <div className="ml-6 space-y-2">
                      <p className="text-sm text-gray-600">Select products to include in this bundle:</p>
                      <div className="max-h-40 overflow-y-auto space-y-2 border rounded p-3">
                        {products.filter(p => !p.isBundle && p.id !== editingProduct?.id).map(product => (
                          <div key={product.id} className="flex items-center gap-2">
                            <Checkbox
                              checked={formData.bundleItems.some(item => item.productId === product.id)}
                              onCheckedChange={() => toggleBundleItem(product.id)}
                            />
                            <span className="text-sm">{product.name} (${product.price})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900">Settings</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                      />
                      <label className="text-sm font-medium">Active (visible in shop)</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                      />
                      <label className="text-sm font-medium">Featured Product</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-purple-600 hover:bg-purple-700">
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingProduct ? 'Update Product' : 'Add Product'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500">Inactive</p>
            <p className="text-2xl font-bold text-gray-400">{stats.inactive}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500">Bundles</p>
            <p className="text-2xl font-bold text-purple-600">{stats.bundles}</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500">Featured</p>
            <p className="text-2xl font-bold text-amber-600">{stats.featured}</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border rounded-lg p-4 mb-6">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="bundle">Bundles</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}>
              <SelectTrigger>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_date-desc">Newest First</SelectItem>
                <SelectItem value="created_date-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                <SelectItem value="price-desc">Price (High-Low)</SelectItem>
                <SelectItem value="stock-asc">Stock (Low-High)</SelectItem>
                <SelectItem value="stock-desc">Stock (High-Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
            <div className="flex gap-2 mt-3">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                </span>
              )}
              {categoryFilter !== "all" && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter("all")} className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter("all")} className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                </span>
              )}
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {product.name}
                          {product.featured && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
                          {product.isBundle && <Badge variant="outline" className="text-xs">Bundle</Badge>}
                        </div>
                        {product.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.sku || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-gray-900">${product.price.toFixed(2)}</div>
                    {product.regularPrice && product.regularPrice > product.price && (
                      <div className="text-xs text-gray-500 line-through">${product.regularPrice.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.category || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {product.active ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <Eye className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Delete this product?')) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}