
import React from 'react';
import { User, Mail, Phone, Lock, CreditCard, Shield } from 'lucide-react';

const AccountSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
          <User className="w-6 h-6 mr-3 text-blue-600" />
          Account Settings
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input 
                type="text" 
                defaultValue="Sarah Johnson"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="flex">
                <Mail className="w-5 h-5 text-slate-400 mt-3 mr-3" />
                <input 
                  type="email" 
                  defaultValue="sarah.johnson@email.com"
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <div className="flex">
                <Phone className="w-5 h-5 text-slate-400 mt-3 mr-3" />
                <input 
                  type="tel" 
                  defaultValue="+1 (555) 123-4567"
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Security</h3>
            
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-slate-600 mr-2" />
                  <span className="font-medium text-slate-900">Password</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Change
                </button>
              </div>
              <p className="text-sm text-slate-600">Last updated 3 months ago</p>
            </div>
            
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-slate-600 mr-2" />
                  <span className="font-medium text-slate-900">Two-Factor Authentication</span>
                </div>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Disabled</span>
              </div>
              <p className="text-sm text-slate-600 mb-2">Add an extra layer of security to your account</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Subscription Management
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Current Plan</h4>
              <p className="text-2xl font-bold text-blue-600 mb-1">Premium</p>
              <p className="text-sm text-slate-600">$19.99/month</p>
            </div>
            
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Next Billing</h4>
              <p className="text-lg font-bold text-slate-900 mb-1">June 15, 2024</p>
              <p className="text-sm text-slate-600">Auto-renewal enabled</p>
            </div>
            
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Payment Method</h4>
              <p className="text-lg font-bold text-slate-900 mb-1">•••• 4321</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Update Card
              </button>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Upgrade to Yearly
            </button>
            <button className="border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
