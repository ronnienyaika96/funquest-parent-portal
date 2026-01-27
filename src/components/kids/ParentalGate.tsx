
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ParentalGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  navigateTo?: string;
}

const ParentalGate = ({ isOpen, onClose, onSuccess, navigateTo = '/parent' }: ParentalGateProps) => {
  const navigate = useNavigate();
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  // Generate new math problem
  const generateProblem = () => {
    setNum1(Math.floor(Math.random() * 10) + 3);
    setNum2(Math.floor(Math.random() * 10) + 2);
    setUserAnswer('');
    setError(false);
  };

  useEffect(() => {
    if (isOpen) {
      generateProblem();
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const correctAnswer = num1 + num2;
    
    if (parseInt(userAnswer) === correctAnswer) {
      onSuccess?.();
      onClose();
      navigate(navigateTo);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setUserAnswer('');
    }
  };

  const handleNumberClick = (num: number) => {
    if (userAnswer.length < 3) {
      setUserAnswer(prev => prev + num.toString());
      setError(false);
    }
  };

  const handleBackspace = () => {
    setUserAnswer(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className={`bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl ${shake ? 'animate-shake' : ''}`}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-5xl mb-3 block">🔒</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Grown-ups Only!</h2>
              <p className="text-gray-600">Solve this math puzzle to enter</p>
            </div>

            {/* Math Problem */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl font-bold text-gray-800">
                  {num1} + {num2} = ?
                </span>
              </div>
            </div>

            {/* Answer Display */}
            <motion.div 
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              className={`
                text-center text-4xl font-bold mb-4 py-4 rounded-xl border-2
                ${error ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-200 bg-gray-50 text-gray-800'}
              `}
            >
              {userAnswer || '—'}
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center mb-4 font-medium"
              >
                Oops! Try again 🤔
              </motion.p>
            )}

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNumberClick(num)}
                  className="h-14 bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold rounded-xl shadow-md transition-colors"
                >
                  {num}
                </motion.button>
              ))}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleBackspace}
                className="h-14 bg-gray-400 hover:bg-gray-500 text-white text-xl font-bold rounded-xl shadow-md transition-colors"
              >
                ⌫
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNumberClick(0)}
                className="h-14 bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold rounded-xl shadow-md transition-colors"
              >
                0
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSubmit}
                className="h-14 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-xl shadow-md transition-colors"
              >
                ✓
              </motion.button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ParentalGate;
