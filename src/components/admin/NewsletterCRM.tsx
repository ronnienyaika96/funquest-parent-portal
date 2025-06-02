
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Download, Users, TrendingUp } from 'lucide-react';

export function NewsletterCRM() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Newsletter & CRM</h1>
        <p className="text-gray-600 mt-2">Manage email campaigns and customer relationships</p>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.3%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Export Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Subscriber Lists</CardTitle>
            <CardDescription>Export email lists to external platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Mailchimp Export</h4>
                  <p className="text-sm text-gray-500">Export to Mailchimp format</p>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">ConvertKit Export</h4>
                  <p className="text-sm text-gray-500">Export to ConvertKit format</p>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">CSV Export</h4>
                  <p className="text-sm text-gray-500">Download as CSV file</p>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newsletter Opt-ins</CardTitle>
            <CardDescription>View newsletter subscription sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Parent Dashboard</span>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">1,245</Badge>
                  <span className="text-sm text-gray-500">43.7%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Registration Form</span>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-800">892</Badge>
                  <span className="text-sm text-gray-500">31.3%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Website Footer</span>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-purple-100 text-purple-800">456</Badge>
                  <span className="text-sm text-gray-500">16.0%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Social Media</span>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-orange-100 text-orange-800">254</Badge>
                  <span className="text-sm text-gray-500">8.9%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Campaign Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Test Email Campaign</CardTitle>
          <CardDescription>Send test emails to subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
              <Input placeholder="Enter email subject" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter your message here..."
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
              <Button variant="outline">Save as Draft</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
