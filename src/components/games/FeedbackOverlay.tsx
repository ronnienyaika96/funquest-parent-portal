import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedbackOverlayProps {
  show: boolean;
  correct: boolean | null;
  onRetry?: () => void;
  correctText?: string;
  wrongText?: string;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  show,
  correct,
  onRetry,
  correctText = 'Awesome! 🌟',
  wrongText = 'Try again!',
}) => {
  return (
    <AnimatePresence>
      {show && correct !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex flex-col items-center gap-3"
        >
          {correct ? (
            <div className="flex items-center gap-2.5 bg-funquest-success/15 border border-funquest-success/30 rounded-2xl px-6 py-3">
              <CheckCircle className="w-7 h-7 text-funquest-success" />
              <span className="font-bold text-lg text-funquest-success">{correctText}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex items-center gap-2.5 bg-funquest-error/15 border border-funquest-error/30 rounded-2xl px-6 py-3">
                <XCircle className="w-7 h-7 text-funquest-error" />
                <span className="font-bold text-lg text-funquest-error">{wrongText}</span>
              </div>
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="rounded-full border-2 border-funquest-purple/30 text-funquest-purple hover:bg-funquest-purple/10 font-semibold"
                >
                  Try Again
                </Button>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackOverlay;
