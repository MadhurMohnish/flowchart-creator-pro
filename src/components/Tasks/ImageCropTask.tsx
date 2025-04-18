
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ImageIcon, Crop, DownloadIcon } from 'lucide-react';

const ImageCropTask = () => {
  const [image, setImage] = useState<string>('');
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;

    if (canvas && ctx && img) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (cropStart && cropEnd) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        const width = cropEnd.x - cropStart.x;
        const height = cropEnd.y - cropStart.y;
        
        ctx.strokeRect(cropStart.x, cropStart.y, width, height);
        
        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, cropStart.y); // Top
        ctx.fillRect(0, cropEnd.y, canvas.width, canvas.height - cropEnd.y); // Bottom
        ctx.fillRect(0, cropStart.y, cropStart.x, height); // Left
        ctx.fillRect(cropEnd.x, cropStart.y, canvas.width - cropEnd.x, height); // Right
      }
    }
  };

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        if (imageRef.current) {
          imageRef.current.src = image;
          drawImage();
        }
      };
      img.src = image;
    }
  }, [image]);

  useEffect(() => {
    drawImage();
  }, [cropStart, cropEnd]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropStart({ x, y });
    setCropEnd({ x, y });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, canvasRef.current.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, canvasRef.current.height));
    
    setCropEnd({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    if (!cropStart || !cropEnd || !canvasRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);
    
    const startX = Math.min(cropStart.x, cropEnd.x);
    const startY = Math.min(cropStart.y, cropEnd.y);
    
    canvas.width = width;
    canvas.height = height;
    
    if (ctx && imageRef.current) {
      ctx.drawImage(
        imageRef.current,
        startX,
        startY,
        width,
        height,
        0,
        0,
        width,
        height
      );
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'cropped-image.png';
          a.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: "Image cropped successfully",
            description: "Your cropped image has been downloaded.",
          });
        }
      }, 'image/png');
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Crop Image</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => document.getElementById('cropFileInput')?.click()}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Image
            </Button>
            <input
              id="cropFileInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {image && (
            <div className="space-y-4">
              <div className="relative border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="max-w-full h-auto"
                />
                <img
                  ref={imageRef}
                  src={image}
                  className="hidden"
                  onLoad={drawImage}
                  alt="Original"
                />
              </div>

              <Button
                onClick={handleCrop}
                className="w-full"
                disabled={!cropStart || !cropEnd}
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Crop and Download
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ImageCropTask;
