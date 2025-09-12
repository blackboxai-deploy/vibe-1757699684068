'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ExtractionHistoryProps } from '@/types/extraction';

export default function ExtractionHistory({ 
  history, 
  onSelectResult, 
  onClearHistory 
}: ExtractionHistoryProps) {
  
  if (history.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Extractions</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            No extraction history yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Extractions</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearHistory}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {history.map((result, index) => (
              <div key={result.id}>
                <div 
                  className="cursor-pointer p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
                  onClick={() => onSelectResult(result)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        {result.fileName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Badge variant="secondary" className="text-xs">
                        {result.text.length} chars
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.text.length > 100 
                        ? result.text.substring(0, 100) + '...' 
                        : result.text || 'No text detected'
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Click to view full text
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {(result.processingTime / 1000).toFixed(1)}s
                    </Badge>
                  </div>
                </div>
                
                {index < history.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {history.length > 5 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Showing {history.length} recent extractions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}