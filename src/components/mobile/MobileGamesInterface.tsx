
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Clock, Users, Filter, Trophy, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileGamesInterface = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All Ages');
  const navigate = useNavigate();

  const categories = [
    { name: 'All', emoji: '🎮', color: 'bg-rainbow-gradient', activeColor: 'from-purple-500 to-pink-500' },
    { name: 'Letters', emoji: '🔤', color: 'bg-blue-100', activeColor: 'from-blue-500 to-cyan-500' },
    { name: 'Numbers', emoji: '🔢', color: 'bg-green-100', activeColor: 'from-green-500 to-emerald-500' },
    { name: 'Colors', emoji: '🎨', color: 'bg-purple-100', activeColor: 'from-purple-500 to-pink-500' },
    { name: 'Shapes', emoji: '🔷', color: 'bg-orange-100', activeColor: 'from-orange-500 to-red-500' }
  ];

  // Using the same games as desktop version
  const games = [
    {
      id: 1,
      title: 'Letter Tracing A-Z',
      description: 'Learn to write letters with guided tracing',
      emoji: '✏️',
      difficulty: 'Easy',
      duration: '10-15 min',
      players: '1 Player',
      rating: 4.8,
      category: 'Letters',
      ageGroup: '3-5 years',
      gradient: 'from-blue-400 via-purple-500 to-pink-500',
      bgGradient: 'from-blue-50 via-purple-50 to-pink-50',
      featured: true,
      completedLevels: 12,
      totalLevels: 26
    },
    {
      id: 2,
      title: 'Rainbow Coloring',
      description: 'Color beautiful pictures and learn about colors',
      emoji: '🌈',
      difficulty: 'Easy',
      duration: '15-20 min',
      players: '1 Player',
      rating: 4.9,
      category: 'Colors',
      ageGroup: '2-4 years',
      gradient: 'from-purple-400 via-pink-500 to-yellow-500',
      bgGradient: 'from-purple-50 via-pink-50 to-yellow-50',
      featured: true,
      completedLevels: 8,
      totalLevels: 15
    },
    {
      id: 3,
      title: 'Number Matching',
      description: 'Match numbers with quantities in fun games',
      emoji: '🔢',
      difficulty: 'Medium',
      duration: '20-25 min',
      players: '1 Player',
      rating: 4.7,
      category: 'Numbers',
      ageGroup: '4-6 years',
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      id: 4,
      title: 'Shape Recognition',
      description: 'Identify and learn about different shapes',
      emoji: '🔷',
      difficulty: 'Medium',
      duration: '15-20 min',
      players: '1 Player',
      rating: 4.6,
      category: 'Shapes',
      ageGroup: '3-5 years',
      gradient: 'from-orange-400 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ];

  const filteredGames = games.filter(game => {
    const categoryMatch = selectedCategory === 'All' || game.category === selectedCategory;
    const ageMatch = selectedAge === 'All Ages' || game.ageGroup.includes(selectedAge.split('-')[0]);
    return categoryMatch && ageMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const playGame = (gameId: number) => {
    console.log(`Starting game ${gameId}`);
    // Here you would navigate to the actual game interface
  };

  const featuredGames = games.filter(game => game.featured);
  const regularGames = games.filter(game => !game.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="p-4 space-y-6 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Fun Games! 🎮
          </h1>
          <p className="text-gray-600 text-lg">Choose your magical learning adventure!</p>
        </div>

        {/* Featured Games */}
        {featuredGames.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                Featured Adventures
              </h2>
            </div>
            
            {featuredGames.map((game) => (
              <Card key={game.id} className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 transform transition-all duration-300 hover:scale-105 active:scale-95">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-r ${game.gradient} p-4 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10 flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-3xl mr-3">{game.emoji}</span>
                          <Badge className="bg-white/20 text-white border-white/30">
                            Featured
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{game.title}</h3>
                        <p className="text-white/90 text-sm mb-3">{game.description}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        <Star className="w-4 h-4 text-yellow-300 fill-current" />
                        <span className="text-white font-medium">{game.rating}</span>
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-white/80">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{game.duration}</span>
                        </div>
                        <Badge className={`text-xs border ${getDifficultyColor(game.difficulty)}`}>
                          {game.difficulty}
                        </Badge>
                      </div>
                      
                      <Button 
                        onClick={() => playGame(game.id)}
                        className="bg-white text-gray-800 hover:bg-gray-100 rounded-full font-bold px-6 py-2 shadow-lg transform transition-all duration-200 hover:scale-105"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Now
                      </Button>
                    </div>
                    
                    {game.completedLevels && (
                      <div className="relative z-10 mt-3 pt-3 border-t border-white/20">
                        <div className="flex justify-between text-sm text-white/90 mb-1">
                          <span>Progress</span>
                          <span>{game.completedLevels}/{game.totalLevels} levels</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-white rounded-full h-2 transition-all duration-500" 
                            style={{ width: `${(game.completedLevels / game.totalLevels) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Category Filter */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Categories</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex-shrink-0 rounded-2xl px-6 py-3 min-w-0 transition-all duration-300 ${
                  selectedCategory === category.name 
                    ? `bg-gradient-to-r ${category.activeColor} text-white shadow-lg transform scale-105` 
                    : `${category.color} border-0 text-gray-700 hover:scale-105`
                }`}
              >
                <span className="mr-2 text-lg">{category.emoji}</span>
                <span className="font-medium">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Age Filter */}
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <select 
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="flex-1 p-4 rounded-2xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 font-medium"
          >
            <option value="All Ages">All Ages 👶🧒👦👧</option>
            <option value="2-4">Ages 2-4 👶</option>
            <option value="3-5">Ages 3-5 🧒</option>
            <option value="4-6">Ages 4-6 👦</option>
            <option value="5-7">Ages 5-7 👧</option>
          </select>
        </div>

        {/* Games Grid */}
        {regularGames.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">More Adventures</h3>
            <div className="grid grid-cols-1 gap-4">
              {filteredGames.filter(game => !game.featured).map((game) => (
                <Card key={game.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-102 active:scale-98">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className={`w-24 h-24 bg-gradient-to-br ${game.gradient} flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                        <span className="text-3xl relative z-10">{game.emoji}</span>
                      </div>
                      
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-800 mb-1">{game.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-gray-700">{game.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={`text-xs border ${getDifficultyColor(game.difficulty)}`}>
                              {game.difficulty}
                            </Badge>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{game.duration}</span>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => playGame(game.id)}
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold px-4 py-2 shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Play
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No games found</h3>
            <p className="text-gray-600 text-lg mb-6">Try adjusting your filters to discover more adventures!</p>
            <Button 
              onClick={() => {
                setSelectedCategory('All');
                setSelectedAge('All Ages');
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl px-8 py-3 font-bold"
            >
              Show All Games
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileGamesInterface;
