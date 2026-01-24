import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Star } from 'lucide-react';

interface LandingHeroProps {
  onStartLearning: () => void;
  onForParents: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ onStartLearning, onForParents }) => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Stars */}
        <motion.div
          className="absolute top-20 left-[10%] text-yellow-300"
          animate={{ y: [-10, 10, -10], rotate: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-8 h-8 fill-current" />
        </motion.div>
        <motion.div
          className="absolute top-32 right-[15%] text-yellow-200"
          animate={{ y: [10, -10, 10], rotate: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Star className="w-6 h-6 fill-current" />
        </motion.div>
        <motion.div
          className="absolute top-48 left-[25%] text-white/60"
          animate={{ y: [-5, 15, -5], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Star className="w-5 h-5 fill-current" />
        </motion.div>

        {/* Floating Shapes */}
        <motion.div
          className="absolute top-1/4 right-[5%] w-16 h-16 bg-yellow-400/30 rounded-full blur-sm"
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 left-[5%] w-20 h-20 bg-green-400/20 rounded-full blur-sm"
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-[20%] w-12 h-12 bg-pink-400/25 rounded-2xl rotate-45 blur-sm"
          animate={{ rotate: [45, 90, 45], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Sparkle Effects */}
        <motion.div
          className="absolute top-[40%] left-[15%] text-white/80"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
        <motion.div
          className="absolute top-[60%] right-[25%] text-yellow-200"
          animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8 lg:mb-12"
        >
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🎓</span>
            </div>
            <span className="text-xl font-bold text-white">FunQuest Learn</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-white/90 hover:text-white transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-white/90 hover:text-white transition-colors font-medium">How It Works</a>
            <a href="#testimonials" className="text-white/90 hover:text-white transition-colors font-medium">Reviews</a>
          </nav>
          <Button 
            onClick={onStartLearning}
            className="bg-white text-blue-600 hover:bg-yellow-50 font-bold rounded-full px-6 shadow-lg"
          >
            Get Started
          </Button>
        </motion.header>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-180px)]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <span className="text-yellow-300 mr-2">✨</span>
              <span className="text-white text-sm font-medium">Fun Learning for Ages 3-7</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Learning Made Fun for{' '}
              <span className="relative">
                <span className="relative z-10">Curious</span>
                <motion.span
                  className="absolute bottom-1 left-0 right-0 h-3 bg-yellow-400/50 -z-0 rounded"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </span>{' '}
              Little Minds
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0">
              Interactive games that help children aged 3–7 learn letters, numbers, and early reading skills through play.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onStartLearning}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg px-8 py-6 rounded-2xl shadow-xl w-full sm:w-auto"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Start Learning
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onForParents}
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg px-8 py-6 rounded-2xl w-full sm:w-auto"
                >
                  For Parents & Schools
                </Button>
              </motion.div>
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex items-center justify-center lg:justify-start gap-6 mt-8"
            >
              <div className="flex items-center text-white/80">
                <span className="text-green-300 mr-2">✓</span>
                <span className="text-sm">100% Ad-Free</span>
              </div>
              <div className="flex items-center text-white/80">
                <span className="text-green-300 mr-2">✓</span>
                <span className="text-sm">Child Safe</span>
              </div>
              <div className="hidden sm:flex items-center text-white/80">
                <span className="text-green-300 mr-2">✓</span>
                <span className="text-sm">Parent Approved</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/95 backdrop-blur rounded-3xl p-6 sm:p-8 shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-6xl sm:text-8xl mb-4">👧🏾📱👦🏽</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Learning Through Play!
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Interactive games, letter tracing, and fun activities
                  </p>
                </div>

                {/* Activity Preview Cards */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-blue-50 rounded-2xl p-3 text-center cursor-pointer"
                  >
                    <div className="text-2xl mb-1">🔤</div>
                    <span className="text-xs font-medium text-blue-700">Letters</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-green-50 rounded-2xl p-3 text-center cursor-pointer"
                  >
                    <div className="text-2xl mb-1">🔢</div>
                    <span className="text-xs font-medium text-green-700">Numbers</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-yellow-50 rounded-2xl p-3 text-center cursor-pointer"
                  >
                    <div className="text-2xl mb-1">📖</div>
                    <span className="text-xs font-medium text-yellow-700">Words</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating Achievement Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute -top-4 -right-4 bg-yellow-400 rounded-2xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div className="text-left">
                    <div className="text-xs font-bold text-yellow-900">Great Job!</div>
                    <div className="text-xs text-yellow-800">10 Stars Earned</div>
                  </div>
                </div>
              </motion.div>

              {/* Progress Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="absolute -bottom-4 -left-4 bg-green-500 rounded-2xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">Level Up!</div>
                    <div className="text-xs text-green-100">ABC Master</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default LandingHero;
