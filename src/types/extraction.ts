export interface ExtractionResult {
  id: string;
  text: string;
  fileName: string;
  timestamp: Date;
  imageUrl: string;
  processingTime: number;
}

export interface ExtractionHistory {
  results: ExtractionResult[];
  maxEntries: number;
}

export interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

export interface ApiResponse {
  success: boolean;
  text?: string;
  error?: string;
  processingTime?: number;
}

export interface ImageUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
}

export interface TextResultProps {
  result: ExtractionResult | null;
  isProcessing: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export interface ExtractionHistoryProps {
  history: ExtractionResult[];
  onSelectResult: (result: ExtractionResult) => void;
  onClearHistory: () => void;
}