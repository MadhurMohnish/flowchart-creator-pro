
import React, { useState } from 'react';
import { ToolType } from './types';

interface CanvasInteractionsProps {
  activeTool: ToolType;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  onMouseDown: (x: number, y: number) => void;
  onMouseMove: (x: number, y: number) => void;
  onMouseUp: () => void;
  zoom: number;
  children: React.ReactNode;
}

const CanvasInteractions: React.FC<CanvasInteractionsProps> = ({
  activeTool,
  isDrawing,
  setIsDrawing,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  zoom,
  children
}) => {
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'select') return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const x = (e.clientX - canvasRect.left) / zoom;
    const y = (e.clientY - canvasRect.top) / zoom;
    
    setIsDrawing(true);
    onMouseDown(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || activeTool === 'select') return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const x = (e.clientX - canvasRect.left) / zoom;
    const y = (e.clientY - canvasRect.top) / zoom;
    
    onMouseMove(x, y);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    onMouseUp();
  };

  return (
    <div 
      ref={canvasRef}
      className="w-full h-full relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </div>
  );
};

export default CanvasInteractions;
