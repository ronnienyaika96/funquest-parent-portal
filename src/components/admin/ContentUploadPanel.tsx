import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Upload, FileText, Image, Film, Download, Trash2, X, Plus } from 'lucide-react';

interface UploadedFile {
  file: File;
  preview?: string;
  metadata: {
    name: string;
    category: string;
    ageRange: string;
    tags: string[];
  };
}

export function ContentUploadPanel() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [contentMetadata, setContentMetadata] = useState({
    name: '',
    category: '',
    ageRange: '',
    tags: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAdminAuth();

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
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'application/json', 'application/pdf'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    validFiles.forEach(file => {
      const newFile: UploadedFile = {
        file,
        metadata: {
          name: contentMetadata.name || file.name,
          category: contentMetadata.category || '',
          ageRange: contentMetadata.ageRange || '',
          tags: contentMetadata.tags ? contentMetadata.tags.split(',').map(tag => tag.trim()) : []
        }
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newFile.preview = e.target?.result as string;
          setUploadedFiles(prev => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedFiles(prev => [...prev, newFile]);
      }
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Some files were rejected",
        description: "Only SVG, PNG, JPEG, JSON, and PDF files under 10MB are allowed.",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateFileMetadata = (index: number, field: keyof UploadedFile['metadata'], value: string | string[]) => {
    setUploadedFiles(prev => prev.map((file, i) => 
      i === index 
        ? { 
            ...file, 
            metadata: { 
              ...file.metadata, 
              [field]: field === 'tags' ? (typeof value === 'string' ? value.split(',').map(tag => tag.trim()) : value) : value 
            } 
          }
        : file
    ));
  };

  const uploadFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files to upload",
        description: "Please select files before uploading.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload files.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadData = uploadedFiles.map(uploadedFile => {
        const { file, metadata } = uploadedFile;
        const fileName = `${Date.now()}-${file.name}`;
        
        return {
          name: metadata.name,
          file_path: `/uploads/${fileName}`,
          file_type: file.type,
          file_size: file.size,
          category: metadata.category,
          age_range: metadata.ageRange,
          tags: metadata.tags,
          uploaded_by: user.id,
        };
      });

      const { error } = await supabase
        .from('content_uploads')
        .insert(uploadData);

      if (error) {
        throw error;
      }

      toast({
        title: "Upload successful",
        description: `${uploadedFiles.length} file(s) uploaded successfully.`,
      });

      setUploadedFiles([]);
      setContentMetadata({ name: '', category: '', ageRange: '', tags: '' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-600" />;
    } else if (type === 'application/json') {
      return <Film className="w-5 h-5 text-purple-600" />;
    } else if (type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const getTypeBadge = (type: string) => {
    let label = type.split('/')[1].toUpperCase();
    if (type === 'application/json') label = 'LOTTIE';
    
    const colors: Record<string, string> = {
      'SVG+XML': 'bg-blue-100 text-blue-800',
      'PNG': 'bg-green-100 text-green-800',
      'JPEG': 'bg-green-100 text-green-800',
      'LOTTIE': 'bg-purple-100 text-purple-800',
      'PDF': 'bg-red-100 text-red-800'
    };
    
    return <Badge className={colors[label] || 'bg-gray-100 text-gray-800'}>{label}</Badge>;
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
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Drop files here or click to upload</h3>
                <p className="text-sm text-gray-500">
                  Supports SVG, PNG, JPEG, JSON (Lottie), PDF files up to 10MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".svg,.png,.jpg,.jpeg,.json,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default Metadata</CardTitle>
            <CardDescription>Set default values for uploaded content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Name</label>
                <Input 
                  placeholder="Enter content name" 
                  value={contentMetadata.name}
                  onChange={(e) => setContentMetadata(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Input 
                  placeholder="e.g., Letters, Math, Coloring" 
                  value={contentMetadata.category}
                  onChange={(e) => setContentMetadata(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <Input 
                  placeholder="e.g., 3-6" 
                  value={contentMetadata.ageRange}
                  onChange={(e) => setContentMetadata(prev => ({ ...prev, ageRange: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <Input 
                  placeholder="Add tags separated by commas" 
                  value={contentMetadata.tags}
                  onChange={(e) => setContentMetadata(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Queue */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Queue ({uploadedFiles.length} files)</CardTitle>
            <CardDescription>Review and edit metadata before uploading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(uploadedFile.file.type)}
                      <div>
                        <h4 className="font-medium">{uploadedFile.file.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {getTypeBadge(uploadedFile.file.type)}
                          <span className="text-sm text-gray-500">
                            {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Content name"
                      value={uploadedFile.metadata.name}
                      onChange={(e) => updateFileMetadata(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Category"
                      value={uploadedFile.metadata.category}
                      onChange={(e) => updateFileMetadata(index, 'category', e.target.value)}
                    />
                    <Input
                      placeholder="Age range"
                      value={uploadedFile.metadata.ageRange}
                      onChange={(e) => updateFileMetadata(index, 'ageRange', e.target.value)}
                    />
                    <Input
                      placeholder="Tags (comma separated)"
                      value={uploadedFile.metadata.tags.join(', ')}
                      onChange={(e) => updateFileMetadata(index, 'tags', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end pt-4">
                <Button onClick={uploadFiles} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : `Upload ${uploadedFiles.length} File(s)`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
