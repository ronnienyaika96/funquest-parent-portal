
import React from 'react';

const SubscriptionCard = () => {
  return (
    <div className="bg-blue-50 rounded-2xl shadow-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-blue-900">Premium Plan</h2>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          Active
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-700">Monthly Subscription</span>
          <span className="font-bold text-blue-900">$19.99/mo</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-700">Next Billing</span>
          <span className="font-medium text-blue-900">June 15, 2024</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-700">Children</span>
          <span className="font-medium text-blue-900">3 of 5 allowed</span>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200">
          Manage Subscription
        </button>
        <button className="w-full bg-blue-100 text-blue-700 py-2 rounded-xl font-medium hover:bg-blue-200 transition-all duration-200">
          Upgrade to Yearly
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
