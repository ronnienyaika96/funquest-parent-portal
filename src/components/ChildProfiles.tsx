
import React, { useState } from 'react';
import { Plus, Edit2, Star, Trophy, Clock, BookOpen, Trash2 } from 'lucide-react';
import { AddChildForm } from './forms/AddChildForm';
import { ChildSettingsForm } from './forms/ChildSettingsForm';
import { ChildProgressModal } from './forms/ChildProgressModal';
import { useIsMobile } from '../hooks/use-mobile';
import MobileChildProfiles from './mobile/MobileChildProfiles';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { useToast } from '@/hooks/use-toast';

interface ChildProfilesProps {
  preview?: boolean;
}
const ChildProfiles = ({
  preview = false
}: ChildProfilesProps) => {
  const isMobile = useIsMobile();

  // Use new hook for live children data from Supabase
  const { children, isLoading, error, deleteChild } = useChildProfiles();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Use mobile version on mobile devices
  if (isMobile && !preview) {
    return <MobileChildProfiles />;
  }

  if (isLoading) {
    return <div className="text-center py-16 text-blue-600 font-medium">Loading children profiles...</div>;
  }
  if (error) {
    return <div className="text-center py-16 text-red-600 font-medium">Failed to load profiles: {(error as any)?.message ?? "Unknown error"}</div>;
  }

  // For Preview: show only first 2
  const displayChildren = preview && children ? children.slice(0, 2) : children;

  // Handler for delete click
  const handleDelete = (childId: string, childName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${childName}'s profile? This cannot be undone.`)) return;
    setDeletingId(childId);
    deleteChild.mutate(childId, {
      onSuccess: () => {
        toast({
          title: "Child profile deleted",
          description: "Successfully removed the child profile.",
        });
        setDeletingId(null);
      },
      onError: (err: any) => {
        toast({
          title: "Failed to delete profile",
          description: err.message ?? "An error occurred.",
          variant: "destructive",
        });
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Children</h2>
          <p className="text-gray-600 mt-1">Manage your children's learning profiles</p>
        </div>
        {!preview && <AddChildForm />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayChildren && displayChildren.length > 0 ? displayChildren.map(child => (
          <div key={child.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{child.avatar || '🧒'}</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{child.name}</h3>
                  <p className="text-gray-500">{child.age_range || 'N/A'} years</p>
                </div>
              </div>
              {!preview && (
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-gray-600" title="Edit profile">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    className={`text-red-500 hover:text-red-700 disabled:opacity-40`}
                    title="Delete profile"
                    onClick={() => handleDelete(child.id, child.name)}
                    disabled={deletingId === child.id}
                  >
                    {deletingId === child.id ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="2" opacity="0.3" />
                        <path d="M8 1.5a6.5 6.5 0 1 1-4.6 11" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Level</span>
                  <span className="text-sm font-bold text-blue-900">---</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `20%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">N/A h played</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-600">N/A badges</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">N/A books</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-600">Top activity</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Favorite:</span> ---
                </p>
              </div>

              {!preview && (
                <div className="flex space-x-2 pt-2">
                  {/* <ChildProgressModal child={child} /> */}
                  {/* <ChildSettingsForm child={child} /> */}
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center text-gray-400 text-lg py-20">
            No child profiles found. Click "Add Child" to create one!
          </div>
        )}
      </div>

      {preview && children && children.length > 2 && (
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Showing {displayChildren.length} of {children.length} children
          </p>
        </div>
      )}
    </div>
  );
};

export default ChildProfiles;
