
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, AlertTriangle, CheckCircle, Clock, User, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const engagementData = [
  { day: 'Mon', sessions: 320, avgTime: 25 },
  { day: 'Tue', sessions: 380, avgTime: 28 },
  { day: 'Wed', sessions: 420, avgTime: 30 },
  { day: 'Thu', sessions: 390, avgTime: 27 },
  { day: 'Fri', sessions: 450, avgTime: 32 },
  { day: 'Sat', sessions: 520, avgTime: 35 },
  { day: 'Sun', sessions: 480, avgTime: 33 },
];

const gameAnalytics = [
  { game: 'Letter Tracing', sessions: 1250, completion: 85 },
  { game: 'Math Puzzles', sessions: 980, completion: 78 },
  { game: 'Coloring', sessions: 1420, completion: 92 },
  { game: 'Word Games', sessions: 760, completion: 71 },
];

const errorLogs = [
  {
    id: 1,
    type: 'API Error',
    message: 'Failed to load game assets',
    timestamp: '2024-06-02 14:30:15',
    severity: 'high',
    user: 'sarah@example.com'
  },
  {
    id: 2,
    type: 'Payment Error',
    message: 'Stripe webhook timeout',
    timestamp: '2024-06-02 13:45:22',
    severity: 'medium',
    user: 'system'
  },
  {
    id: 3,
    type: 'Auth Error',
    message: 'Invalid session token',
    timestamp: '2024-06-02 12:15:08',
    severity: 'low',
    user: 'mike@example.com'
  }
];

const adminActivity = [
  {
    id: 1,
    admin: 'John Admin',
    action: 'Updated game settings',
    target: 'Letter Tracing',
    timestamp: '2024-06-02 15:20:30'
  },
  {
    id: 2,
    admin: 'Sarah Manager',
    action: 'Exported user data',
    target: 'All Users',
    timestamp: '2024-06-02 14:45:15'
  },
  {
    id: 3,
    admin: 'Mike Support',
    action: 'Disabled user account',
    target: 'flagged@example.com',
    timestamp: '2024-06-02 13:30:22'
  }
];

export function AnalyticsLogs() {
  const [activeTab, setActiveTab] = useState('analytics');

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Logs</h1>
        <p className="text-gray-600 mt-2">Monitor platform performance and system activity</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'analytics'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Analytics</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('errors')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'errors'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Error Logs</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'activity'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Admin Activity</span>
          </div>
        </button>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Engagement Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Engagement</CardTitle>
                <CardDescription>Game sessions and average play time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sessions" stroke="#3B82F6" strokeWidth={2} name="Sessions" />
                    <Line type="monotone" dataKey="avgTime" stroke="#10B981" strokeWidth={2} name="Avg Time (min)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Game Performance</CardTitle>
                <CardDescription>Sessions and completion rates by game</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gameAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="game" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8B5CF6" name="Sessions" />
                    <Bar dataKey="completion" fill="#F59E0B" name="Completion %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Game Analytics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Game Analytics</CardTitle>
              <CardDescription>Performance metrics for all games</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game</TableHead>
                    <TableHead>Total Sessions</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Avg Play Time</TableHead>
                    <TableHead>User Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gameAnalytics.map((game, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{game.game}</TableCell>
                      <TableCell>{game.sessions.toLocaleString()}</TableCell>
                      <TableCell>{game.completion}%</TableCell>
                      <TableCell>{Math.floor(Math.random() * 10) + 15} min</TableCell>
                      <TableCell>{(4.2 + Math.random() * 0.8).toFixed(1)}/5</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'errors' && (
        <Card>
          <CardHeader>
            <CardTitle>Error Logs</CardTitle>
            <CardDescription>System errors and failed API requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLogs.map((error) => (
                  <TableRow key={error.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="font-medium">{error.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{error.message}</TableCell>
                    <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                    <TableCell>{error.user}</TableCell>
                    <TableCell>{error.timestamp}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Activity History</CardTitle>
            <CardDescription>Track administrative actions and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{activity.admin}</span>
                      </div>
                    </TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{activity.target}</TableCell>
                    <TableCell>{activity.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Success</span>
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
