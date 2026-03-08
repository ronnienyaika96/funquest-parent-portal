import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSubscriptionPlans, useUserSubscription, useSubscribeToPlan, SubscriptionPlan } from '@/hooks/useSubscriptions';

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { data: plans, isLoading } = useSubscriptionPlans('parent');
  const { data: userSub } = useUserSubscription();
  const subscribeMutation = useSubscribeToPlan();

  const billingPeriod = isYearly ? 'yearly' : 'monthly';

  // Group plans by name, pick the one matching billing period
  const displayPlans = React.useMemo(() => {
    if (!plans) return [];
    const grouped = new Map<string, SubscriptionPlan>();
    for (const p of plans) {
      if (p.billing_period === billingPeriod) {
        grouped.set(p.plan || p.slug || p.id, p);
      }
    }
    return Array.from(grouped.values());
  }, [plans, billingPeriod]);

  const isCurrentPlan = (plan: SubscriptionPlan) => {
    return userSub?.subscription_id === plan.id;
  };

  const isFree = (plan: SubscriptionPlan) => !plan.price || plan.price === 0;

  const handleSubscribe = (plan: SubscriptionPlan) => {
    subscribeMutation.mutate({
      subscriptionId: plan.id,
      billingPeriod: plan.billing_period || billingPeriod,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
      <div className={`grid gap-6 ${displayPlans.length === 1 ? 'max-w-md mx-auto' : displayPlans.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
        {displayPlans.map((plan, index) => {
          const current = isCurrentPlan(plan);
          const free = isFree(plan);
          const popular = plan.is_popular;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-3xl p-6 ${
                popular
                  ? 'bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-xl scale-105'
                  : 'bg-white border-2 border-gray-100 shadow-md'
              }`}
            >
              {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold mb-2 ${popular ? 'text-white' : 'text-gray-800'}`}>
                  {plan.plan}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${popular ? 'text-white' : 'text-sky-600'}`}>
                    ${plan.price ?? 0}
                  </span>
                  <span className={popular ? 'text-white/80' : 'text-gray-500'}>
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>
                <p className={`text-sm mt-2 ${popular ? 'text-white/80' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 ${popular ? 'text-amber-300' : 'text-emerald-500'}`} />
                    <span className={popular ? 'text-white' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-xl font-semibold ${
                  current
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : popular
                    ? 'bg-white text-sky-600 hover:bg-gray-100'
                    : free
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-sky-500 text-white hover:bg-sky-600'
                }`}
                disabled={current || free || subscribeMutation.isPending}
                onClick={() => handleSubscribe(plan)}
              >
                {subscribeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : current ? (
                  'Current Plan'
                ) : free ? (
                  'Free Plan'
                ) : (
                  'Upgrade Now'
                )}
              </Button>
            </motion.div>
          );
        })}
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
