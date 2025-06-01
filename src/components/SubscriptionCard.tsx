
import React from 'react';

const SubscriptionCard = () => {
  return (
    <div className="bg-gradient-to-br from-sky-500 to-yellow-400 rounded-2xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Premium Plan</h2>
        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
          Active
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">Monthly Subscription</span>
          <span className="font-bold">$19.99/mo</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">Next Billing</span>
          <span className="font-medium">June 15, 2024</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">Children</span>
          <span className="font-medium">3 of 5 allowed</span>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-white text-sky-600 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200">
          Manage Subscription
        </button>
        <button className="w-full bg-white bg-opacity-20 text-white py-2 rounded-xl font-medium hover:bg-opacity-30 transition-all duration-200">
          Upgrade to Yearly
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
