
import React, { useRef } from 'react';
import { Task } from '../Tasks/TaskCard';

interface CanvasDropZoneProps {
  onDrop: (task: Task, position: { x: number; y: number }) => void;
  onDragOver: (e: React.DragEvent) => void;
  zoom: number;
  children: React.ReactNode;
}

const CanvasDropZone: React.FC<CanvasDropZoneProps> = ({ 
  onDrop, 
  onDragOver, 
  zoom, 
  children 
}) => {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData('task');
    
    if (!taskData) {
      console.log("No task data found in drop event");
      return;
    }
    
    try {
      const task = JSON.parse(taskData) as Task;
      const canvasRect = dropZoneRef.current?.getBoundingClientRect();
      
      if (!canvasRect) {
        console.log("Canvas reference not available");
        return;
      }
      
      const x = (e.clientX - canvasRect.left) / zoom;
      const y = (e.clientY - canvasRect.top) / zoom;
      
      onDrop(task, { x, y });
    } catch (error) {
      console.error('Error processing dropped task:', error);
    }
  };

  return (
    <div 
      ref={dropZoneRef}
      className="w-full h-full canvas-grid bg-canvas-background"
      style={{ 
        transform: `scale(${zoom})`,
        transformOrigin: 'center',
        transition: 'transform 0.2s ease-out'
      }}
      onDrop={handleDrop}
      onDragOver={onDragOver}
    >
      {children}
    </div>
  );
};

export default CanvasDropZone;
