
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Upload, Eye, Settings, Play, Pause } from 'lucide-react';

const games = [
  {
    id: 1,
    name: 'Letter Tracing',
    category: 'Literacy',
    ageRange: '3-6',
    status: 'live',
    sessions: 3200,
    rating: 4.8,
    lastUpdated: '2024-05-15'
  },
  {
    id: 2,
    name: 'Math Puzzles',
    category: 'Math',
    ageRange: '5-8',
    status: 'live',
    sessions: 2400,
    rating: 4.6,
    lastUpdated: '2024-05-10'
  },
  {
    id: 3,
    name: 'Coloring Adventure',
    category: 'Creativity',
    ageRange: '2-7',
    status: 'draft',
    sessions: 0,
    rating: 0,
    lastUpdated: '2024-06-01'
  }
];

export function GamesManager() {
  const [selectedGame, setSelectedGame] = useState(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800">Live</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'maintenance':
        return <Badge className="bg-red-100 text-red-800">Maintenance</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Games & Activities Manager</h1>
          <p className="text-gray-600 mt-2">Manage educational games and learning content</p>
        </div>
        <div className="flex space-x-3">
          <Button className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload Content</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Game</span>
          </Button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{game.name}</CardTitle>
                  <CardDescription>{game.category} • Ages {game.ageRange}</CardDescription>
                </div>
                {getStatusBadge(game.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sessions:</span>
                  <span className="font-medium">{game.sessions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium">{game.rating > 0 ? `${game.rating}/5` : 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{game.lastUpdated}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Active:</span>
                    <Switch checked={game.status === 'live'} />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Game Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Game Content</CardTitle>
          <CardDescription>Add new games or update existing game assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Game Name</label>
                <Input placeholder="Enter game name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Input placeholder="e.g., Literacy, Math, Creativity" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <Input placeholder="e.g., 3-6" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Game Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Button variant="outline">Choose Files</Button>
                    <p className="mt-2 text-sm text-gray-500">Upload Unity builds, assets, or game data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button>Upload Game</Button>
          </div>
        </CardContent>
      </Card>

      {/* Age Level Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Age Level Configuration</CardTitle>
          <CardDescription>Configure which games are available for different age groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['2-4 years', '4-6 years', '6-8 years'].map((ageGroup) => (
              <div key={ageGroup} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{ageGroup}</h4>
                <div className="space-y-2">
                  {games.filter(game => game.status === 'live').map((game) => (
                    <div key={game.id} className="flex items-center justify-between">
                      <span className="text-sm">{game.name}</span>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
