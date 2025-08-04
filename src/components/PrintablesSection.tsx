
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Filter, Eye, Star, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePrintables } from '@/hooks/usePrintables';
import { useAuth } from '@/hooks/useAuth';
import { downloadFile } from '@/utils/downloadManager';

const PrintablesSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrintable, setSelectedPrintable] = useState<any>(null);
  
  const { printables, isLoading, getCategories, searchPrintables, getPrintablesByCategory, incrementDownloads } = usePrintables();
  const { user } = useAuth();
  const categories = getCategories();

  const filteredPrintables = searchTerm 
    ? searchPrintables(searchTerm).filter(printable => 
        selectedCategory === 'All' || printable.category === selectedCategory
      )
    : getPrintablesByCategory(selectedCategory);

  const PreviewModal = ({ printable }: { printable: any }) => {
    const [showPreview, setShowPreview] = useState(false);

    const handleDownload = async () => {
      // Increment download count and trigger download
      incrementDownloads.mutate(printable.id);
      await downloadFile(printable.id, `${printable.title}.pdf`, user?.id);
      setShowPreview(false);
    };

    return (
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{printable.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img 
                  src={printable.preview_url || '/placeholder.svg'} 
                  alt={printable.title}
                  className="w-full h-64 object-cover rounded-lg bg-gray-200"
                />
                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Favorite
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{printable.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <Badge variant="outline">{printable.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <Badge>{printable.difficulty}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pages</p>
                    <p className="font-medium">{printable.pages}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Downloads</p>
                    <p className="font-medium">{printable.downloads.toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(printable.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({printable.rating})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Printables Library</h1>
          <Button disabled>
            <Calendar className="w-4 h-4 mr-2" />
            My Downloads
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Find Printables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Printables Library</h1>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          My Downloads
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Printables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search printables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-blue-600 text-white" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Section */}
      {selectedCategory === 'All' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Featured Printables</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {printables.filter(p => p.featured).map(printable => (
              <Card key={printable.id} className="border-yellow-200 bg-yellow-50">
                <div className="relative">
                  <img 
                  src={printable.preview_url || '/placeholder.svg'} 
                  alt={printable.title}
                  className="w-full h-48 object-cover rounded-t-lg bg-gray-200"
                  />
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">Featured</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{printable.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{printable.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">{printable.category}</Badge>
                      <span className="text-xs text-gray-500">{printable.pages} pages</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{printable.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <PreviewModal printable={printable} />
                    <Button size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Printables Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {selectedCategory === 'All' ? 'All Printables' : selectedCategory}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrintables.map(printable => (
            <Card key={printable.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={printable.preview_url || '/placeholder.svg'} 
                  alt={printable.title}
                  className="w-full h-48 object-cover rounded-t-lg bg-gray-200"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {printable.featured && (
                    <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{printable.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{printable.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">{printable.category}</Badge>
                    <span className="text-xs text-gray-500">{printable.pages} pages</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{printable.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">{printable.downloads.toLocaleString()} downloads</span>
                  <Badge className="text-xs">{printable.difficulty}</Badge>
                </div>
                
                <div className="flex gap-2">
                  <PreviewModal printable={printable} />
                  <Button size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredPrintables.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No printables found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrintablesSection;
