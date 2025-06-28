
import React from 'react';
import QuickStats from '../QuickStats';
import LearningProgress from '../LearningProgress';
import GamesCTA from './GamesCTA';
import QuickActions from './QuickActions';
import AchievementHighlights from './AchievementHighlights';

interface DashboardContentProps {
  onStartGaming: () => void;
}

const DashboardContent = ({ onStartGaming }: DashboardContentProps) => {
  return (
    <div className="space-y-8">
      <QuickStats />
      
      {/* Redesigned Dashboard Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GamesCTA onStartGaming={onStartGaming} />
        <QuickActions onStartGaming={onStartGaming} />
      </div>

      {/* Achievement Highlights */}
      <AchievementHighlights />
      
      {/* Learning Progress */}
      <div className="max-w-4xl mx-auto">
        <LearningProgress preview={true} />
      </div>
    </div>
  );
};

export default DashboardContent;
