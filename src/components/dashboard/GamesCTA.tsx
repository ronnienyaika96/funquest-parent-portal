
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface GamesCTAProps {
  onStartGaming: () => void;
}

const GamesCTA = ({ onStartGaming }: GamesCTAProps) => {
  return (
    <Card className="lg:col-span-2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-xl">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🎮</div>
              <div>
                <h2 className="text-2xl font-bold">Ready for Fun Learning?</h2>
                <p className="text-blue-100">Educational games that make learning an adventure!</p>
              </div>
            </div>
            <Button 
              onClick={onStartGaming}
              className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Playing Now
            </Button>
          </div>
          <div className="text-6xl opacity-30">🚀</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamesCTA;
