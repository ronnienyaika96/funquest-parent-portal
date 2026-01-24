import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Volume2, Award, BarChart3, Smartphone, Sparkles } from 'lucide-react';

const KeyFeatures: React.FC = () => {
  const features = [
    {
      icon: PenTool,
      title: 'Interactive Letter Tracing',
      description: 'Guide children through proper letter formation with fun, touch-based tracing activities.',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
    },
    {
      icon: Volume2,
      title: 'Audio-Based Learning',
      description: 'Hear letters, words, and instructions spoken clearly to reinforce learning through sound.',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
    },
    {
      icon: Award,
      title: 'Fun Rewards & Badges',
      description: 'Celebrate every achievement with stars, trophies, and special badges that motivate kids.',
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-100',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Parents can easily see what their child has learned and where they need more practice.',
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
    },
    {
      icon: Smartphone,
      title: 'Works on All Devices',
      description: 'Learn on phones, tablets, or computers - wherever and whenever is convenient.',
      color: 'bg-cyan-500',
      lightColor: 'bg-cyan-100',
    },
    {
      icon: Sparkles,
      title: 'Engaging Animations',
      description: 'Colorful characters and fun animations keep children excited about learning.',
      color: 'bg-pink-500',
      lightColor: 'bg-pink-100',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="features" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-green-100 text-green-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Packed with Fun
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Features Kids & Parents Love
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for a fun, effective, and safe learning experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-transparent hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`${feature.lightColor} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeatures;
