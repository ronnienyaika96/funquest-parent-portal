
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Save, X, Bell, Shield, Clock } from 'lucide-react';

interface ChildSettingsFormProps {
  child: {
    id: string;
    name: string;
    age: number;
    avatar: string;
    interests?: string[];
    school?: string;
  };
}

export function ChildSettingsForm({ child }: ChildSettingsFormProps) {
  const [formData, setFormData] = useState({
    name: child.name,
    screenTime: '60',
    notifications: true,
    parentalControls: true,
    school: child.school || ''
  });

  const handleSave = () => {
    console.log('Saving child settings:', formData);
    // Add save functionality here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 rounded-2xl font-bold py-3">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings for {child.name}</DialogTitle>
          <DialogDescription>
            Manage your child's learning preferences and parental controls
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Basic Settings
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School
                </label>
                <Input
                  placeholder="Enter school name"
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Screen Time */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Screen Time Limits
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Limit (minutes)
                </label>
                <Input
                  type="number"
                  value={formData.screenTime}
                  onChange={(e) => setFormData({...formData, screenTime: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications & Controls */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Parental Controls
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Progress Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                  className="rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Content Filtering</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.parentalControls}
                  onChange={(e) => setFormData({...formData, parentalControls: e.target.checked})}
                  className="rounded"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
