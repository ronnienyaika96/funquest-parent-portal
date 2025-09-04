import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import CartSidebar from './CartSidebar';
import { useProducts } from '@/hooks/useProducts';
import { useCartManager } from '@/hooks/useCartManager';

const ShopInterface = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { products, isLoading, getCategories, searchProducts, getProductsByCategory } = useProducts();
  const { cart, addToCart, updateCartQuantity, cartTotal, cartItemCount, processCheckout, isProcessing } = useCartManager();
  const categories = getCategories();
  
  const filteredProducts = searchTerm 
    ? searchProducts(searchTerm).filter(product => 
        selectedCategory === 'All' || product.category === selectedCategory
      )
    : getProductsByCategory(selectedCategory);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mx-[15px]">FunQuest Shop</h1>
          <Button disabled className="bg-gray-400 text-white relative py-[10px] my-[15px] mx-[10px] px-[10px]">
            🛒 Cart (0)
          </Button>
        </div>
        
        <Card>
          <CardHeader className="px-0 mx-[10px]">
            <CardTitle>Find Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 mx-[15px]">FunQuest Shop</h1>
        <Button onClick={() => setIsCartOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white relative py-[10px] my-[15px] mx-[10px] px-[10px]">
          🛒 Cart ({cartItemCount})
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="px-0 mx-[10px]">
          <CardTitle>Find Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Search products..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="flex-1" 
            />
            <div className="flex gap-2">
              {categories.map(category => (
                <Button 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"} 
                  onClick={() => setSelectedCategory(category)} 
                  className={selectedCategory === category ? "bg-blue-600 text-white" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onViewDetails={() => setSelectedProduct(product)} 
            onAddToCart={quantity => addToCart(product, quantity)} 
          />
        ))}
      </div>

      {filteredProducts.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={quantity => addToCart(selectedProduct, quantity)} 
        />
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <CartSidebar 
          cart={cart} 
          onClose={() => setIsCartOpen(false)} 
          onUpdateQuantity={updateCartQuantity} 
          total={cartTotal}
          onCheckout={processCheckout}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default ShopInterface;