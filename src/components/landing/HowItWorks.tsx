import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer, Gamepad2, Trophy } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: MousePointer,
      step: '1',
      title: 'Choose an Activity',
      description: 'Pick from letters, numbers, colors, or word games based on your child\'s interests.',
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Gamepad2,
      step: '2',
      title: 'Play, Trace & Interact',
      description: 'Your child engages with fun games, traces letters, and learns through interactive play.',
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-50',
    },
    {
      icon: Trophy,
      step: '3',
      title: 'Earn Stars & Rewards',
      description: 'Celebrate achievements with stars, badges, and fun animations that motivate learning.',
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Simple & Fun
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How FunQuest Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started is easy! Just three simple steps to a world of learning fun.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-200 via-green-200 to-yellow-200 rounded-full -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`${step.bgColor} rounded-3xl p-8 text-center relative overflow-hidden h-full`}
                >
                  {/* Step Number */}
                  <div className={`absolute top-4 right-4 w-10 h-10 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {step.step}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>

                  {/* Decorative Elements */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/50 rounded-full blur-2xl" />
                </motion.div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-3xl text-gray-300"
                    >
                      ↓
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
