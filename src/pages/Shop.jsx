import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Package, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "../components/SEOHead";
import ShopSupportChat from "../components/shop/ShopSupportChat";
import ShoppingCartTutorial from "../components/shop/ShoppingCartTutorial";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export default function Shop() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ezCart');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [sortBy, setSortBy] = useState('name-asc');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [stockFilter, setStockFilter] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.filter({ active: true })
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    
    if (existing) {
      newCart = cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(newCart);
    localStorage.setItem('ezCart', JSON.stringify(newCart));
  };

  const updateQuantity = (productId, delta) => {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    setCart(newCart);
    localStorage.setItem('ezCart', JSON.stringify(newCart));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  
  const maxPrice = Math.max(...products.map(p => p.price), 10000);
  
  let filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);
  
  // Apply filters
  filteredProducts = filteredProducts.filter(p => {
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    const stockMatch = stockFilter === 'all' || 
                       (stockFilter === 'in-stock' && p.stock > 0) ||
                       (stockFilter === 'out-of-stock' && p.stock === 0);
    const ratingMatch = 5 >= minRating; // Assuming all products have 5 stars
    return priceMatch && stockMatch && ratingMatch;
  });
  
  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'popularity':
        return 0; // Keep original order for popularity
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <SEOHead 
        title="Shop Payment Processing Equipment & POS Systems"
        description="Shop EzPay America products including POS systems, credit card terminals, mobile card readers, receipt printers, cash drawers, and payment processing equipment. Free shipping on orders over $99."
        keywords="buy POS system, shop POS equipment, credit card terminal for sale, payment terminal, card reader, mobile card reader, wireless card reader, bluetooth card reader, EMV terminal, chip card reader, contactless terminal, NFC reader, tap to pay terminal, countertop terminal, mobile POS terminal, portable card reader, iPad POS system, tablet POS, Android POS, all-in-one POS, touchscreen POS, receipt printer, thermal printer, kitchen printer, bar printer, cash drawer, cash register, barcode scanner, label printer, customer display, pole display, kitchen display screen, payment processing equipment, merchant services equipment, credit card machine, swipe terminal, PIN pad, signature pad, wireless printer, ethernet printer, USB printer, bluetooth printer, POS accessories, POS hardware, POS peripherals, payment device, credit card reader, debit card reader, gift card reader, loyalty card reader, integrated payments, payment solutions, merchant equipment, retail equipment, restaurant equipment, POS supplies, receipt paper, thermal paper, ribbon cartridges, cleaning cards, printer maintenance, equipment warranty, POS bundles, starter kits, complete POS systems, turnkey solutions, plug and play POS, easy setup POS, wireless payment solutions, mobile payment devices, portable payment terminals, on-the-go payments, field service equipment, delivery equipment, trade show equipment, event payment processing, outdoor payment solutions, rugged terminals, weatherproof equipment, battery powered, charging station, equipment stands, mounting brackets, security cables, protective cases, carrying cases, equipment financing, payment plans, lease to own, rent to own, equipment upgrades, trade-in program, refurbished equipment, certified pre-owned, new equipment, latest technology"
      />
      
      {/* Product Structured Data for Google */}
      {sortedProducts.map((product) => (
        <script key={product.id} type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": product.description || product.name,
            "image": product.images?.length > 0 ? product.images : [product.image],
            "brand": {
              "@type": "Brand",
              "name": "EzPay America"
            },
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "USD",
              "price": product.price.toFixed(2),
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "EzPay America"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "1"
            },
            "sku": product.sku || product.id,
            "category": product.category
          })}
        </script>
      ))}
      
      <ShoppingCartTutorial />
      <ShopSupportChat />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          Home / Shop
        </div>

        {/* Header with Cart */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          
          {cartCount > 0 && (
            <Button 
              onClick={() => navigate(createPageUrl("Checkout"))}
              variant="outline"
              className="relative border-2"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              ${cartTotal.toFixed(2)}
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Button>
          )}
        </div>

        {/* Account Requirement Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-lg">
          <div className="flex items-center gap-5">
            <p className="text-amber-800 font-semibold">
              ALL ITEMS PURCHASED REQUIRE A NEW AND APPROVED ACCOUNT WITH EzPay America Inc.
            </p>
            <Button 
              onClick={() => navigate(createPageUrl("ApplyOnline"))}
              className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap"
            >
              Sign Up Online
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 pb-4 border-b overflow-x-auto">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm ${
                selectedCategory === category 
                  ? 'bg-gray-900 text-white hover:bg-gray-800' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Filters and Sort Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
              <p className="text-sm text-gray-500">
                Showing {sortedProducts.length} results
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={maxPrice}
                    step={10}
                    className="mb-2"
                  />
                </div>

                {/* Stock Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Stock Availability
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={stockFilter === 'all'}
                        onCheckedChange={() => setStockFilter('all')}
                      />
                      <span className="text-sm">All Products</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={stockFilter === 'in-stock'}
                        onCheckedChange={() => setStockFilter('in-stock')}
                      />
                      <span className="text-sm">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={stockFilter === 'out-of-stock'}
                        onCheckedChange={() => setStockFilter('out-of-stock')}
                      />
                      <span className="text-sm">Out of Stock</span>
                    </label>
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Minimum Rating
                  </label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2">
                        <Checkbox
                          checked={minRating === rating}
                          onCheckedChange={() => setMinRating(rating)}
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-sm ml-1">& up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([0, maxPrice]);
                    setStockFilter('all');
                    setMinRating(0);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const inCart = cart.find(item => item.id === product.id);
            const productImages = product.images?.length > 0 ? product.images : (product.image ? [product.image] : []);
            const currentIndex = currentImageIndex[product.id] || 0;
            
            return (
              <div key={product.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                {/* Product Image with Gallery */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {productImages.length > 0 ? (
                    <>
                      <img 
                        src={productImages[currentIndex]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {productImages.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex({
                              ...currentImageIndex,
                              [product.id]: currentIndex === 0 ? productImages.length - 1 : currentIndex - 1
                            })}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex({
                              ...currentImageIndex,
                              [product.id]: currentIndex === productImages.length - 1 ? 0 : currentIndex + 1
                            })}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {productImages.map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <Badge className="absolute top-2 right-2 bg-amber-500">
                      Only {product.stock} left
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {product.category && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {product.category}
                    </p>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(5.0)</span>
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  {!inCart ? (
                    <Button 
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-300"
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to cart'}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => updateQuantity(product.id, -1)}
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                      >
                        -
                      </Button>
                      <div className="flex-1 text-center">
                        <span className="font-semibold">{inCart.quantity}</span>
                      </div>
                      <Button 
                        onClick={() => updateQuantity(product.id, 1)}
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}