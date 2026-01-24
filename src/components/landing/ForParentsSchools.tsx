import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, School, Check, ArrowRight } from 'lucide-react';

interface ForParentsSchoolsProps {
  onGetStarted: () => void;
}

const ForParentsSchools: React.FC<ForParentsSchoolsProps> = ({ onGetStarted }) => {
  const parentBenefits = [
    'Track your child\'s learning progress',
    'Set daily learning time limits',
    'Safe, ad-free environment',
    'Works offline after download',
    'Affordable subscription plans',
  ];

  const schoolBenefits = [
    'Aligned with Uganda curriculum',
    'Supports digital learning goals',
    'Bulk enrollment for classes',
    'Teacher dashboard for monitoring',
    'Custom content for schools',
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-purple-100 text-purple-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            For Everyone
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Built for Parents & Schools
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're a parent at home or a school looking for digital learning tools, FunQuest is for you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* For Parents Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">For Parents</h3>
                <p className="text-gray-600">Home learning made easy</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {parentBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onGetStarted}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 rounded-2xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          {/* For Schools Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <School className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">For Schools</h3>
                  <p className="text-white/80">Digital learning solutions</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {schoolBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onGetStarted}
                  className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-6 rounded-2xl"
                >
                  Contact for Schools
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForParentsSchools;
