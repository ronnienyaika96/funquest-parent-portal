import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { useToast } from '@/hooks/use-toast';

const avatars = ['👧', '👦', '👶', '🧒', '👧🏻', '👦🏻', '👧🏽', '👦🏽', '👧🏿', '👦🏿'];

export function AddChildForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState(avatars[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { addChild } = useChildProfiles();
  const { toast } = useToast();

  const resetForm = () => { setName(''); setAge(''); setAvatar(avatars[0]); };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
      toast({ title: 'Please enter a valid age (1-18)', variant: 'destructive' });
      return;
    }

    addChild.mutate(
      { name: name.trim(), age: ageNum, avatar: avatar || '👧' },
      {
        onSuccess: () => {
          toast({ title: 'Profile created!', description: `${name}'s profile was added.` });
          setDialogOpen(false);
          resetForm();
        },
        onError: (error: any) => {
          console.error('[AddChildForm] error:', error);
          toast({ title: 'Error adding profile', description: error?.message || 'Unknown error', variant: 'destructive' });
        },
      }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" /><span>Add Child</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Child Profile</DialogTitle>
          <DialogDescription>Create a personalized learning profile for your child</DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Child's Name *</label>
              <Input placeholder="Enter your child's name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
              <Input type="number" min={1} max={18} placeholder="e.g. 4" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Avatar</label>
            <div className="grid grid-cols-5 gap-3">
              {avatars.map((av) => (
                <button key={av} type="button" onClick={() => setAvatar(av)} className={`text-3xl p-3 rounded-lg border-2 transition-colors ${avatar === av ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>{av}</button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button className="flex-1" type="submit" disabled={addChild.isPending}>{addChild.isPending ? 'Creating...' : 'Create Profile'}</Button>
            <Button variant="outline" className="flex-1" type="button" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
