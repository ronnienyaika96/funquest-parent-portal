
import React, { useState } from 'react';
import { Download, Search, Filter, Star, Eye, Printer } from 'lucide-react';

interface Printable {
  id: string;
  title: string;
  category: string;
  ageRange: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  downloads: number;
  thumbnail: string;
  description: string;
  tags: string[];
}

const PrintablesSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');

  const printables: Printable[] = [
    {
      id: '1',
      title: 'Alphabet Tracing Worksheets',
      category: 'Writing',
      ageRange: '3-5',
      difficulty: 'Easy',
      rating: 4.8,
      downloads: 1250,
      thumbnail: '📝',
      description: 'Help children learn to write letters with guided tracing exercises',
      tags: ['alphabet', 'tracing', 'handwriting']
    },
    {
      id: '2',
      title: 'Number Recognition Games',
      category: 'Math',
      ageRange: '4-6',
      difficulty: 'Easy',
      rating: 4.6,
      downloads: 980,
      thumbnail: '🔢',
      description: 'Fun activities to help kids identify and count numbers 1-20',
      tags: ['numbers', 'counting', 'recognition']
    },
    {
      id: '3',
      title: 'Animal Coloring Pages',
      category: 'Art',
      ageRange: '3-8',
      difficulty: 'Easy',
      rating: 4.9,
      downloads: 2100,
      thumbnail: '🎨',
      description: 'Beautiful animal illustrations for creative coloring fun',
      tags: ['animals', 'coloring', 'creativity']
    },
    {
      id: '4',
      title: 'Simple Addition Worksheets',
      category: 'Math',
      ageRange: '5-7',
      difficulty: 'Medium',
      rating: 4.5,
      downloads: 750,
      thumbnail: '➕',
      description: 'Practice basic addition with colorful, engaging problems',
      tags: ['addition', 'math', 'practice']
    },
    {
      id: '5',
      title: 'Story Sequencing Cards',
      category: 'Reading',
      ageRange: '4-7',
      difficulty: 'Medium',
      rating: 4.7,
      downloads: 650,
      thumbnail: '📖',
      description: 'Help children understand story order and comprehension',
      tags: ['reading', 'comprehension', 'sequencing']
    },
    {
      id: '6',
      title: 'Pattern Completion Puzzles',
      category: 'Logic',
      ageRange: '5-8',
      difficulty: 'Hard',
      rating: 4.4,
      downloads: 420,
      thumbnail: '🧩',
      description: 'Challenge logical thinking with pattern recognition activities',
      tags: ['patterns', 'logic', 'thinking']
    }
  ];

  const categories = ['all', 'Writing', 'Math', 'Art', 'Reading', 'Logic'];
  const ageRanges = ['all', '3-5', '4-6', '5-7', '5-8', '3-8'];

  const filteredPrintables = printables.filter(printable => {
    const matchesSearch = printable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         printable.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || printable.category === selectedCategory;
    const matchesAge = selectedAge === 'all' || printable.ageRange === selectedAge;
    
    return matchesSearch && matchesCategory && matchesAge;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Printables</h2>
          <p className="text-gray-600 mt-1">Download educational worksheets and activities</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download All</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search printables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select 
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {ageRanges.map(age => (
              <option key={age} value={age}>
                {age === 'all' ? 'All Ages' : `Ages ${age}`}
              </option>
            ))}
          </select>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrintables.map((printable) => (
          <div key={printable.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{printable.thumbnail}</div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">{printable.rating}</span>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-2">{printable.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{printable.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Ages {printable.ageRange}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(printable.difficulty)}`}>
                  {printable.difficulty}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {printable.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{printable.downloads} downloads</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
                  {printable.category}
                </span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrintables.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No printables found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default PrintablesSection;
