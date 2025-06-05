
import React, { useState } from 'react';
import { User, Bell, CreditCard, Shield, Download, Eye, EyeOff, Lock, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ManageSubscriptionModal from './forms/ManageSubscriptionModal';
import BillingHistoryModal from './forms/BillingHistoryModal';

const AccountSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);

  // Change Password Modal
  const ChangePasswordModal = () => {
    const [passwords, setPasswords] = useState({
      current: '',
      new: '',
      confirm: ''
    });
    const [showPasswords, setShowPasswords] = useState({
      current: false,
      new: false,
      confirm: false
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwords.new !== passwords.confirm) {
        alert('New passwords do not match');
        return;
      }
      alert('Password changed successfully!');
      setShowChangePassword(false);
      setPasswords({ current: '', new: '', confirm: '' });
    };

    return (
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Change Password</Button>
              <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Two Factor Authentication Modal
  const TwoFactorModal = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [qrCodeGenerated, setQrCodeGenerated] = useState(false);

    const handleSetup = () => {
      setQrCodeGenerated(true);
    };

    const handleVerify = (e: React.FormEvent) => {
      e.preventDefault();
      alert('Two-factor authentication enabled successfully!');
      setShowTwoFactor(false);
      setQrCodeGenerated(false);
      setVerificationCode('');
    };

    return (
      <Dialog open={showTwoFactor} onOpenChange={setShowTwoFactor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!qrCodeGenerated ? (
              <div className="text-center space-y-4">
                <p>Enhance your account security with two-factor authentication.</p>
                <Button onClick={handleSetup} className="w-full">
                  Set Up Two-Factor Authentication
                </Button>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gray-200 mx-auto rounded-lg flex items-center justify-center">
                    <p className="text-xs text-gray-500">QR Code</p>
                  </div>
                  <p className="text-sm">Scan this QR code with your authenticator app</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Verify & Enable</Button>
                  <Button type="button" variant="outline" onClick={() => setShowTwoFactor(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Privacy Settings Modal
  const PrivacySettingsModal = () => {
    const [privacySettings, setPrivacySettings] = useState({
      dataCollection: true,
      analytics: false,
      marketing: true,
      childDataSharing: false
    });

    const handleSave = () => {
      alert('Privacy settings updated successfully!');
      setShowPrivacySettings(false);
    };

    return (
      <Dialog open={showPrivacySettings} onOpenChange={setShowPrivacySettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {Object.entries(privacySettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-sm text-gray-500">Control your privacy preferences</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPrivacySettings(prev => ({ ...prev, [key]: !value }))}
                  className={value ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                >
                  {value ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            ))}
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">Save Settings</Button>
              <Button variant="outline" onClick={() => setShowPrivacySettings(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <User className="w-6 h-6 mr-2 text-blue-600" />
          Account Settings
        </h2>

        {/* Profile Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                defaultValue="Sarah"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                defaultValue="Johnson"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="sarah.johnson@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-xs text-gray-500">Receive updates about your child's progress</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                <p className="text-xs text-gray-500">Get real-time updates on your device</p>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
            Subscription & Billing
          </h3>
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-blue-900">Premium Plan</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Active</span>
            </div>
            <p className="text-sm text-blue-700">$19.99/month • Next billing: June 15, 2024</p>
          </div>
          <div className="flex gap-3">
            <ManageSubscriptionModal>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Manage Subscription
              </Button>
            </ManageSubscriptionModal>
            <BillingHistoryModal>
              <Button variant="outline">
                Billing History
              </Button>
            </BillingHistoryModal>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Privacy & Security
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => setShowChangePassword(true)}
              className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium text-gray-900">Change Password</div>
              <div className="text-sm text-gray-500">Update your account password</div>
            </button>
            <button 
              onClick={() => setShowTwoFactor(true)}
              className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
              <div className="text-sm text-gray-500">Add an extra layer of security</div>
            </button>
            <button 
              onClick={() => setShowPrivacySettings(true)}
              className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium text-gray-900">Privacy Settings</div>
              <div className="text-sm text-gray-500">Control your data and privacy preferences</div>
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2 text-blue-600" />
            Data Management
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="font-medium text-gray-900">Export Data</div>
              <div className="text-sm text-gray-500">Download your account and children's data</div>
            </button>
            <button className="w-full text-left p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <div className="font-medium text-red-900">Delete Account</div>
              <div className="text-sm text-red-500">Permanently delete your account and all data</div>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Save Changes
          </button>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal />
      <TwoFactorModal />
      <PrivacySettingsModal />
    </div>
  );
};

export default AccountSettings;
