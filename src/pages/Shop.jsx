import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "../components/SEOHead";

export default function Shop() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ezCart');
    return saved ? JSON.parse(saved) : [];
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
      <SEOHead 
        title="EzCart - Shop"
        description="Shop EzPay America products and services"
        keywords="shop, products, payment solutions, POS systems"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">EzCart Shop</h1>
            <p className="text-gray-600">Browse our products and services</p>
          </div>
          
          {cartCount > 0 && (
            <Button 
              onClick={() => navigate(createPageUrl("Checkout"))}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 relative"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {cartCount}
              </span>
            </Button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const inCart = cart.find(item => item.id === product.id);
            
            return (
              <Card key={product.id} className="hover:shadow-xl transition-shadow">
                {product.image && (
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  {product.category && (
                    <span className="text-xs text-gray-500">{product.category}</span>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <p className="text-2xl font-bold text-amber-600">
                    ${product.price.toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter>
                  {!inCart ? (
                    <Button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <Button 
                        onClick={() => updateQuantity(product.id, -1)}
                        variant="outline"
                        size="icon"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-semibold">{inCart.quantity}</span>
                      <Button 
                        onClick={() => updateQuantity(product.id, 1)}
                        variant="outline"
                        size="icon"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}