
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { loadImage, removeBackground } from '@/utils/backgroundRemoval';
import { ImageIcon, Upload, Download } from 'lucide-react';

const BackgroundRemovalTask: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Display original image
    setOriginalImage(URL.createObjectURL(file));
    setProcessedImage(null);
  };

  const handleProcessImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    toast({
      title: 'Processing image',
      description: 'This may take a few moments...',
    });

    try {
      // Convert image URL to blob
      const response = await fetch(originalImage);
      const blob = await response.blob();
      
      // Load the image
      const img = await loadImage(blob);
      
      // Process the image
      const processedBlob = await removeBackground(img);
      
      // Display processed image
      setProcessedImage(URL.createObjectURL(processedBlob));
      
      toast({
        title: 'Image processed',
        description: 'Background has been removed successfully!',
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: 'Processing failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const a = document.createElement('a');
    a.href = processedImage;
    a.download = 'image-no-background.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Background Removal</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {originalImage && (
          <div className="border rounded-md p-2">
            <p className="text-xs text-muted-foreground mb-2">Original Image</p>
            <div className="relative aspect-square bg-muted/30 flex items-center justify-center overflow-hidden rounded-md">
              <img 
                src={originalImage} 
                alt="Original" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        )}

        {processedImage && (
          <div className="border rounded-md p-2">
            <p className="text-xs text-muted-foreground mb-2">Result (Transparent Background)</p>
            <div className="relative aspect-square bg-[url('/placeholder.svg')] bg-cover flex items-center justify-center overflow-hidden rounded-md">
              <img 
                src={processedImage} 
                alt="Processed" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-center mt-4">
        {originalImage && !processedImage && (
          <Button 
            onClick={handleProcessImage}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Remove Background'}
          </Button>
        )}

        {processedImage && (
          <Button 
            variant="secondary"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Result
          </Button>
        )}
      </div>
    </div>
  );
};

export default BackgroundRemovalTask;
