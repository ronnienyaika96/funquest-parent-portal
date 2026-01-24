import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SampleActivities: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const activities = [
    {
      title: 'Letter Tracing',
      description: 'Learn to write letters with guided tracing',
      icon: '✍️',
      color: 'from-blue-400 to-cyan-400',
      tag: 'Most Popular',
    },
    {
      title: 'Number Counting',
      description: 'Count along with fun animations',
      icon: '🔢',
      color: 'from-green-400 to-emerald-400',
      tag: 'New',
    },
    {
      title: 'Matching Games',
      description: 'Match pictures, letters, and sounds',
      icon: '🧩',
      color: 'from-purple-400 to-pink-400',
      tag: '',
    },
    {
      title: 'Word Building',
      description: 'Create words from letters',
      icon: '📝',
      color: 'from-yellow-400 to-orange-400',
      tag: '',
    },
    {
      title: 'Color Learning',
      description: 'Explore colors through fun activities',
      icon: '🎨',
      color: 'from-pink-400 to-rose-400',
      tag: 'Kids Favorite',
    },
    {
      title: 'Shape Recognition',
      description: 'Identify and trace basic shapes',
      icon: '⭐',
      color: 'from-indigo-400 to-purple-400',
      tag: '',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8"
        >
          <div>
            <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Try It Out
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Sample Activities
            </h2>
            <p className="text-lg text-gray-600">
              Preview what your child will love learning
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full w-12 h-12 border-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full w-12 h-12 border-2"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </motion.div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex-shrink-0 w-72 snap-start"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-full">
                {/* Activity Preview */}
                <div className={`bg-gradient-to-br ${activity.color} p-8 relative`}>
                  {activity.tag && (
                    <span className="absolute top-3 right-3 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full text-gray-800">
                      {activity.tag}
                    </span>
                  )}
                  <div className="text-6xl mb-2">{activity.icon}</div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-5 h-5 text-gray-800 ml-1" fill="currentColor" />
                  </motion.button>
                </div>

                {/* Activity Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{activity.title}</h3>
                  <p className="text-gray-600 text-sm">{activity.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Scroll Hint */}
        <div className="flex sm:hidden justify-center mt-4">
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Swipe to see more
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default SampleActivities;
