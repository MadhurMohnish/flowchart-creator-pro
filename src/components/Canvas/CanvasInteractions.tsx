
import React, { useState } from 'react';
import { ToolType } from './types';

interface CanvasInteractionsProps {
  activeTool: ToolType;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
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

  return (
    <div 
      ref={canvasRef}
      className="w-full h-full relative"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {children}
    </div>
  );
};

export default CanvasInteractions;
