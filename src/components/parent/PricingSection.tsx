import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for trying out FunQuest',
      features: [
        '3 games per day',
        '1 child profile',
        'Basic progress tracking',
        'Ad-supported'
      ],
      cta: 'Current Plan',
      popular: false,
      disabled: true
    },
    {
      name: 'Family',
      monthlyPrice: 9.99,
      yearlyPrice: 79.99,
      description: 'Best for growing families',
      features: [
        'Unlimited games',
        'Up to 4 child profiles',
        'Detailed progress reports',
        'Ad-free experience',
        'Offline mode',
        'Priority support'
      ],
      cta: 'Upgrade Now',
      popular: true,
      disabled: false
    },
    {
      name: 'School',
      monthlyPrice: 29.99,
      yearlyPrice: 249.99,
      description: 'For classrooms & educators',
      features: [
        'Everything in Family',
        'Up to 30 students',
        'Teacher dashboard',
        'Curriculum alignment',
        'Bulk progress exports',
        'Dedicated support'
      ],
      cta: 'Contact Us',
      popular: false,
      disabled: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`font-medium ${!isYearly ? 'text-sky-600' : 'text-gray-500'}`}>
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="data-[state=checked]:bg-emerald-500"
        />
        <span className={`font-medium ${isYearly ? 'text-emerald-600' : 'text-gray-500'}`}>
          Yearly
        </span>
        {isYearly && (
          <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
            Save 33%
          </span>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-3xl p-6 ${
              plan.popular
                ? 'bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-xl scale-105'
                : 'bg-white border-2 border-gray-100 shadow-md'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-800'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-sky-600'}`}>
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className={plan.popular ? 'text-white/80' : 'text-gray-500'}>
                  /{isYearly ? 'year' : 'month'}
                </span>
              </div>
              <p className={`text-sm mt-2 ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                {plan.description}
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${plan.popular ? 'text-amber-300' : 'text-emerald-500'}`} />
                  <span className={plan.popular ? 'text-white' : 'text-gray-600'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full rounded-xl font-semibold ${
                plan.popular
                  ? 'bg-white text-sky-600 hover:bg-gray-100'
                  : plan.disabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-sky-500 text-white hover:bg-sky-600'
              }`}
              disabled={plan.disabled}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* FAQ Link */}
      <p className="text-center text-gray-500 text-sm">
        Questions? <a href="#" className="text-sky-600 hover:underline">View our FAQ</a> or{' '}
        <a href="#" className="text-sky-600 hover:underline">contact support</a>
      </p>
    </div>
  );
};

export default PricingSection;
