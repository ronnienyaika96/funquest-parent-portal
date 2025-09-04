import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWooOrderStatus } from '@/hooks/useWooOrderStatus';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const orderKey = searchParams.get('key');
  
  const { data: orderStatus, isLoading } = useWooOrderStatus(orderId, Boolean(orderId));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Confirming your order...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Order</h1>
            <p className="text-gray-600 mb-6">We couldn't find your order information.</p>
            <Link to="/shop">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 pt-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Order Details
              <span className="text-sm font-normal text-gray-500">#{orderId?.slice(0, 8)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Order ID</h4>
                <p className="text-gray-600">{orderId}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {orderStatus?.status || 'Processing'}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Total</h4>
                <p className="text-lg font-bold text-gray-900">
                  {orderStatus?.currency && orderStatus?.total ? 
                    `${orderStatus.currency} ${orderStatus.total}` : 
                    'Calculating...'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Order Key</h4>
                <p className="text-gray-600 text-sm font-mono">{orderKey?.slice(0, 12)}...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Order Processing</h4>
                  <p className="text-gray-600 text-sm">We're preparing your digital products for delivery.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-semibold">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email Confirmation</h4>
                  <p className="text-gray-600 text-sm">You'll receive an email with download links shortly.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-semibold">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Access Your Content</h4>
                  <p className="text-gray-600 text-sm">Visit your orders page to download your purchased items.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              View My Orders
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;