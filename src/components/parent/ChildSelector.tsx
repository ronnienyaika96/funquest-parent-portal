import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string | null;
  age: number;
}

interface ChildSelectorProps {
  children: ChildProfile[];
  selectedChildId: string | null;
  onSelectChild: (id: string) => void;
  isLoading?: boolean;
}

const ChildSelector = ({ children, selectedChildId, onSelectChild, isLoading }: ChildSelectorProps) => {
  const selectedChild = children.find(c => c.id === selectedChildId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
        <User className="w-10 h-10 mx-auto text-gray-300 mb-2" />
        <p className="text-gray-500 font-medium">No child profiles yet</p>
        <p className="text-sm text-gray-400">Add a child in Settings to start tracking</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Viewing progress for</p>
      <div className="flex items-center gap-3">
        {/* Child cards for quick switching */}
        <div className="flex gap-2 flex-1 overflow-x-auto pb-1">
          {children.map((child) => (
            <motion.button
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-w-fit ${
                child.id === selectedChildId
                  ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                child.id === selectedChildId
                  ? 'bg-white/20'
                  : 'bg-white shadow-sm'
              }`}>
                {child.avatar || '🦁'}
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">{child.name}</p>
                <p className={`text-xs ${
                  child.id === selectedChildId ? 'text-white/80' : 'text-gray-500'
                }`}>
                  Age {child.age}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildSelector;
