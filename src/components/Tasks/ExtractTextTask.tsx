
import React, { useState } from 'react';
import { Upload, Copy, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { extractTextFromImage } from '@/utils/ocrProcessing';
import { Progress } from '@/components/ui/progress';

const ExtractTextTask: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setConfidence(null);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      toast({
        title: 'No image selected',
        description: 'Please select an image to extract text from.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(0);
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 300);

      const ocrResult = await extractTextFromImage(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (ocrResult.text.trim()) {
        setResult(ocrResult.text);
        setConfidence(ocrResult.confidence);
        toast({
          title: 'Text extracted successfully',
          description: `Extracted ${ocrResult.text.length} characters with ${Math.round(ocrResult.confidence)}% confidence.`,
        });
      } else {
        toast({
          title: 'No text found',
          description: 'The image does not contain any recognizable text.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error during text extraction:', error);
      toast({
        title: 'Text extraction failed',
        description: 'An error occurred while processing the image.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleCopyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: 'Copied to clipboard',
        description: 'The extracted text has been copied to your clipboard.',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            Extract Text from Image
          </CardTitle>
          <CardDescription>
            Upload an image and extract text using OCR (Optical Character Recognition)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            {previewUrl ? (
              <div className="space-y-4 w-full">
                <div className="relative max-h-64 overflow-hidden rounded-lg">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="mx-auto max-h-64 object-contain"
                  />
                  <button 
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setResult(null);
                      setConfidence(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-gray-800/70 rounded-full text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18"></path>
                      <path d="M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <Button 
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? 'Processing...' : 'Extract Text'}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex flex-col items-center text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary/80">
                    <span>Upload a file</span>
                    <Input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="mt-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
          
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Processing image...</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Extracted Text</h3>
                <div className="flex items-center gap-1 text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Confidence: {Math.round(confidence || 0)}%</span>
                </div>
              </div>
              <div className="relative">
                <Textarea
                  readOnly
                  value={result}
                  className="min-h-32 font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-muted/50 text-xs text-muted-foreground">
          <p>Text extraction is performed entirely in your browser using Tesseract.js</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExtractTextTask;
