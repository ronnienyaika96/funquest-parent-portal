
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product, onViewDetails, onAddToCart }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 bg-white border border-gray-200">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          {product.badge && (
            <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
              product.badge === 'New' ? 'bg-green-100 text-green-700' :
              product.badge === 'Best Seller' ? 'bg-blue-100 text-blue-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {product.badge}
            </span>
          )}
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.shortDescription}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            onClick={() => onAddToCart(1)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
