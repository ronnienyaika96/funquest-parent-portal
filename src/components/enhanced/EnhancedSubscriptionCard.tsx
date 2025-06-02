
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CreditCard, Calendar, Users, Download, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: '$9.99',
    interval: 'month',
    features: ['2 children', 'Basic games', 'Email support'],
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: '$19.99',
    interval: 'month',
    features: ['5 children', 'All games', 'Priority support', 'Progress reports'],
    popular: true
  },
  {
    id: 'family',
    name: 'Family Plan',
    price: '$29.99',
    interval: 'month',
    features: ['Unlimited children', 'All games', '24/7 support', 'Advanced analytics', 'Printable content'],
    popular: false
  }
];

export function EnhancedSubscriptionCard() {
  const [currentPlan] = useState('premium');
  const [billingHistory] = useState([
    { date: '2024-05-15', amount: '$19.99', status: 'paid', invoice: 'INV-001' },
    { date: '2024-04-15', amount: '$19.99', status: 'paid', invoice: 'INV-002' },
    { date: '2024-03-15', amount: '$19.99', status: 'paid', invoice: 'INV-003' },
  ]);

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Premium Plan</CardTitle>
              <CardDescription className="text-blue-700">Your current subscription</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-700">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">$19.99/month</p>
                  <p className="text-sm text-blue-700">Billed monthly</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">June 15, 2024</p>
                  <p className="text-sm text-blue-700">Next billing date</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">3 of 5 children</p>
                <p className="text-sm text-blue-700">Children profiles used</p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Manage Your Subscription</DialogTitle>
                    <DialogDescription>
                      Update your subscription plan or billing details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Plan Selection */}
                    <div>
                      <h4 className="font-medium mb-3">Choose Plan</h4>
                      <div className="space-y-3">
                        {subscriptionPlans.map((plan) => (
                          <div
                            key={plan.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              plan.id === currentPlan
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium">{plan.name}</h5>
                                  {plan.popular && (
                                    <Badge className="bg-orange-100 text-orange-800">Most Popular</Badge>
                                  )}
                                  {plan.id === currentPlan && (
                                    <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {plan.features.join(' • ')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{plan.price}</p>
                                <p className="text-sm text-gray-500">per {plan.interval}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Billing Frequency */}
                    <div>
                      <h4 className="font-medium mb-3">Billing Frequency</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border rounded-lg p-3 cursor-pointer border-blue-500 bg-blue-50">
                          <div className="text-center">
                            <p className="font-medium">Monthly</p>
                            <p className="text-sm text-gray-600">$19.99/month</p>
                          </div>
                        </div>
                        <div className="border rounded-lg p-3 cursor-pointer hover:border-gray-300">
                          <div className="text-center">
                            <p className="font-medium">Yearly</p>
                            <p className="text-sm text-gray-600">$199.99/year</p>
                            <Badge className="bg-green-100 text-green-800 text-xs">Save 17%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="flex-1">Update Subscription</Button>
                      <Button variant="outline" className="flex-1">Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-blue-700 border-blue-300">
                    <Download className="w-4 h-4 mr-2" />
                    Billing History
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Billing History</DialogTitle>
                    <DialogDescription>
                      View and download your payment history
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {billingHistory.map((bill, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-medium">{bill.amount}</p>
                            <p className="text-sm text-gray-600">{bill.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-green-100 text-green-800">Paid</Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <CreditCard className="w-8 h-8 text-gray-600" />
              <div>
                <p className="font-medium">**** **** **** 4242</p>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage & Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>Track your current plan usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Children Profiles</span>
                <span className="text-sm text-gray-600">3 of 5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Monthly Game Sessions</span>
                <span className="text-sm text-gray-600">245 of 500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '49%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
