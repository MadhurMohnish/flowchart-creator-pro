
import { ToolType } from '../types';

export const useCanvasDrawing = (
  activeTool: ToolType,
  setCurrentPath: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>,
  setCurrentShape: React.Dispatch<React.SetStateAction<any>>,
  setPaths: React.Dispatch<React.SetStateAction<any[]>>,
  setTexts: React.Dispatch<React.SetStateAction<any[]>>,
  setShapes: React.Dispatch<React.SetStateAction<any[]>>,
  drawingColor: string,
  drawingWidth: number
) => {
  const handleMouseDown = (x: number, y: number) => {
    if (activeTool === 'pen') {
      setCurrentPath([{ x, y }]);
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      setCurrentShape({
        type: activeTool === 'rectangle' ? 'rectangle' : 'circle',
        startX: x,
        startY: y,
        endX: x,
        endY: y,
        color: drawingColor,
        width: drawingWidth
      });
    } else if (activeTool === 'text') {
      const content = prompt('Enter text:');
      if (content) {
        setTexts(prev => [...prev, {
          position: { x, y },
          content,
          fontSize: 16,
          color: drawingColor
        }]);
      }
    }
  };

  const handleMouseMove = (x: number, y: number) => {
    if (activeTool === 'pen') {
      setCurrentPath(prev => [...prev, { x, y }]);
    } else if ((activeTool === 'rectangle' || activeTool === 'circle')) {
      setCurrentShape(prev => prev ? {
        ...prev,
        endX: x,
        endY: y
      } : null);
    }
  };

  const handleMouseUp = () => {
    if (activeTool === 'pen') {
      setPaths(prev => [...prev, {
        path: [],
        tool: activeTool,
        color: drawingColor,
        width: drawingWidth
      }]);
      setCurrentPath([]);
    } else if ((activeTool === 'rectangle' || activeTool === 'circle')) {
      setShapes(prev => [...prev]);
      setCurrentShape(null);
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
