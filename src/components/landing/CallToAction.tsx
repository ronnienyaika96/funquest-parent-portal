import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, Play } from 'lucide-react';

interface CallToActionProps {
  onGetStarted: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-[10%]"
        >
          <Star className="w-8 h-8 text-yellow-300 fill-current" />
        </motion.div>
        <motion.div
          animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-20 right-[15%]"
        >
          <Sparkles className="w-6 h-6 text-white/60" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-20 left-[20%] w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute top-1/4 right-[10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-3xl mb-8"
          >
            <span className="text-4xl">🚀</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Give Your Child a Fun Start to Learning
          </h2>

          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of families using FunQuest to help their children learn letters, numbers, and words through play.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onGetStarted}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg px-10 py-7 rounded-2xl shadow-xl w-full sm:w-auto"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Get Started Free
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg px-10 py-7 rounded-2xl w-full sm:w-auto"
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>

          <p className="text-white/70 text-sm mt-6">
            No credit card required • Free forever for basic features
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
