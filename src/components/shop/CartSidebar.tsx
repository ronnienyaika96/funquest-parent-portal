
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CartSidebar = ({ cart, onClose, onUpdateQuantity, total, onCheckout, isProcessing = false }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    // Mock coupon logic
    if (couponCode.toLowerCase() === 'save10') {
      setDiscount(total * 0.1);
    } else if (couponCode.toLowerCase() === 'welcome20') {
      setDiscount(total * 0.2);
    } else {
      setDiscount(0);
      alert('Invalid coupon code');
    }
  };

  const finalTotal = total - discount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full overflow-y-auto">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Shopping Cart</CardTitle>
              <Button variant="outline" onClick={onClose}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="flex-1 py-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-blue-600 font-bold">${item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="px-2">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, 0)}
                          className="text-red-500 mt-2"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="border-t pt-4">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button onClick={applyCoupon} variant="outline">
                      Apply
                    </Button>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={onCheckout}
                    disabled={isProcessing}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartSidebar;
