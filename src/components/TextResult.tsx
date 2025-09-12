'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { copyToClipboard, downloadTextFile, formatProcessingTime } from '@/lib/imageUtils';
import type { TextResultProps } from '@/types/extraction';

export default function TextResult({ 
  result, 
  isProcessing, 
  onCopy, 
  onDownload 
}: TextResultProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    if (!result?.text) return;
    
    const success = await copyToClipboard(result.text);
    setCopySuccess(success);
    
    if (success) {
      onCopy();
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result?.text || !result?.fileName) return;
    
    downloadTextFile(result.text, result.fileName);
    onDownload();
  };

  if (isProcessing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Extracting Text...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full h-32 bg-muted/50 rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                AI is analyzing your image and extracting text...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No text extracted yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload an image to extract text content
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Extracted Text</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {formatProcessingTime(result.processingTime)}
            </Badge>
            <Badge variant="outline">
              {result.text.length} characters
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Source: {result.fileName}</span>
            <span>{new Date(result.timestamp).toLocaleString()}</span>
          </div>
          <Separator />
        </div>

        <div className="space-y-2">
          <label htmlFor="extracted-text" className="text-sm font-medium">
            Extracted Content
          </label>
          <Textarea
            id="extracted-text"
            value={result.text}
            readOnly
            className="min-h-[200px] resize-none"
            placeholder="No text detected in the image"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleCopy}
            variant={copySuccess ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {copySuccess ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy Text
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download TXT
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}