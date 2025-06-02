
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    onAddToCart(quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{product.title}</CardTitle>
            <Button variant="outline" onClick={onClose} className="text-gray-500">
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
              <img
                src={product.images ? product.images[selectedImage] : product.image}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg mb-4"
              />
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through ml-2">${product.originalPrice}</span>
                )}
              </div>

              {product.badge && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  product.badge === 'New' ? 'bg-green-100 text-green-700' :
                  product.badge === 'Best Seller' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {product.badge}
                </span>
              )}

              <p className="text-gray-700 mb-6 leading-relaxed">{product.longDescription}</p>

              <div className="flex items-center gap-4 mb-6">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>

              {/* Related Products Section */}
              {product.relatedProducts && (
                <div className="mt-8">
                  <h3 className="font-bold text-lg mb-4">You might also like</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.relatedProducts.map((related, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <img src={related.image} alt={related.title} className="w-full h-24 object-cover rounded mb-2" />
                        <p className="font-medium text-sm">{related.title}</p>
                        <p className="text-blue-600 font-bold">${related.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductModal;
