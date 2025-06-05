
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PaymentMethodForm from '../forms/PaymentMethodForm';

const EnhancedSubscriptionCard = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      period: 'month',
      features: ['Access to basic games', 'Up to 2 children', 'Progress tracking', 'Email support'],
      color: 'border-gray-200'
    },
    {
      name: 'Premium',
      price: '$19.99',
      period: 'month',
      features: ['Access to all games', 'Up to 5 children', 'Advanced progress tracking', 'Priority support', 'Offline content'],
      color: 'border-blue-500 bg-blue-50',
      popular: true,
      current: true
    },
    {
      name: 'Family',
      price: '$29.99',
      period: 'month',
      features: ['Everything in Premium', 'Up to 10 children', 'Advanced analytics', 'Custom learning paths', 'Family dashboard'],
      color: 'border-purple-200'
    }
  ];

  const handleProceedToCheckout = (planName: string, price: string) => {
    navigate('/checkout');
  };

  return (
    <div className="space-y-8">
      {/* Current Subscription Status */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">Premium Plan</p>
              <p className="text-green-700">$19.99/month • Next billing: June 15, 2024</p>
              <p className="text-sm text-green-600 mt-2">✓ Active subscription</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.color} transition-all duration-200 hover:shadow-lg`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-lg text-gray-600">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.current ? 'bg-gray-400 cursor-not-allowed' : plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  onClick={() => !plan.current && handleProceedToCheckout(plan.name, plan.price)}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentMethodForm />
        </CardContent>
      </Card>
    </div>
  );
};

export { EnhancedSubscriptionCard };
