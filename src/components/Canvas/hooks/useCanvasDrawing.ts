
import React, { useState } from 'react';
import { DrawingPath, ShapeElement, TextElement, ToolType } from '../types';

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
  // Add local state to track the current shape being drawn
  const [localCurrentShape, setLocalCurrentShape] = useState<ShapeElement | null>(null);
  // Add local state to track the current path being drawn
  const [localCurrentPath, setLocalCurrentPath] = useState<{ x: number; y: number }[]>([]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'pen') {
      setCurrentPath([{ x, y }]);
      setLocalCurrentPath([{ x, y }]);
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      const newShape: ShapeElement = { 
        type: activeTool as 'rectangle' | 'circle', 
        startX: x, 
        startY: y, 
        endX: x, 
        endY: y, 
        color: drawingColor,
        width: drawingWidth
      };
      setCurrentShape(newShape);
      setLocalCurrentShape(newShape);
    } else if (activeTool === 'text') {
      setTexts(prev => [...prev, { 
        position: { x, y }, 
        content: 'New Text', 
        fontSize: 16, 
        color: drawingColor 
      }]);
    }
    
    if (activeTool === 'eraser') {
      setCurrentPath([{ x, y }]);
      setLocalCurrentPath([{ x, y }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'eraser') {
      setCurrentPath(prev => [...prev, { x, y }]);
      setLocalCurrentPath(prev => [...prev, { x, y }]);
      
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
    
    if (activeTool === 'pen') {
      setCurrentPath(prev => [...prev, { x, y }]);
      setLocalCurrentPath(prev => [...prev, { x, y }]);
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      if (localCurrentShape) {
        const updatedShape = {
          ...localCurrentShape,
          endX: x,
          endY: y
        };
        setCurrentShape(updatedShape);
        setLocalCurrentShape(updatedShape);
      }
    }
  };

  const handleMouseUp = () => {
    if (activeTool === 'pen') {
      setPaths(prev => [...prev, { 
        path: localCurrentPath, 
        tool: 'pen' as ToolType, 
        color: drawingColor, 
        width: drawingWidth 
      }]);
      setCurrentPath([]);
      setLocalCurrentPath([]);
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      if (localCurrentShape) {
        setShapes(prev => [...prev, localCurrentShape]);
        setCurrentShape(null);
        setLocalCurrentShape(null);
      }
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
