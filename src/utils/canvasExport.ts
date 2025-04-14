
import { toast } from '@/components/ui/use-toast';

export const exportCanvasAsImage = () => {
  try {
    // Get the canvas element (the main drop zone with the class "canvas-grid")
    const canvasElement = document.querySelector('.canvas-grid') as HTMLElement;
    
    if (!canvasElement) {
      toast({
        title: 'Export failed',
        description: 'Canvas element not found.',
        variant: 'destructive',
      });
      return;
    }
    
    // Create a new canvas with the same dimensions
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      toast({
        title: 'Export failed',
        description: 'Could not create canvas context.',
        variant: 'destructive',
      });
      return;
    }
    
    // Set canvas dimensions to match the element
    const rect = canvasElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Create an SVG data URL
    const svgContent = new XMLSerializer().serializeToString(
      canvasElement.querySelector('svg') as SVGElement
    );
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Create an image from the SVG
    const img = new Image();
    img.onload = () => {
      // Draw background
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw SVG
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw task elements
      const taskElements = canvasElement.querySelectorAll('.canvas-task');
      const promises = Array.from(taskElements).map((taskElement) => {
        return html2canvas(taskElement as HTMLElement).then(taskCanvas => {
          const taskRect = (taskElement as HTMLElement).getBoundingClientRect();
          const canvasRect = canvasElement.getBoundingClientRect();
          
          // Calculate position relative to canvas
          const x = taskRect.left - canvasRect.left;
          const y = taskRect.top - canvasRect.top;
          
          context.drawImage(taskCanvas, x, y, taskRect.width, taskRect.height);
        });
      });
      
      Promise.all(promises)
        .then(() => {
          // Convert canvas to image and download
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `flow-ai-canvas-${new Date().toISOString().slice(0, 10)}.png`;
          link.href = dataUrl;
          link.click();
          
          // Clean up
          URL.revokeObjectURL(svgUrl);
          
          toast({
            title: 'Export successful',
            description: 'Canvas exported as PNG image.',
          });
        })
        .catch((error) => {
          console.error('Error exporting canvas:', error);
          toast({
            title: 'Export failed',
            description: 'Could not export canvas. Try again.',
            variant: 'destructive',
          });
        });
    };
    
    img.onerror = () => {
      toast({
        title: 'Export failed',
        description: 'Could not load SVG image.',
        variant: 'destructive',
      });
      URL.revokeObjectURL(svgUrl);
    };
    
    img.src = svgUrl;
  } catch (error) {
    console.error('Error exporting canvas:', error);
    toast({
      title: 'Export failed',
      description: 'An unexpected error occurred.',
      variant: 'destructive',
    });
  }
};

// Simplified html2canvas function that creates a canvas from an HTML element
const html2canvas = (element: HTMLElement): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        reject(new Error('Could not create canvas context'));
        return;
      }
      
      const rect = element.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Draw background if needed
      context.fillStyle = 'transparent';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Use HTML elements background and content
      const styles = window.getComputedStyle(element);
      
      if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        context.fillStyle = styles.backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw border if exists
      if (styles.borderWidth && styles.borderWidth !== '0px') {
        context.strokeStyle = styles.borderColor;
        context.lineWidth = parseFloat(styles.borderWidth);
        context.strokeRect(0, 0, canvas.width, canvas.height);
      }
      
      // Add text content if any
      const textContent = element.textContent || '';
      if (textContent.trim()) {
        context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
        context.fillStyle = styles.color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(textContent, canvas.width / 2, canvas.height / 2);
      }
      
      resolve(canvas);
    } catch (error) {
      reject(error);
    }
  });
};
