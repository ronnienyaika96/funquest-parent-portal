
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Paperclip } from 'lucide-react';

export function ContactSupportForm() {
  const [ticketType, setTicketType] = useState('general');
  const [priority, setPriority] = useState('medium');

  const ticketTypes = [
    { value: 'general', label: 'General Question' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Subscription' },
    { value: 'content', label: 'Content & Games' },
    { value: 'account', label: 'Account Management' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4" />
          <span>Contact Support</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            We're here to help! Send us a message and we'll get back to you soon.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Ticket Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What can we help you with?
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
            >
              {ticketTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="flex space-x-3">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 p-2 rounded-lg border transition-colors ${
                    priority === p.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Badge className={p.color}>{p.label}</Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <Input placeholder="Brief description of your issue" />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Please describe your issue in detail..."
            />
          </div>

          {/* Child Profile (if relevant) */}
          {(ticketType === 'technical' || ticketType === 'content') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Child Profile (Optional)
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select a child profile</option>
                <option value="emma">Emma (5 years old)</option>
                <option value="lucas">Lucas (7 years old)</option>
                <option value="sophie">Sophie (4 years old)</option>
              </select>
            </div>
          )}

          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachment (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Paperclip className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <Button variant="outline" size="sm">
                Choose File
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Screenshots or files that might help us understand your issue
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button className="flex-1 flex items-center justify-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </Button>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
