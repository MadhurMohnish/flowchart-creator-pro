
import { createWorker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

export const extractTextFromImage = async (imageData: File | Blob | string): Promise<OCRResult> => {
  try {
    console.log('Starting OCR processing...');
    
    // Create a new worker
    const worker = await createWorker('eng');
    
    // Process the image
    let result;
    if (typeof imageData === 'string') {
      // Handle URL or base64 string
      result = await worker.recognize(imageData);
    } else {
      // Handle File or Blob
      result = await worker.recognize(imageData);
    }
    
    // Terminate the worker
    await worker.terminate();
    
    console.log('OCR processing complete');
    return {
      text: result.data.text,
      confidence: result.data.confidence
    };
  } catch (error) {
    console.error('Error during OCR processing:', error);
    throw error;
  }
};

export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
