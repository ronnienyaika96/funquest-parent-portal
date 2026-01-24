import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, BookOpen, MapPin } from 'lucide-react';

const TrustSection: React.FC = () => {
  const trustPoints = [
    {
      icon: Shield,
      title: 'Child-Safe & Ad-Free',
      description: 'No ads, no in-app purchases. Just pure learning fun in a safe environment.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Eye,
      title: 'Parent-Controlled',
      description: 'Track progress, set limits, and manage your child\'s learning journey.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: BookOpen,
      title: 'Designed by Educators',
      description: 'Content created by early childhood education experts for effective learning.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: MapPin,
      title: 'Uganda Curriculum Aligned',
      description: 'Aligned with local curriculum standards while maintaining global quality.',
      color: 'bg-yellow-100 text-yellow-700',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Safe, Trusted & Loved by Parents
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your child's safety and learning are our top priorities. Here's why parents trust FunQuest.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trustPoints.map((point, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gray-50 rounded-3xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className={`w-16 h-16 ${point.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <point.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{point.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-12 border-t border-gray-100"
        >
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-2xl">🛡️</span>
            <span className="font-medium">COPPA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-2xl">🔒</span>
            <span className="font-medium">Privacy First</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-2xl">👨‍👩‍👧</span>
            <span className="font-medium">Family Friendly</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-2xl">✅</span>
            <span className="font-medium">Teacher Approved</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
