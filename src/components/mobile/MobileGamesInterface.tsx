
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Clock, Users, Filter } from 'lucide-react';

const MobileGamesInterface = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All Ages');

  const categories = [
    { name: 'All', emoji: '🎮', color: 'bg-gray-100' },
    { name: 'Letters', emoji: '🔤', color: 'bg-blue-100' },
    { name: 'Numbers', emoji: '🔢', color: 'bg-green-100' },
    { name: 'Colors', emoji: '🎨', color: 'bg-purple-100' },
    { name: 'Shapes', emoji: '🔷', color: 'bg-orange-100' }
  ];

  const games = [
    {
      id: 1,
      title: 'Letter Tracing Adventure',
      description: 'Learn to write letters A-Z with fun animations',
      emoji: '✏️',
      difficulty: 'Easy',
      duration: '10-15 min',
      players: '1 Player',
      rating: 4.8,
      category: 'Letters',
      ageGroup: '3-5 years',
      gradient: 'from-blue-400 to-blue-500',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      id: 2,
      title: 'Rainbow Coloring Fun',
      description: 'Color beautiful pictures and learn about colors',
      emoji: '🌈',
      difficulty: 'Easy',
      duration: '15-20 min',
      players: '1 Player',
      rating: 4.9,
      category: 'Colors',
      ageGroup: '2-4 years',
      gradient: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-100'
    },
    {
      id: 3,
      title: 'Number Counting Safari',
      description: 'Count animals and learn numbers 1-20',
      emoji: '🦁',
      difficulty: 'Medium',
      duration: '20-25 min',
      players: '1 Player',
      rating: 4.7,
      category: 'Numbers',
      ageGroup: '4-6 years',
      gradient: 'from-green-400 to-green-500',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      id: 4,
      title: 'Shape Detective',
      description: 'Find and match shapes in this puzzle adventure',
      emoji: '🔍',
      difficulty: 'Medium',
      duration: '15-20 min',
      players: '1 Player',
      rating: 4.6,
      category: 'Shapes',
      ageGroup: '5-7 years',
      gradient: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-100'
    },
    {
      id: 5,
      title: 'Phonics Music Box',
      description: 'Learn letter sounds with catchy songs',
      emoji: '🎵',
      difficulty: 'Easy',
      duration: '10-15 min',
      players: '1 Player',
      rating: 4.8,
      category: 'Letters',
      ageGroup: '3-5 years',
      gradient: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-100'
    },
    {
      id: 6,
      title: 'Pattern Puzzle Palace',
      description: 'Complete patterns and sequences',
      emoji: '🧩',
      difficulty: 'Hard',
      duration: '25-30 min',
      players: '1 Player',
      rating: 4.5,
      category: 'Shapes',
      ageGroup: '6-8 years',
      gradient: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-100'
    }
  ];

  const filteredGames = games.filter(game => {
    const categoryMatch = selectedCategory === 'All' || game.category === selectedCategory;
    const ageMatch = selectedAge === 'All Ages' || game.ageGroup.includes(selectedAge.split('-')[0]);
    return categoryMatch && ageMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎮 Fun Games</h1>
        <p className="text-gray-600">Choose your learning adventure!</p>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.name)}
            className={`flex-shrink-0 rounded-2xl px-4 py-2 ${
              selectedCategory === category.name 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : category.color + ' border-0 text-gray-700'
            }`}
          >
            <span className="mr-2">{category.emoji}</span>
            {category.name}
          </Button>
        ))}
      </div>

      {/* Age Filter */}
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-gray-500" />
        <select 
          value={selectedAge}
          onChange={(e) => setSelectedAge(e.target.value)}
          className="flex-1 p-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="All Ages">All Ages</option>
          <option value="2-4">Ages 2-4</option>
          <option value="3-5">Ages 3-5</option>
          <option value="4-6">Ages 4-6</option>
          <option value="5-7">Ages 5-7</option>
          <option value="6-8">Ages 6-8</option>
        </select>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredGames.map((game) => (
          <Card key={game.id} className={`overflow-hidden border-0 shadow-medium bg-gradient-to-br ${game.bgColor}`}>
            <CardContent className="p-0">
              <div className="flex">
                {/* Game Icon */}
                <div className={`w-24 h-24 bg-gradient-to-br ${game.gradient} flex items-center justify-center`}>
                  <span className="text-4xl">{game.emoji}</span>
                </div>
                
                {/* Game Info */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{game.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{game.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={`text-xs ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{game.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{game.players}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold py-2">
                    <Play className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No games found</h3>
          <p className="text-gray-600">Try adjusting your filters to find more games!</p>
        </div>
      )}
    </div>
  );
};

export default MobileGamesInterface;
