import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import GameShell from '@/components/games/GameShell';

export interface GateChild {
  id: string;
  name: string;
  age: number | null;
  avatar: string | null;
}

interface ChildSelectGateProps {
  children: GateChild[];
  onSelect: (childId: string) => void;
  onCancel: () => void;
  onAddChild?: () => void;
}

/**
 * Shown before a game starts when no child has been chosen yet, so progress and
 * sessions are always attributed to a real child profile.
 */
const ChildSelectGate: React.FC<ChildSelectGateProps> = ({ children, onSelect, onCancel, onAddChild }) => {
  return (
    <GameShell>
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card/95 backdrop-blur-md rounded-3xl shadow-strong p-6 sm:p-8 w-full max-w-lg text-center"
        >
          <span className="text-5xl block mb-3">🙋</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">Who's playing?</h1>
          <p className="text-muted-foreground mb-6">Pick a player so we can save your stars.</p>

          {children.length === 0 ? (
            <div className="space-y-4">
              <p className="text-foreground font-semibold">No child profiles yet.</p>
              <p className="text-sm text-muted-foreground">
                Add a child in the parent dashboard to start tracking progress.
              </p>
              {onAddChild && (
                <Button onClick={onAddChild} className="rounded-full px-8 font-semibold">
                  Go to Parent Dashboard
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {children.map((child, i) => (
                <motion.button
                  key={child.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelect(child.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/60 hover:bg-muted border-2 border-transparent hover:border-primary/40 transition-colors min-h-[110px] justify-center"
                >
                  <span className="text-4xl">{child.avatar || '🦁'}</span>
                  <span className="font-bold text-foreground text-sm leading-tight">{child.name}</span>
                  {child.age != null && (
                    <span className="text-xs text-muted-foreground">Age {child.age}</span>
                  )}
                </motion.button>
              ))}
            </div>
          )}

          <Button variant="ghost" onClick={onCancel} className="rounded-full font-semibold">
            Back to Activities
          </Button>
        </motion.div>
      </div>
    </GameShell>
  );
};

export default ChildSelectGate;
