
import React from 'react';
import { Download, FileText, Package, Truck } from 'lucide-react';

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
      statusColor: 'bg-orange-100 text-orange-700',
      hasInvoice: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
          <Package className="w-6 h-6 mr-3 text-blue-600" />
          My Orders
        </h2>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-slate-200 rounded-lg p-6 hover:border-blue-200 hover:bg-blue-50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">{order.id}</h3>
                  <p className="text-sm text-slate-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                    {order.status}
                  </span>
                  <p className="text-lg font-bold text-slate-900 mt-1">{order.total}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">Items:</p>
                <ul className="text-sm text-slate-900">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-4">
                  {order.tracking && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Truck className="w-4 h-4 mr-2" />
                      <span>Tracking: {order.tracking}</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {order.hasInvoice && (
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm py-2 px-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>Invoice</span>
                    </button>
                  )}
                  <button className="flex items-center space-x-2 text-slate-600 hover:text-slate-700 font-medium text-sm py-2 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Receipt</span>
                  </button>
                  {order.tracking && (
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm py-2 px-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                      Track Order
                    </button>
                  )}
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
