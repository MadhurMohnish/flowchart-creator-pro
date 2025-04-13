
import React from 'react';
import { DrawingPath } from './types';

interface CanvasDrawingsProps {
  paths: DrawingPath[];
  currentPath: { x: number; y: number }[];
  isDrawing: boolean;
  activeTool: string;
  drawingColor: string;
  drawingWidth: number;
}

const CanvasDrawings: React.FC<CanvasDrawingsProps> = ({ 
  paths, 
  currentPath, 
  isDrawing, 
  activeTool, 
  drawingColor, 
  drawingWidth 
}) => {
  const currentPathToSvgPath = () => {
    if (currentPath.length < 2) return '';
    
    return currentPath.reduce((path, point, index) => {
      return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
    }, '');
  };

  return (
    <>
      {paths.map((pathObj, index) => (
        <path
          key={`drawing-path-${index}`}
          d={pathObj.path.reduce((pathData, point, i) => (
            pathData + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`)
          ), '')}
          stroke={pathObj.color}
          strokeWidth={pathObj.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      
      {isDrawing && activeTool === 'pen' && (
        <path
          d={currentPathToSvgPath()}
          stroke={drawingColor}
          strokeWidth={drawingWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </>
  );
};

export default CanvasDrawings;
