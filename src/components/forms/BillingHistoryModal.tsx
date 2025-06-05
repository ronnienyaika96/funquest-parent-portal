
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, CreditCard } from 'lucide-react';

interface BillingHistoryModalProps {
  children: React.ReactNode;
}

interface BillingRecord {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  invoice: string;
  description: string;
}

const BillingHistoryModal = ({ children }: BillingHistoryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const billingHistory: BillingRecord[] = [
    {
      id: '1',
      date: 'May 15, 2024',
      amount: '$19.99',
      status: 'paid',
      invoice: 'INV-2024-001',
      description: 'Premium Plan - Monthly'
    },
    {
      id: '2',
      date: 'April 15, 2024',
      amount: '$19.99',
      status: 'paid',
      invoice: 'INV-2024-002',
      description: 'Premium Plan - Monthly'
    },
    {
      id: '3',
      date: 'March 15, 2024',
      amount: '$19.99',
      status: 'paid',
      invoice: 'INV-2024-003',
      description: 'Premium Plan - Monthly'
    },
    {
      id: '4',
      date: 'February 15, 2024',
      amount: '$19.99',
      status: 'failed',
      invoice: 'INV-2024-004',
      description: 'Premium Plan - Monthly'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const handleDownloadInvoice = (invoice: string) => {
    // Mock download functionality
    alert(`Downloading invoice ${invoice}...`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Billing History</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Paid</p>
                    <p className="text-xl font-bold">$59.97</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Next Billing</p>
                    <p className="text-xl font-bold">June 15</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Invoices</p>
                    <p className="text-xl font-bold">{billingHistory.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Records */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{record.description}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                        </div>
                        <div>
                          <p className="font-bold">{record.amount}</p>
                          <p className="text-sm text-gray-600">{record.invoice}</p>
                        </div>
                        <div>
                          {getStatusBadge(record.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {record.status === 'paid' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(record.invoice)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {record.status === 'failed' && (
                        <Button size="sm">
                          Retry Payment
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillingHistoryModal;
