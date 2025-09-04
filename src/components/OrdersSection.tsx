
import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const OrdersSection = () => {
  const { orders, isLoading } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const downloadInvoice = async (orderId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('download-file', {
        body: { 
          type: 'invoice',
          order_id: orderId 
        }
      });
      
      if (error) throw error;
      
      if (data?.download_url) {
        window.open(data.download_url, '_blank');
      } else {
        throw new Error('No download URL received');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert(`Failed to download invoice. Please try again later.`);
    }
  };

  const downloadReceipt = async (orderId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('download-file', {
        body: { 
          type: 'receipt',
          order_id: orderId 
        }
      });
      
      if (error) throw error;
      
      if (data?.download_url) {
        window.open(data.download_url, '_blank');
      } else {
        throw new Error('No download URL received');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert(`Failed to download receipt. Please try again later.`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            📦 My Orders
          </h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            📦 My Orders
          </h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">When you make your first purchase, it will appear here.</p>
            <button 
              onClick={() => window.location.href = '/shop'}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Visit Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          📦 My Orders
        </h2>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">#{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(order.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${order.total?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Items:</p>
                <ul className="text-sm text-gray-900">
                  {order.order_items?.map((item) => (
                    <li key={item.id}>
                      • {item.title} (Qty: {item.quantity}) - ${item.price.toFixed(2)}
                    </li>
                  )) || <li>• No items found</li>}
                </ul>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => downloadInvoice(order.id)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm bg-blue-50 px-3 py-2 rounded-lg"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Invoice</span>
                  </button>
                  <button 
                    onClick={() => downloadReceipt(order.id)}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium text-sm bg-green-50 px-3 py-2 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Receipt</span>
                  </button>
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm bg-purple-50 px-3 py-2 rounded-lg">
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersSection;
