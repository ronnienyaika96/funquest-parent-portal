
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Image, Film, Download, Trash2 } from 'lucide-react';

const uploadedContent = [
  {
    id: 1,
    name: 'alphabet-letters.svg',
    type: 'SVG',
    size: '245 KB',
    category: 'Letters',
    ageRange: '3-6',
    uploaded: '2024-06-01'
  },
  {
    id: 2,
    name: 'math-animations.json',
    type: 'Lottie',
    size: '1.2 MB',
    category: 'Math',
    ageRange: '4-7',
    uploaded: '2024-05-28'
  },
  {
    id: 3,
    name: 'coloring-book.pdf',
    type: 'PDF',
    size: '5.8 MB',
    category: 'Printables',
    ageRange: '2-8',
    uploaded: '2024-05-25'
  }
];

export function ContentUploadPanel() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'SVG':
      case 'PNG':
        return <Image className="w-5 h-5 text-blue-600" />;
      case 'Lottie':
        return <Film className="w-5 h-5 text-purple-600" />;
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      SVG: 'bg-blue-100 text-blue-800',
      PNG: 'bg-green-100 text-green-800',
      Lottie: 'bg-purple-100 text-purple-800',
      PDF: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Upload Panel</h1>
        <p className="text-gray-600 mt-2">Manage learning content, assets, and printables</p>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Content</CardTitle>
            <CardDescription>Upload SVGs, images, Lottie animations, or PDFs</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Drop files here or click to upload</h3>
                <p className="text-sm text-gray-500">
                  Supports SVG, PNG, JSON (Lottie), PDF files up to 10MB
                </p>
              </div>
              <Button className="mt-4">Choose Files</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Metadata</CardTitle>
            <CardDescription>Add details for uploaded content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Name</label>
                <Input placeholder="Enter content name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Input placeholder="e.g., Letters, Math, Coloring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <Input placeholder="e.g., 3-6" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <Input placeholder="Add tags separated by commas" />
              </div>
              <Button className="w-full">Save Content</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Library */}
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
          <CardDescription>Manage uploaded learning content and assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadedContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getFileIcon(content.type)}
                  <div>
                    <h4 className="font-medium">{content.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTypeBadge(content.type)}
                      <span className="text-sm text-gray-500">{content.size}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{content.category}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">Ages {content.ageRange}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations</CardTitle>
          <CardDescription>Perform batch operations on content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Bulk Tag</Button>
            <Button variant="outline">Bulk Category</Button>
            <Button variant="outline">Bulk Age Range</Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              Bulk Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
