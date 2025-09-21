
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import VideoCard from './VideoCard';
import LearningWidgets from './LearningWidgets';
import GamifiedElements from './GamifiedElements';
import { Play, BookOpen, Sparkles } from 'lucide-react';

interface DashboardContentProps {
  onStartGaming: () => void;
}

const DashboardContent = ({ onStartGaming }: DashboardContentProps) => {
  // Sample video data - replace with real data
  const featuredVideos = [
    {
      id: 1,
      title: "Learning Letters A-E",
      thumbnail: "/placeholder.svg",
      duration: "8:30",
      progress: 75,
      difficulty: 'beginner' as const,
      stars: 3,
      category: "Alphabet"
    },
    {
      id: 2,
      title: "Counting Adventures 1-20",
      thumbnail: "/placeholder.svg",
      duration: "12:15",
      progress: 45,
      difficulty: 'beginner' as const,
      stars: 2,
      category: "Numbers"
    },
    {
      id: 3,
      title: "Colors & Shapes Fun",
      thumbnail: "/placeholder.svg",
      duration: "6:45",
      progress: 0,
      difficulty: 'beginner' as const,
      stars: 0,
      category: "Art"
    },
    {
      id: 4,
      title: "Animal Sounds Safari",
      thumbnail: "/placeholder.svg",
      duration: "10:20",
      progress: 100,
      difficulty: 'intermediate' as const,
      stars: 5,
      category: "Science"
    },
    {
      id: 5,
      title: "Simple Addition Magic",
      thumbnail: "/placeholder.svg",
      duration: "15:30",
      progress: 0,
      difficulty: 'intermediate' as const,
      isLocked: true,
      stars: 0,
      category: "Math"
    },
    {
      id: 6,
      title: "Reading First Words",
      thumbnail: "/placeholder.svg",
      duration: "9:45",
      progress: 30,
      difficulty: 'advanced' as const,
      stars: 1,
      category: "Reading"
    }
  ];

  const newUploads = featuredVideos.slice(-3);

  return (
    <div className="space-y-8 px-6 py-6">
      {/* Hero CTA Section */}
      <Card className="bg-gradient-to-br from-funquest-purple via-funquest-pink to-funquest-blue text-white rounded-3xl shadow-2xl overflow-hidden">
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

      {/* Featured Video Lessons */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-playful font-bold text-foreground flex items-center space-x-3">
            <Sparkles className="h-8 w-8 text-funquest-purple" />
            <span>Featured Lessons</span>
          </h2>
          <Button 
            variant="outline" 
            className="font-playful border-funquest-purple text-funquest-purple hover:bg-funquest-purple hover:text-white rounded-2xl"
          >
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVideos.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              duration={video.duration}
              progress={video.progress}
              difficulty={video.difficulty}
              isLocked={video.isLocked}
              stars={video.stars}
              category={video.category}
              onClick={() => console.log(`Playing video: ${video.title}`)}
            />
          ))}
        </div>
      </div>

      {/* New Uploads */}
      <div className="space-y-6">
        <h2 className="text-3xl font-playful font-bold text-foreground flex items-center space-x-3">
          <span className="text-3xl">✨</span>
          <span>New Uploads</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newUploads.map((video) => (
            <VideoCard
              key={`new-${video.id}`}
              title={video.title}
              thumbnail={video.thumbnail}
              duration={video.duration}
              progress={video.progress}
              difficulty={video.difficulty}
              stars={video.stars}
              category={video.category}
              onClick={() => console.log(`Playing video: ${video.title}`)}
            />
          ))}
        </div>
      </div>

      {/* Gamified Elements */}
      <GamifiedElements />
    </div>
  );
};

export default DashboardContent;
