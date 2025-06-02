
import React from 'react';
import { Download, FileText } from 'lucide-react';

const OrdersSection = () => {
  const orders = [
    {
      id: 'ORD-2024-001',
      date: 'May 28, 2024',
      items: ['Activity Book Set', 'Coloring Book Bundle'],
      total: '$24.99',
      status: 'Shipped',
      tracking: 'TRK123456789',
      statusColor: 'bg-green-100 text-green-700',
      hasInvoice: true
    },
    {
      id: 'ORD-2024-002',
      date: 'May 15, 2024',
      items: ['Bible Story Cards', 'Learning Flashcards'],
      total: '$18.50',
      status: 'Delivered',
      tracking: 'TRK987654321',
      statusColor: 'bg-blue-100 text-blue-700',
      hasInvoice: true
    },
    {
      id: 'ORD-2024-003',
      date: 'May 1, 2024',
      items: ['Tracing Workbook'],
      total: '$12.99',
      status: 'Processing',
      tracking: null,
      statusColor: 'bg-yellow-100 text-yellow-700',
      hasInvoice: false
    }
  ];

  const downloadInvoice = (orderId) => {
    // Mock invoice download
    alert(`Downloading invoice for ${orderId}...`);
  };

  const downloadReceipt = (orderId) => {
    // Mock receipt download
    alert(`Downloading receipt for ${orderId}...`);
  };

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
                  <h3 className="font-bold text-gray-900">{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                    {order.status}
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-1">{order.total}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Items:</p>
                <ul className="text-sm text-gray-900">
                  {order.items.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center">
                {order.tracking && (
                  <div>
                    <p className="text-sm text-gray-600">Tracking: {order.tracking}</p>
                  </div>
                )}
                <div className="flex space-x-2">
                  {order.hasInvoice && (
                    <>
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
                    </>
                  )}
                  {order.tracking && (
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm bg-blue-50 px-3 py-2 rounded-lg">
                      Track Order
                    </button>
                  )}
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
