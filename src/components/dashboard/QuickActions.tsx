
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, Trophy } from 'lucide-react';

interface QuickActionsProps {
  onStartGaming: () => void;
}

const QuickActions = ({ onStartGaming }: QuickActionsProps) => {
  return (
    <Card className="bg-white shadow-lg border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start hover:bg-green-50 border-green-200"
            onClick={onStartGaming}
          >
            <Play className="w-4 h-4 mr-3 text-green-600" />
            Play Games
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start hover:bg-blue-50 border-blue-200"
          >
            <BookOpen className="w-4 h-4 mr-3 text-blue-600" />
            Browse Books
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start hover:bg-purple-50 border-purple-200"
          >
            <Trophy className="w-4 h-4 mr-3 text-purple-600" />
            View Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
