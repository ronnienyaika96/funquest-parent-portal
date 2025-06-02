
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Eye, Ban, CheckCircle, AlertTriangle, Users, Baby } from 'lucide-react';

const parentAccounts = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    status: 'active',
    subscription: 'Premium',
    children: 2,
    joinDate: '2024-01-15',
    lastActive: '2024-06-01'
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike@example.com',
    status: 'active',
    subscription: 'Basic',
    children: 1,
    joinDate: '2024-02-20',
    lastActive: '2024-05-30'
  },
  {
    id: 3,
    name: 'Lisa Rodriguez',
    email: 'lisa@example.com',
    status: 'flagged',
    subscription: 'Free',
    children: 3,
    joinDate: '2024-03-10',
    lastActive: '2024-05-28'
  }
];

const childProfiles = [
  {
    id: 1,
    name: 'Emma Johnson',
    age: 5,
    parentEmail: 'sarah@example.com',
    level: 8,
    gamesPlayed: 45,
    timeSpent: '12h 30m',
    lastActive: '2024-06-01'
  },
  {
    id: 2,
    name: 'Lucas Johnson',
    age: 7,
    parentEmail: 'sarah@example.com',
    level: 12,
    gamesPlayed: 78,
    timeSpent: '25h 15m',
    lastActive: '2024-06-01'
  }
];

export function ParentChildManager() {
  const [activeTab, setActiveTab] = useState('parents');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'flagged':
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'Premium':
        return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
      case 'Basic':
        return <Badge className="bg-blue-100 text-blue-800">Basic</Badge>;
      case 'Free':
        return <Badge className="bg-gray-100 text-gray-800">Free</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users & Children Management</h1>
        <p className="text-gray-600 mt-2">Manage parent accounts and child profiles</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('parents')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'parents'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Parent Accounts</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('children')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'children'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Baby className="w-4 h-4" />
            <span>Child Profiles</span>
          </div>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      {activeTab === 'parents' && (
        <Card>
          <CardHeader>
            <CardTitle>Parent Accounts</CardTitle>
            <CardDescription>Manage all parent accounts and their subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Children</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parentAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{getStatusBadge(account.status)}</TableCell>
                    <TableCell>{getSubscriptionBadge(account.subscription)}</TableCell>
                    <TableCell>{account.children}</TableCell>
                    <TableCell>{account.joinDate}</TableCell>
                    <TableCell>{account.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'children' && (
        <Card>
          <CardHeader>
            <CardTitle>Child Profiles</CardTitle>
            <CardDescription>View and manage child profiles and their activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Parent Email</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Games Played</TableHead>
                  <TableHead>Time Spent</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {childProfiles.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell className="font-medium">{child.name}</TableCell>
                    <TableCell>{child.age} years</TableCell>
                    <TableCell>{child.parentEmail}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Level {child.level}</Badge>
                    </TableCell>
                    <TableCell>{child.gamesPlayed}</TableCell>
                    <TableCell>{child.timeSpent}</TableCell>
                    <TableCell>{child.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
