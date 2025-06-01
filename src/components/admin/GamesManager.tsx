
import React from 'react';
import { Play, Pause, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GamesManager = () => {
  const games = [
    {
      id: 1,
      name: 'Letter Tracing',
      status: 'Live',
      ageRange: '3-6',
      sessions: 2847,
      lastUpdated: '2024-05-20'
    },
    {
      id: 2,
      name: 'Coloring Pages',
      status: 'Live',
      ageRange: '3-8',
      sessions: 1923,
      lastUpdated: '2024-05-18'
    },
    {
      id: 3,
      name: 'Puzzle Games',
      status: 'Testing',
      ageRange: '4-7',
      sessions: 456,
      lastUpdated: '2024-05-22'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Games Manager</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload New Game
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{game.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                game.status === 'Live' ? 'bg-green-100 text-green-800' :
                game.status === 'Testing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {game.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-slate-600">Age Range: {game.ageRange}</p>
              <p className="text-sm text-slate-600">Sessions: {game.sessions}</p>
              <p className="text-sm text-slate-600">Updated: {game.lastUpdated}</p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="w-4 h-4 mr-1" />
                Configure
              </Button>
              <Button variant="outline" size="sm">
                {game.status === 'Live' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesManager;
