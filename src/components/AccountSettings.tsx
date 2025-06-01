
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, User, Bell, CreditCard, Lock, Settings } from 'lucide-react';

interface AccountSettingsProps {
  onEnterAdminMode: () => void;
}

const AccountSettings = ({ onEnterAdminMode }: AccountSettingsProps) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newsletter: true
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Settings</h2>
        <p className="text-slate-600">Manage your account preferences and settings</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input 
              type="text" 
              defaultValue="Sarah Johnson"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              defaultValue="sarah.johnson@email.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Save Changes</Button>
      </div>

      {/* Subscription Management */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <CreditCard className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-slate-900">Subscription Management</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <h4 className="font-medium text-green-900">Premium Monthly Plan</h4>
              <p className="text-sm text-green-700">Next billing: June 15, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-900">$9.99/month</p>
              <Button variant="outline" size="sm" className="mt-1">Manage</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">Change Plan</Button>
            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">Cancel Subscription</Button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Email Notifications</h4>
              <p className="text-sm text-slate-600">Receive updates about your child's progress</p>
            </div>
            <Button 
              variant={notifications.email ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications({...notifications, email: !notifications.email})}
            >
              {notifications.email ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Push Notifications</h4>
              <p className="text-sm text-slate-600">Get notified about new content and milestones</p>
            </div>
            <Button 
              variant={notifications.push ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications({...notifications, push: !notifications.push})}
            >
              {notifications.push ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Newsletter</h4>
              <p className="text-sm text-slate-600">Receive our weekly newsletter with tips and updates</p>
            </div>
            <Button 
              variant={notifications.newsletter ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications({...notifications, newsletter: !notifications.newsletter})}
            >
              {notifications.newsletter ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">Security</h3>
        </div>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full">Change Password</Button>
          <Button variant="outline" className="w-full">Enable Two-Factor Authentication</Button>
        </div>
      </div>

      {/* Admin Access */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-slate-900">Admin Access</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Access administrative dashboard for platform management</p>
          <Button 
            onClick={onEnterAdminMode}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Shield className="w-4 h-4 mr-2" />
            Enter Admin Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
