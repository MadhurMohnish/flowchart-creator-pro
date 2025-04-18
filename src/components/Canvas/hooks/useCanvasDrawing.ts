import React from 'react';
import { DrawingPath, ShapeElement, TextElement } from '../types';

export const useCanvasDrawing = (
  activeTool: string,
  setCurrentPath: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>,
  setCurrentShape: React.Dispatch<React.SetStateAction<ShapeElement | null>>,
  setPaths: React.Dispatch<React.SetStateAction<DrawingPath[]>>,
  setTexts: React.Dispatch<React.SetStateAction<TextElement[]>>,
  setShapes: React.Dispatch<React.SetStateAction<ShapeElement[]>>,
  drawingColor: string,
  drawingWidth: number
) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'pen') {
      setCurrentPath([{ x, y }]);
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      setCurrentShape({ type: activeTool, x, y, width: 0, height: 0, color: drawingColor });
    } else if (activeTool === 'text') {
      setTexts(prev => [...prev, { x, y, content: 'New Text', color: drawingColor }]);
    }
    
    if (activeTool === 'eraser') {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentPath([{ x, y }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeTool === 'eraser') {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentPath(prev => [...prev, { x, y }]);
      
      // Remove paths that intersect with the eraser
      setPaths(prevPaths => {
        return prevPaths.filter(path => {
          // Simple intersection check
          return !path.path.some(point => 
            Math.abs(point.x - x) < 10 && Math.abs(point.y - y) < 10
          );
        });
      });
    }
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'pen') {
      setCurrentPath(prev => [...prev, { x, y }]);
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      if (currentShape) {
        const width = x - currentShape.x;
        const height = y - currentShape.y;
        setCurrentShape(prev => prev && ({ ...prev, width: Math.abs(width), height: Math.abs(height) }));
      }
    }
  };

  const handleMouseUp = () => {
    if (activeTool === 'pen') {
      setPaths(prev => [...prev, { path: currentPath, color: drawingColor, width: drawingWidth }]);
      setCurrentPath([]);
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      if (currentShape) {
        setShapes(prev => [...prev, currentShape]);
        setCurrentShape(null);
      }
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
