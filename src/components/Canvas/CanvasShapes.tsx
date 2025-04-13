
import React from 'react';
import { ShapeElement } from './types';

interface CanvasShapesProps {
  shapes: ShapeElement[];
  currentShape: ShapeElement | null;
  isDrawing: boolean;
  activeTool: string;
}

const CanvasShapes: React.FC<CanvasShapesProps> = ({ 
  shapes, 
  currentShape, 
  isDrawing, 
  activeTool 
}) => {
  return (
    <>
      {shapes.map((shape, index) => (
        shape.type === 'rectangle' ? (
          <rect
            key={`shape-rect-${index}`}
            x={Math.min(shape.startX, shape.endX)}
            y={Math.min(shape.startY, shape.endY)}
            width={Math.abs(shape.endX - shape.startX)}
            height={Math.abs(shape.endY - shape.startY)}
            stroke={shape.color}
            strokeWidth={shape.width}
            fill="none"
          />
        ) : (
          <ellipse
            key={`shape-circle-${index}`}
            cx={(shape.startX + shape.endX) / 2}
            cy={(shape.startY + shape.endY) / 2}
            rx={Math.abs(shape.endX - shape.startX) / 2}
            ry={Math.abs(shape.endY - shape.startY) / 2}
            stroke={shape.color}
            strokeWidth={shape.width}
            fill="none"
          />
        )
      ))}
      
      {isDrawing && (activeTool === 'rectangle' || activeTool === 'circle') && currentShape && (
        currentShape.type === 'rectangle' ? (
          <rect
            x={Math.min(currentShape.startX, currentShape.endX)}
            y={Math.min(currentShape.startY, currentShape.endY)}
            width={Math.abs(currentShape.endX - currentShape.startX)}
            height={Math.abs(currentShape.endY - currentShape.startY)}
            stroke={currentShape.color}
            strokeWidth={currentShape.width}
            fill="none"
          />
        ) : (
          <ellipse
            cx={(currentShape.startX + currentShape.endX) / 2}
            cy={(currentShape.startY + currentShape.endY) / 2}
            rx={Math.abs(currentShape.endX - currentShape.startX) / 2}
            ry={Math.abs(currentShape.endY - currentShape.startY) / 2}
            stroke={currentShape.color}
            strokeWidth={currentShape.width}
            fill="none"
          />
        )
      )}
    </>
  );
};

export default CanvasShapes;
