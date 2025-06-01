
import React, { useState } from 'react';
import { Download } from 'lucide-react';

const PrintablesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All', icon: '📄' },
    { id: 'alphabet', name: 'Alphabet', icon: '🔤' },
    { id: 'bible', name: 'Bible', icon: '📖' },
    { id: 'animals', name: 'Animals', icon: '🦁' },
    { id: 'coloring', name: 'Coloring', icon: '🎨' }
  ];

  const printables = [
    {
      id: 1,
      title: 'Alphabet Tracing Worksheets A-Z',
      category: 'alphabet',
      thumbnail: '✏️',
      downloads: 1247,
      premium: false
    },
    {
      id: 2,
      title: 'Noah\'s Ark Coloring Pages',
      category: 'bible',
      thumbnail: '🌈',
      downloads: 856,
      premium: true
    },
    {
      id: 3,
      title: 'Safari Animals Activity Pack',
      category: 'animals',
      thumbnail: '🦁',
      downloads: 623,
      premium: false
    },
    {
      id: 4,
      title: 'Bible Heroes Coloring Book',
      category: 'bible',
      thumbnail: '👑',
      downloads: 934,
      premium: true
    },
    {
      id: 5,
      title: 'Farm Animals Learning Cards',
      category: 'animals',
      thumbnail: '🐄',
      downloads: 445,
      premium: false
    },
    {
      id: 6,
      title: 'Rainbow Patterns Coloring',
      category: 'coloring',
      thumbnail: '🌈',
      downloads: 778,
      premium: false
    }
  ];

  const filteredPrintables = selectedCategory === 'all' 
    ? printables 
    : printables.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          🖨️ Printables Library
        </h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-sky-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Printables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrintables.map((printable) => (
            <div key={printable.id} className="bg-gradient-to-br from-gray-50 to-sky-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-md">
                  {printable.thumbnail}
                </div>
                {printable.premium && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                    Premium
                  </span>
                )}
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2">{printable.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{printable.downloads} downloads</p>
              
              <button className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintablesSection;
