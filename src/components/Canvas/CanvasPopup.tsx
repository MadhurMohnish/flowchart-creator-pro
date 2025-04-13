
import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface CanvasPopupProps {
  position: { x: number; y: number };
  onClose: () => void;
  onImageUpload: (file: File) => void;
  title: string;
}

const CanvasPopup: React.FC<CanvasPopupProps> = ({ 
  position, 
  onClose, 
  onImageUpload, 
  title 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file.',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };
  
  return (
    <div 
      className="absolute bg-white rounded-lg shadow-lg border border-border/70 w-80 z-50 animate-scale-in"
      style={{ 
        left: position.x,
        top: position.y,
      }}
    >
      <div className="flex items-center justify-between p-3 border-b border-border/20">
        <h3 className="text-sm font-medium">{title}</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        className={`p-6 flex flex-col items-center justify-center ${
          isDragging ? 'bg-primary/5 border-primary' : 'bg-muted/30'
        } border-2 border-dashed rounded-md m-3`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-center mb-2">
          Drag & drop an image here, or
        </p>
        <label className="relative">
          <Button size="sm" variant="secondary">
            Browse Files
          </Button>
          <input 
            type="file" 
            className="sr-only" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default CanvasPopup;
