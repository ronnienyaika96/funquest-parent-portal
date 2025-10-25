
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LearningWidgets from './LearningWidgets';
import GamifiedElements from './GamifiedElements';
import { Play, BookOpen } from 'lucide-react';

interface DashboardContentProps {
  onStartGaming: () => void;
}

const DashboardContent = ({ onStartGaming }: DashboardContentProps) => {
  return (
    <div className="space-y-8 px-6 py-6">
      {/* Hero CTA Section */}
      <Card className="bg-funquest-purple text-white rounded-3xl shadow-xl overflow-hidden">
        <CardContent className="relative p-8">
          <div className="absolute right-8 top-8 text-8xl opacity-20">🚀</div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-playful font-bold mb-4">
              Ready for your next adventure?
            </h2>
            <p className="text-xl font-clean mb-6 text-white/90">
              Discover amazing lessons, play fun games, and earn exciting rewards!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={onStartGaming}
                size="lg"
                className="bg-white text-funquest-purple hover:bg-white/90 font-playful font-bold text-lg px-8 py-4 rounded-2xl shadow-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Learning Games
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-funquest-purple font-playful font-bold text-lg px-8 py-4 rounded-2xl"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Browse All Courses
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Widgets */}
      <LearningWidgets />

      {/* Gamified Elements */}
      <GamifiedElements />
    </div>
  );
};

export default DashboardContent;
