import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, BookOpen, Trophy, Target, ChevronRight } from 'lucide-react';

const LearningWidgets = () => {
  const continueWatching = [
    {
      id: 1,
      title: "Learning the Alphabet",
      progress: 75,
      thumbnail: "/placeholder.svg",
      nextLesson: "Letter P & Q"
    },
    {
      id: 2,
      title: "Counting to 100",
      progress: 45,
      thumbnail: "/placeholder.svg",
      nextLesson: "Numbers 51-60"
    }
  ];

  const recommendations = [
    {
      id: 1,
      title: "Colors & Shapes",
      category: "Art & Creativity",
      thumbnail: "/placeholder.svg",
      isNew: true
    },
    {
      id: 2,
      title: "Basic Addition",
      category: "Mathematics",
      thumbnail: "/placeholder.svg",
      isNew: false
    },
    {
      id: 3,
      title: "Animal Sounds",
      category: "Science",
      thumbnail: "/placeholder.svg",
      isNew: true
    }
  ];

  const todaysGoals = [
    { task: "Complete 2 video lessons", completed: 1, total: 2 },
    { task: "Practice letter tracing", completed: 1, total: 1 },
    { task: "Take a fun quiz", completed: 0, total: 1 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Continue Watching */}
      <Card className="bg-gradient-to-br from-white to-funquest-blue/5 border-funquest-blue/20 rounded-3xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 font-playful text-funquest-blue">
            <Play className="h-5 w-5" />
            <span>Continue Watching</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {continueWatching.map((video) => (
            <div key={video.id} className="flex items-center space-x-3 p-3 rounded-2xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer group">
              <div className="w-16 h-12 bg-funquest-blue/20 rounded-xl flex items-center justify-center">
                <Play className="h-4 w-4 text-funquest-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-playful font-semibold text-sm text-foreground truncate">{video.title}</p>
                <p className="text-xs text-muted-foreground font-clean">Next: {video.nextLesson}</p>
                <Progress value={video.progress} className="h-1.5 mt-1 bg-funquest-blue/10" />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-funquest-blue transition-colors" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommended for You */}
      <Card className="bg-gradient-to-br from-white to-funquest-purple/5 border-funquest-purple/20 rounded-3xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 font-playful text-funquest-purple">
            <BookOpen className="h-5 w-5" />
            <span>Recommended for You</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((course) => (
            <div key={course.id} className="flex items-center space-x-3 p-3 rounded-2xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-funquest-purple/20 rounded-xl flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-funquest-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-playful font-semibold text-sm text-foreground truncate">{course.title}</p>
                  {course.isNew && (
                    <span className="bg-funquest-warning text-white text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-clean">{course.category}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-funquest-purple transition-colors" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Today's Goals */}
      <Card className="bg-gradient-to-br from-white to-funquest-green/5 border-funquest-green/20 rounded-3xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 font-playful text-funquest-green">
            <Target className="h-5 w-5" />
            <span>Today's Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaysGoals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-playful font-medium text-foreground">{goal.task}</p>
                <span className="text-xs font-clean text-muted-foreground">
                  {goal.completed}/{goal.total}
                </span>
              </div>
              <Progress 
                value={(goal.completed / goal.total) * 100} 
                className="h-2 bg-funquest-green/10"
              />
            </div>
          ))}
          <Button 
            className="w-full mt-4 bg-gradient-to-r from-funquest-green to-funquest-accent hover:shadow-lg transition-all duration-200 rounded-2xl font-playful"
            size="sm"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Start Learning
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningWidgets;