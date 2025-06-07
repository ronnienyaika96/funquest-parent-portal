import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Gamepad2, CreditCard, Upload, Mail, BarChart3, Settings, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  activeChildren: number;
  gamesPlayed: number;
  revenue: string;
}

export function AdminOverview() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeChildren: 0,
    gamesPlayed: 0,
    revenue: '$0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch real stats from database
      const [
        { count: userCount },
        { data: games }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('games').select('analytics_data')
      ]);

      // Safely parse analytics data
      const totalSessions = games?.reduce((sum, game) => {
        if (game.analytics_data && typeof game.analytics_data === 'object' && game.analytics_data !== null) {
          const analyticsData = game.analytics_data as { sessions?: number };
          return sum + (analyticsData.sessions || 0);
        }
        return sum;
      }, 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        activeChildren: Math.floor((userCount || 0) * 1.8), // Mock calculation
        gamesPlayed: totalSessions,
        revenue: `$${(totalSessions * 0.27).toFixed(0)}` // Mock revenue calculation
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: "Action triggered",
      description: `${action} functionality activated`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/auth');
  };

  const statsData = [
    { title: 'Total Users', value: loading ? '...' : stats.totalUsers.toString(), change: '+12%', icon: Users, color: 'text-blue-600' },
    { title: 'Active Children', value: loading ? '...' : stats.activeChildren.toString(), change: '+8%', icon: BookOpen, color: 'text-green-600' },
    { title: 'Games Played', value: loading ? '...' : stats.gamesPlayed.toString(), change: '+15%', icon: Gamepad2, color: 'text-purple-600' },
    { title: 'Revenue', value: loading ? '...' : stats.revenue, change: '+20%', icon: CreditCard, color: 'text-orange-600' },
  ];

  const quickActions = [
    { title: 'Add New User', icon: Plus, action: () => navigate('/admin/users') },
    { title: 'Upload Content', icon: Upload, action: () => navigate('/admin/content') },
    { title: 'Send Newsletter', icon: Mail, action: () => navigate('/admin/newsletter') },
    { title: 'View Analytics', icon: BarChart3, action: () => navigate('/admin/analytics') },
  ];

  const recentActivities = [
    { action: 'New user registered', user: 'John Doe', time: '5 min ago' },
    { action: 'Game completed', user: 'Emma Smith', time: '15 min ago' },
    { action: 'Book purchased', user: 'Mike Johnson', time: '1 hour ago' },
    { action: 'Subscription renewed', user: 'Sarah Wilson', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your FunQuest platform</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => navigate('/admin/settings')} className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col items-center space-y-2 hover:bg-blue-50"
                  onClick={action.action}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm">{action.title}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities & Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <Button size="sm" variant="ghost" onClick={() => handleQuickAction('View details')}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Manage games, books, and educational content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/games')}
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Manage Games
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/books')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Books
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/content')}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Content
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleQuickAction('Moderate content')}
              >
                <Edit className="w-4 h-4 mr-2" />
                Moderate Content
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
