
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, AlertTriangle } from 'lucide-react';

interface ManageSubscriptionModalProps {
  children: React.ReactNode;
}

const ManageSubscriptionModal = ({ children }: ManageSubscriptionModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const currentPlan = {
    name: 'Premium Plan',
    price: '$19.99/month',
    nextBilling: 'June 15, 2024',
    features: ['Unlimited games', '5 children profiles', 'Progress tracking', 'Priority support']
  };

  const plans = [
    {
      name: 'Basic',
      price: '$9.99/month',
      features: ['Limited games', '2 children profiles', 'Basic progress tracking']
    },
    {
      name: 'Premium',
      price: '$19.99/month',
      features: ['Unlimited games', '5 children profiles', 'Progress tracking', 'Priority support'],
      current: true
    },
    {
      name: 'Family',
      price: '$29.99/month',
      features: ['Unlimited games', '10 children profiles', 'Advanced analytics', 'Premium support', 'Offline content']
    }
  ];

  const handlePlanChange = (planName: string) => {
    // Mock plan change
    alert(`Plan will be changed to ${planName} at the next billing cycle.`);
    setIsChangingPlan(false);
    setIsOpen(false);
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      alert('Subscription cancellation scheduled for end of billing period.');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Subscription</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Plan
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-lg">{currentPlan.name}</p>
                  <p className="text-gray-600">{currentPlan.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Next billing: {currentPlan.nextBilling}</span>
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-2">Plan features:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Change Plan */}
          {isChangingPlan ? (
            <Card>
              <CardHeader>
                <CardTitle>Choose a New Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <Card key={plan.name} className={plan.current ? 'border-blue-500' : ''}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {plan.name}
                          {plan.current && <Badge>Current</Badge>}
                        </CardTitle>
                        <p className="text-2xl font-bold">{plan.price}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm mb-4">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {!plan.current && (
                          <Button
                            onClick={() => handlePlanChange(plan.name)}
                            className="w-full"
                          >
                            Switch to {plan.name}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" onClick={() => setIsChangingPlan(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-4">
              <Button onClick={() => setIsChangingPlan(true)}>
                Change Plan
              </Button>
              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
            </div>
          )}

          {/* Cancel Subscription */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Cancel Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Canceling your subscription will remove access to premium features at the end of your current billing period.
              </p>
              <Button variant="outline" onClick={handleCancelSubscription} className="text-red-600 border-red-200 hover:bg-red-50">
                Cancel Subscription
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageSubscriptionModal;
