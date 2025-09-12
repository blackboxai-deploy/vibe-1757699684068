import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Image to Text Extractor',
  description: 'Extract text from images using advanced AI-powered OCR technology. Upload images in JPEG, PNG, WebP, or GIF format and get accurate text extraction results.',
  keywords: ['OCR', 'image to text', 'text extraction', 'AI', 'image processing', 'document scanner'],
  authors: [{ name: 'Image to Text App' }],
  creator: 'Image to Text App',
  publisher: 'Image to Text App',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Image to Text Extractor - AI-Powered OCR',
    description: 'Extract text from images using advanced AI technology. Fast, accurate, and easy to use.',
    siteName: 'Image to Text Extractor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to Text Extractor',
    description: 'Extract text from images using AI-powered OCR technology.',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary-foreground"
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
                  <div>
                    <h1 className="text-xl font-bold">Image to Text</h1>
                    <p className="text-sm text-muted-foreground">AI-Powered OCR</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Extract text from images instantly
                  </span>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>© 2024 Image to Text Extractor</span>
                  <span>•</span>
                  <span>Powered by AI</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Supports JPEG, PNG, WebP, GIF</span>
                  <span>•</span>
                  <span>Max 10MB</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}