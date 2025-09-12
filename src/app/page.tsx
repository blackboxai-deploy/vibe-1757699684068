'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ImageUploader from '@/components/ImageUploader';
import TextResult from '@/components/TextResult';
import ExtractionHistory from '@/components/ExtractionHistory';
import { convertFileToBase64, generateId } from '@/lib/imageUtils';
import type { ExtractionResult, ApiResponse } from '@/types/extraction';

const STORAGE_KEY = 'image-text-extraction-history';
const MAX_HISTORY_ITEMS = 10;

export default function HomePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<ExtractionResult | null>(null);
  const [history, setHistory] = useState<ExtractionResult[]>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }, [history]);

  const handleFileUpload = async (file: File) => {
    if (isProcessing) return;

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      // Convert file to base64
      const base64Image = await convertFileToBase64(file);
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);

      // Make API request
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          fileName: file.name
        })
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.text) {
        const result: ExtractionResult = {
          id: generateId(),
          text: data.text,
          fileName: file.name,
          timestamp: new Date(),
          imageUrl,
          processingTime: data.processingTime || (Date.now() - startTime)
        };

        setCurrentResult(result);
        
        // Add to history (keep only the most recent items)
        setHistory(prev => [result, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);
        
        toast.success('Text extracted successfully!', {
          description: `Processed in ${(result.processingTime / 1000).toFixed(1)}s`
        });
      } else {
        throw new Error(data.error || 'Failed to extract text');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast.error('Text extraction failed', {
        description: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    toast.success('Text copied to clipboard!');
  };

  const handleDownloadText = () => {
    toast.success('Text file downloaded!');
  };

  const handleSelectHistoryResult = (result: ExtractionResult) => {
    setCurrentResult(result);
    toast.info('Viewing previous extraction');
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentResult(null);
    toast.success('History cleared');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Extract Text from Images
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload any image and our AI-powered OCR technology will extract all visible text content 
            with high accuracy. Supports multiple formats and provides instant results.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload and Result */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Uploader */}
            <ImageUploader
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />

            {/* Text Result */}
            <TextResult
              result={currentResult}
              isProcessing={isProcessing}
              onCopy={handleCopyText}
              onDownload={handleDownloadText}
            />
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <ExtractionHistory
              history={history}
              onSelectResult={handleSelectHistoryResult}
              onClearHistory={handleClearHistory}
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Fast Processing</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI models extract text in seconds
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">High Accuracy</h3>
            <p className="text-sm text-muted-foreground">
              Precise text recognition with minimal errors
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Multiple Formats</h3>
            <p className="text-sm text-muted-foreground">
              Support for JPEG, PNG, WebP, and GIF images
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}