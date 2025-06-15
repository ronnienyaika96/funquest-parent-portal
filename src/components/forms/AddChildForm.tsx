
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { School, Plus } from 'lucide-react';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { useToast } from '@/hooks/use-toast';

const avatars = ['👧', '👦', '👶', '🧒', '👧🏻', '👦🏻', '👧🏽', '👦🏽', '👧🏿', '👦🏿'];
const ageRanges = [
  { value: '2-3', label: '2-3 years' },
  { value: '3-4', label: '3-4 years' },
  { value: '4-5', label: '4-5 years' },
  { value: '5-6', label: '5-6 years' },
  { value: '6-7', label: '6-7 years' },
  { value: '7-8', label: '7-8 years' },
];

export function AddChildForm() {
  const [formData, setFormData] = useState({
    name: '',
    age_range: '',
    avatar: avatars[0],
    school: '',
    interests: [] as string[],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const interestsList = [
    'Reading', 'Math', 'Art & Coloring', 'Music', 'Science', 'Puzzles', 'Animals', 'Stories'
  ];
  const { addChild } = useChildProfiles();
  const { toast } = useToast();

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age_range: '',
      avatar: avatars[0],
      school: '',
      interests: [],
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    addChild.mutate(
      {
        name: formData.name,
        age_range: formData.age_range,
        avatar: formData.avatar,
        school: formData.school || null,
        interests: formData.interests.length ? formData.interests : null
      },
      {
        onSuccess: () => {
          toast({
            title: "Profile created!",
            description: `${formData.name}'s profile was added.`,
          });
          setDialogOpen(false);
          resetForm();
        },
        onError: (error: any) => {
          toast({
            title: "Error adding profile",
            description: error.message || "There was an error adding the child profile.",
            variant: "destructive"
          });
        },
        onSettled: () => {
          setIsSubmitting(false);
        }
      }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Child</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Child Profile</DialogTitle>
          <DialogDescription>
            Create a personalized learning profile for your child
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={onSubmit}>
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Child's Name
              </label>
              <Input
                placeholder="Enter your child's name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Range
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.age_range}
                onChange={(e) => setFormData({...formData, age_range: e.target.value})}
                required
              >
                <option value="">Select age range</option>
                {ageRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <School className="w-4 h-4 inline mr-1" />
                School (Optional)
              </label>
              <Input
                placeholder="Enter your child's school"
                value={formData.school}
                onChange={(e) => setFormData({...formData, school: e.target.value})}
              />
            </div>
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Avatar
            </label>
            <div className="grid grid-cols-5 gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setFormData({...formData, avatar})}
                  className={`text-3xl p-3 rounded-lg border-2 transition-colors ${
                    formData.avatar === avatar
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Interests (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {interestsList.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`text-sm p-2 rounded-lg border transition-colors ${
                    formData.interests.includes(interest)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button className="flex-1" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Profile'}
            </Button>
            <Button variant="outline" className="flex-1" type="button" onClick={() => { setDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
