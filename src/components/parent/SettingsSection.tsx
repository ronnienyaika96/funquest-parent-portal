import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  User, Palette, CreditCard, Bell, Shield, Trash2, Plus, Save,
  Volume2, VolumeX, Clock, Gauge, AlertTriangle, Info
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const avatarOptions = ['🦁', '🐯', '🐻', '🐼', '🦊', '🐰', '🐸', '🦄', '🐲', '🦋', '🌟', '🎈'];

const SettingsSection = () => {
  const { children, isLoading, addChild, deleteChild } = useChildProfiles();
  const { user } = useAuth();
  const { toast } = useToast();

  // Add child form state
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');

  // Parent controls state (persisted locally)
  const [playtimeLimit, setPlaytimeLimit] = useState(() => {
    const saved = localStorage.getItem('fq_playtime_limit');
    return saved ? [parseInt(saved)] : [30];
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('fq_sound') !== 'false';
  });
  const [difficulty, setDifficulty] = useState<'easy' | 'normal'>(() => {
    return (localStorage.getItem('fq_difficulty') as 'easy' | 'normal') || 'easy';
  });

  // Modal states
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState('');
  const [resetting, setResetting] = useState(false);

  // Notification prefs (local)
  const [emailNotifs, setEmailNotifs] = useState(() => localStorage.getItem('fq_email_notifs') !== 'false');
  const [weeklyReport, setWeeklyReport] = useState(() => localStorage.getItem('fq_weekly_report') !== 'false');
  const [achievementAlerts, setAchievementAlerts] = useState(() => localStorage.getItem('fq_achievement_alerts') !== 'false');

  // Privacy prefs (local)
  const [contentFilter, setContentFilter] = useState(() => localStorage.getItem('fq_content_filter') !== 'false');
  const [shareProgress, setShareProgress] = useState(() => localStorage.getItem('fq_share_progress') === 'true');

  // Appearance (local)
  const [theme, setTheme] = useState(() => localStorage.getItem('fq_theme') || 'light');

  const handlePlaytimeChange = (v: number[]) => {
    setPlaytimeLimit(v);
    localStorage.setItem('fq_playtime_limit', String(v[0]));
  };
  const handleSoundChange = (v: boolean) => {
    setSoundEnabled(v);
    localStorage.setItem('fq_sound', String(v));
  };
  const handleDifficultyChange = (v: 'easy' | 'normal') => {
    setDifficulty(v);
    localStorage.setItem('fq_difficulty', v);
  };

  const handleSaveChild = async () => {
    if (!childName.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    const ageNum = parseInt(childAge);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
      toast({ title: 'Please enter a valid age (1-18)', variant: 'destructive' });
      return;
    }

    try {
      await addChild.mutateAsync({
        name: childName.trim(),
        age: ageNum,
        avatar: selectedAvatar || '🦁',
      });
      toast({ title: 'Child profile added! 🎉' });
      setChildName('');
      setChildAge('');
      setSelectedAvatar('🦁');
      setShowAddChild(false);
    } catch (error: any) {
      const msg = error?.message || 'Failed to add child';
      console.error('[SettingsSection] addChild error:', error);
      toast({ title: 'Error adding profile', description: msg, variant: 'destructive' });
    }
  };

  const handleDeleteChild = async (id: string) => {
    try {
      await deleteChild.mutateAsync(id);
      toast({ title: 'Profile removed' });
    } catch (error: any) {
      console.error('[SettingsSection] deleteChild error:', error);
      toast({ title: 'Failed to remove profile', description: error?.message, variant: 'destructive' });
    }
  };

  const handleResetProgress = async () => {
    if (!children || children.length === 0) {
      toast({ title: 'No children to reset progress for' });
      return;
    }
    setResetting(true);
    try {
      const childIds = children.map(c => c.id);
      const { error } = await supabase
        .from('progress')
        .delete()
        .in('child_id', childIds);
      if (error) throw error;
      toast({ title: 'Progress has been reset', description: 'All learning data has been cleared.' });
    } catch (error: any) {
      console.error('[SettingsSection] reset error:', error);
      toast({ title: 'Failed to reset progress', description: error?.message, variant: 'destructive' });
    } finally {
      setResetting(false);
    }
  };

  const showComingSoon = (title: string) => {
    setComingSoonTitle(title);
    setComingSoonOpen(true);
  };

  const saveNotificationPrefs = () => {
    localStorage.setItem('fq_email_notifs', String(emailNotifs));
    localStorage.setItem('fq_weekly_report', String(weeklyReport));
    localStorage.setItem('fq_achievement_alerts', String(achievementAlerts));
    toast({ title: 'Notification preferences saved' });
    setNotificationsOpen(false);
  };

  const savePrivacyPrefs = () => {
    localStorage.setItem('fq_content_filter', String(contentFilter));
    localStorage.setItem('fq_share_progress', String(shareProgress));
    toast({ title: 'Privacy settings saved' });
    setPrivacyOpen(false);
  };

  const saveAppearance = () => {
    localStorage.setItem('fq_theme', theme);
    toast({ title: 'Appearance updated' });
    setAppearanceOpen(false);
  };

  const settingsActions = [
    { icon: Bell, title: 'Notifications', description: 'Manage email and push notifications', action: 'Configure', onClick: () => setNotificationsOpen(true) },
    { icon: Shield, title: 'Privacy & Safety', description: 'Parental controls and content filters', action: 'Manage', onClick: () => setPrivacyOpen(true) },
    { icon: Palette, title: 'Appearance', description: 'Theme and display preferences', action: 'Customize', onClick: () => setAppearanceOpen(true) },
  ];

  return (
    <div className="space-y-8">
      {/* Child Profiles */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
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
          <Button onClick={() => setShowAddChild(!showAddChild)} className="bg-sky-500 hover:bg-sky-600 rounded-xl">
            <Plus className="w-4 h-4 mr-1" /> Add Child
          </Button>
        </div>

        {showAddChild && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-sky-50 rounded-2xl border border-sky-100">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700">Child's Name *</Label>
                <Input value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Enter name..." className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-gray-700">Age *</Label>
                <Input type="number" min={1} max={18} value={childAge} onChange={(e) => setChildAge(e.target.value)} placeholder="e.g. 4" className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-gray-700">Choose an Avatar</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {avatarOptions.map((avatar) => (
                    <button key={avatar} onClick={() => setSelectedAvatar(avatar)} className={`w-12 h-12 text-2xl rounded-xl transition-all ${selectedAvatar === avatar ? 'bg-sky-500 scale-110 shadow-lg' : 'bg-white border-2 border-gray-200 hover:border-sky-300'}`}>
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveChild} className="bg-emerald-500 hover:bg-emerald-600 rounded-xl" disabled={addChild.isPending}>
                  <Save className="w-4 h-4 mr-1" /> {addChild.isPending ? 'Saving...' : 'Save Profile'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddChild(false)} className="rounded-xl">Cancel</Button>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-4 border-sky-500 border-t-transparent" /></div>
        ) : children && children.length > 0 ? (
          <div className="space-y-3">
            {children.map((child) => (
              <motion.div key={child.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-xl flex items-center justify-center text-2xl">{child.avatar || '🦁'}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{child.name}</p>
                    <p className="text-sm text-gray-500">Age: {child.age}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteChild(child.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-5">Parent Controls</h3>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-sky-600" /><Label className="text-gray-700 font-medium">Daily Playtime Limit</Label></div>
              <span className="text-sm font-semibold text-sky-600">{playtimeLimit[0]} min</span>
            </div>
            <Slider value={playtimeLimit} onValueChange={handlePlaytimeChange} min={10} max={120} step={5} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400"><span>10 min</span><span>120 min</span></div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
              <div><p className="font-medium text-gray-800">Sound Effects</p><p className="text-xs text-gray-500">Game sounds and audio feedback</p></div>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={handleSoundChange} className="data-[state=checked]:bg-emerald-500" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-purple-600" /><Label className="text-gray-700 font-medium">Difficulty</Label></div>
            <div className="grid grid-cols-2 gap-3">
              {(['easy', 'normal'] as const).map(level => (
                <button key={level} onClick={() => handleDifficultyChange(level)} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${difficulty === level ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                  {level === 'easy' ? '🌱 Easy' : '🌟 Normal'}
                  <p className="text-xs text-gray-500 mt-1">{level === 'easy' ? 'Gentle guidance & hints' : 'Standard challenge level'}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="rounded-xl text-red-500 border-red-200 hover:bg-red-50 w-full" disabled={resetting}>
                  <AlertTriangle className="w-4 h-4 mr-2" />{resetting ? 'Resetting...' : 'Reset All Progress'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
                  <AlertDialogDescription>This will permanently delete all learning progress, scores, and achievements for all your children. This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetProgress} className="bg-red-500 hover:bg-red-600">Yes, Reset Everything</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h3>
        <div className="space-y-3">
          {settingsActions.map((section) => (
            <div key={section.title} onClick={section.onClick} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600"><section.icon className="w-5 h-5" /></div>
                <div><p className="font-medium text-gray-800">{section.title}</p><p className="text-sm text-gray-500">{section.description}</p></div>
              </div>
              <Button variant="ghost" size="sm" className="rounded-xl text-sky-600">{section.action}</Button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subscription */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
          <div><h3 className="text-lg font-bold text-gray-800">Subscription</h3><p className="text-sm text-gray-500">Manage your billing and plan</p></div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4">
          <div className="flex items-center justify-between">
            <div><p className="font-semibold text-emerald-800">Free Plan</p><p className="text-sm text-emerald-600">Basic access with limited games</p></div>
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">Active</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => showComingSoon('Upgrade Plan')} className="bg-sky-500 hover:bg-sky-600 rounded-xl flex-1">Upgrade Plan</Button>
          <Button onClick={() => showComingSoon('Cancel Subscription')} variant="outline" className="rounded-xl text-red-500 border-red-200 hover:bg-red-50">Cancel Subscription</Button>
        </div>
      </motion.div>

      {/* ===== MODALS ===== */}

      {/* Notifications Modal */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-sky-600" /> Notification Preferences</DialogTitle>
            <DialogDescription>Choose how you want to be notified</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {[
              { label: 'Email Notifications', desc: 'Receive updates via email', checked: emailNotifs, onChange: setEmailNotifs },
              { label: 'Weekly Progress Report', desc: 'Summary of your child\'s week', checked: weeklyReport, onChange: setWeeklyReport },
              { label: 'Achievement Alerts', desc: 'When your child earns a badge', checked: achievementAlerts, onChange: setAchievementAlerts },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div><p className="font-medium text-sm text-gray-800">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
                <Switch checked={item.checked} onCheckedChange={item.onChange} className="data-[state=checked]:bg-sky-500" />
              </div>
            ))}
          </div>
          <Button onClick={saveNotificationPrefs} className="w-full bg-sky-500 hover:bg-sky-600 rounded-xl">Save Preferences</Button>
        </DialogContent>
      </Dialog>

      {/* Privacy & Safety Modal */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-600" /> Privacy & Safety</DialogTitle>
            <DialogDescription>Parental controls and content settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div><p className="font-medium text-sm text-gray-800">Content Filter</p><p className="text-xs text-gray-500">Only show age-appropriate content</p></div>
              <Switch checked={contentFilter} onCheckedChange={setContentFilter} className="data-[state=checked]:bg-emerald-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div><p className="font-medium text-sm text-gray-800">Share Progress</p><p className="text-xs text-gray-500">Allow teachers to view child's progress</p></div>
              <Switch checked={shareProgress} onCheckedChange={setShareProgress} className="data-[state=checked]:bg-emerald-500" />
            </div>
          </div>
          <Button onClick={savePrivacyPrefs} className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl">Save Settings</Button>
        </DialogContent>
      </Dialog>

      {/* Appearance Modal */}
      <Dialog open={appearanceOpen} onOpenChange={setAppearanceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Palette className="w-5 h-5 text-purple-600" /> Appearance</DialogTitle>
            <DialogDescription>Customize the look and feel</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {[
              { value: 'light', label: '☀️ Light', desc: 'Bright and cheerful' },
              { value: 'dark', label: '🌙 Dark', desc: 'Easy on the eyes' },
              { value: 'auto', label: '🔄 System', desc: 'Follow device settings' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setTheme(opt.value)} className={`w-full p-3 rounded-xl border-2 text-left transition-all ${theme === opt.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <p className="font-medium text-sm text-gray-800">{opt.label}</p>
                <p className="text-xs text-gray-500">{opt.desc}</p>
              </button>
            ))}
          </div>
          <Button onClick={saveAppearance} className="w-full bg-purple-500 hover:bg-purple-600 rounded-xl">Apply Theme</Button>
        </DialogContent>
      </Dialog>

      {/* Coming Soon Modal */}
      <Dialog open={comingSoonOpen} onOpenChange={setComingSoonOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Info className="w-5 h-5 text-sky-600" /> {comingSoonTitle}</DialogTitle>
            <DialogDescription>This feature is coming soon! We're working hard to bring you billing and subscription management.</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setComingSoonOpen(false)} className="w-full bg-sky-500 hover:bg-sky-600 rounded-xl mt-2">Got it</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsSection;
