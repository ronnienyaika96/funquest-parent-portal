import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { useToast } from '@/hooks/use-toast';

const avatars = ['👧', '👦', '👶', '🧒', '👧🏻', '👦🏻', '👧🏽', '👦🏽', '👧🏿', '👦🏿'];

interface EditChildFormProps {
  child: { id: string; name: string; age: number; avatar: string | null } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditChildForm({ child, open, onOpenChange }: EditChildFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState(avatars[0]);
  const { updateChild } = useChildProfiles();
  const { toast } = useToast();

  useEffect(() => {
    if (child && open) {
      setName(child.name ?? '');
      setAge(child.age != null ? String(child.age) : '');
      setAvatar(child.avatar || avatars[0]);
    }
  }, [child, open]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!child) return;
    if (!name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
      toast({ title: 'Please enter a valid age (1-18)', variant: 'destructive' });
      return;
    }

    updateChild.mutate(
      { id: child.id, name: name.trim(), age: ageNum, avatar },
      {
        onSuccess: () => {
          toast({ title: 'Profile updated', description: `${name}'s profile was saved.` });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Could not update profile',
            description: error?.message || 'Unknown error',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Child Profile</DialogTitle>
          <DialogDescription>Update your child's name, age or avatar</DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Child's Name *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
              <Input type="number" min={1} max={18} value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Avatar</label>
            <div className="grid grid-cols-5 gap-3">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`text-3xl p-3 rounded-lg border-2 transition-colors ${
                    avatar === av ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button className="flex-1" type="submit" disabled={updateChild.isPending}>
              {updateChild.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" className="flex-1" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
