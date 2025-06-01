
import React from 'react';
import { CreditCard, Calendar, Users, Download } from 'lucide-react';

const SubscriptionCard = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Subscription Plan</h2>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          Active
        </span>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
            <span className="font-medium text-slate-900">Premium Plan</span>
          </div>
          <span className="font-bold text-blue-600">$19.99/mo</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-slate-500 mr-2" />
            <div>
              <p className="text-xs text-slate-500">Next Billing</p>
              <p className="font-medium text-slate-900">June 15, 2024</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-slate-500 mr-2" />
            <div>
              <p className="text-xs text-slate-500">Children</p>
              <p className="font-medium text-slate-900">3 of 5 allowed</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">Payment Method</p>
          <p className="font-medium text-slate-900">•••• •••• •••• 4321</p>
          <p className="text-xs text-slate-500">Expires 12/25</p>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Manage Subscription
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            Upgrade Plan
          </button>
          <button className="bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
            Update Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
