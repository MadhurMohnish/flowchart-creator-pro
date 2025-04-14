
import React from 'react';
import { Type } from 'lucide-react';
import { Task } from './TaskCard';

export const extractTextTask: Task = {
  id: 'extract-text',
  title: 'Extract Text',
  description: 'Extract text from images using OCR',
  icon: Type,
  category: 'text',
  color: 'green',
};

interface ExtractTextCardProps {
  onClick: (task: Task) => void;
}

const ExtractTextCard: React.FC<ExtractTextCardProps> = ({ onClick }) => {
  const handleDragStart = (e: React.DragEvent) => {
    try {
      const taskData = JSON.stringify(extractTextTask);
      e.dataTransfer.setData('task', taskData);
      e.dataTransfer.effectAllowed = 'copy';
    } catch (error) {
      console.error("Error in ExtractTextCard drag start:", error);
    }
  };
  
  return (
    <div 
      className="task-card task-green relative cursor-pointer animate-fade-in"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(extractTextTask)}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-task-green/10 text-task-green">
          <Type className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">Extract Text</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            Extract text from images using OCR
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExtractTextCard;
