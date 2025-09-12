'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { validateImageFile } from '@/lib/imageUtils';
import type { ImageUploadProps } from '@/types/extraction';

export default function ImageUploader({ 
  onFileUpload, 
  isProcessing,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSizeInMB = 10
}: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      const file = files[0];
      handleFileSelection(file);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    simulateProgress();
    onFileUpload(file);
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : error
              ? 'border-destructive bg-destructive/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInputChange}
            disabled={isProcessing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="file-upload"
          />
          
          <div className="space-y-4">
            {isProcessing ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Processing image...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Upload an image</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPEG, PNG, WebP, GIF up to {maxSizeInMB}MB
                  </p>
                </div>
                <Button variant="outline" className="mt-4">
                  Choose File
                </Button>
              </>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}