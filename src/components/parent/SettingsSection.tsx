import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  User, Palette, CreditCard, Bell, Shield, Trash2, Plus, Save,
  Volume2, VolumeX, Clock, Gauge, AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const avatarOptions = ['🦁', '🐯', '🐻', '🐼', '🦊', '🐰', '🐸', '🦄', '🐲', '🦋', '🌟', '🎈'];

const SettingsSection = () => {
  const { children, isLoading, addChild, deleteChild } = useChildProfiles();
  const { toast } = useToast();
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [childName, setChildName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [showAddChild, setShowAddChild] = useState(false);

  // Parent Controls State
  const [playtimeLimit, setPlaytimeLimit] = useState([30]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal'>('easy');

  const handleSaveChild = async () => {
    if (!childName.trim()) {
      toast({ title: 'Please enter a name', variant: 'destructive' });
      return;
    }

    try {
      await addChild.mutateAsync({
        name: childName,
        avatar: selectedAvatar,
        age_range: '3-5',
        school: null,
        interests: null
      });

      toast({ title: 'Child profile added! 🎉' });
      setChildName('');
      setSelectedAvatar('🦁');
      setShowAddChild(false);
    } catch (error) {
      toast({ title: 'Failed to add child', variant: 'destructive' });
    }
  };

  const handleDeleteChild = async (id: string) => {
    try {
      await deleteChild.mutateAsync(id);
      toast({ title: 'Profile removed' });
    } catch (error) {
      toast({ title: 'Failed to remove profile', variant: 'destructive' });
    }
  };

  const handleResetProgress = () => {
    toast({ title: 'Progress has been reset', description: 'All learning data has been cleared.' });
  };

  return (
    <div className="space-y-8">
      {/* Child Profiles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Child Profiles</h3>
              <p className="text-sm text-gray-500">Manage your children's learning accounts</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddChild(!showAddChild)}
            className="bg-sky-500 hover:bg-sky-600 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Child
          </Button>
        </div>

        {/* Add Child Form */}
        {showAddChild && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-sky-50 rounded-2xl border border-sky-100"
          >
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700">Child's Name</Label>
                <Input
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter name..."
                  className="rounded-xl mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-700">Choose an Avatar</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-12 h-12 text-2xl rounded-xl transition-all ${
                        selectedAvatar === avatar
                          ? 'bg-sky-500 scale-110 shadow-lg'
                          : 'bg-white border-2 border-gray-200 hover:border-sky-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveChild}
                  className="bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                  disabled={addChild.isPending}
                >
                  <Save className="w-4 h-4 mr-1" /> Save Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddChild(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Child List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-sky-500 border-t-transparent" />
          </div>
        ) : children && children.length > 0 ? (
          <div className="space-y-3">
            {children.map((child) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-xl flex items-center justify-center text-2xl">
                    {child.avatar || '🦁'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{child.name}</p>
                    <p className="text-sm text-gray-500">Age: {child.age_range || '3-5'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => setEditingChild(child.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteChild(child.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No child profiles yet</p>
            <p className="text-sm">Add a child to start tracking their learning</p>
          </div>
        )}
      </motion.div>

      {/* Parent Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-5">Parent Controls</h3>
        <div className="space-y-6">
          {/* Daily Playtime Limit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <Label className="text-gray-700 font-medium">Daily Playtime Limit</Label>
              </div>
              <span className="text-sm font-semibold text-sky-600">{playtimeLimit[0]} min</span>
            </div>
            <Slider
              value={playtimeLimit}
              onValueChange={setPlaytimeLimit}
              min={10}
              max={120}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>10 min</span>
              <span>120 min</span>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="font-medium text-gray-800">Sound Effects</p>
                <p className="text-xs text-gray-500">Game sounds and audio feedback</p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          {/* Difficulty Preference */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-purple-600" />
              <Label className="text-gray-700 font-medium">Difficulty</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['easy', 'normal'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    difficulty === level
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {level === 'easy' ? '🌱 Easy' : '🌟 Normal'}
                  <p className="text-xs text-gray-500 mt-1">
                    {level === 'easy' ? 'Gentle guidance & hints' : 'Standard challenge level'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Reset Progress */}
          <div className="pt-4 border-t border-gray-100">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-xl text-red-500 border-red-200 hover:bg-red-50 w-full"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Reset All Progress
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all learning progress, scores, and achievements. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetProgress}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Yes, Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h3>
        <div className="space-y-3">
          {[
            { icon: Bell, title: 'Notifications', description: 'Manage email and push notifications', action: 'Configure' },
            { icon: Shield, title: 'Privacy & Safety', description: 'Parental controls and content filters', action: 'Manage' },
            { icon: Palette, title: 'Appearance', description: 'Theme and display preferences', action: 'Customize' },
          ].map((section) => (
            <div
              key={section.title}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600">
                  <section.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{section.title}</p>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="rounded-xl text-sky-600">
                {section.action}
              </Button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Subscription</h3>
            <p className="text-sm text-gray-500">Manage your billing and plan</p>
          </div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-emerald-800">Free Plan</p>
              <p className="text-sm text-emerald-600">Basic access with limited games</p>
            </div>
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">Active</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="bg-sky-500 hover:bg-sky-600 rounded-xl flex-1">Upgrade Plan</Button>
          <Button variant="outline" className="rounded-xl text-red-500 border-red-200 hover:bg-red-50">
            Cancel Subscription
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsSection;
