
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ImageIcon, DownloadIcon } from 'lucide-react';

const ImageResizeTask = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(img.width);
          setHeight(img.height);
          setPreview(e.target?.result as string);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleWidthChange = (value: number) => {
    setWidth(value);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(value * ratio));
    }
  };

  const handleHeightChange = (value: number) => {
    setHeight(value);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(value * ratio));
    }
  };

  const handleResize = () => {
    if (!preview) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `resized_${selectedFile?.name || 'image'}.png`;
          a.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: "Image resized successfully",
            description: "Your image has been resized and downloaded.",
          });
        }
      }, 'image/png');
    };

    img.src = preview;
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Resize Image</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => document.getElementById('fileInput')?.click()}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Image
            </Button>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {preview && (
            <div className="space-y-6">
              <div className="aspect-video relative rounded-lg border overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Width ({width}px)</label>
                  <Input 
                    type="number" 
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Height ({height}px)</label>
                  <Input 
                    type="number" 
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                  />
                </div>

                <Button onClick={handleResize} className="w-full">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Resize and Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ImageResizeTask;
