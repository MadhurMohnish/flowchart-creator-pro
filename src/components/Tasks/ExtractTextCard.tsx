
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
  return (
    <div 
      className="task-card task-green relative cursor-pointer animate-fade-in"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('task', JSON.stringify(extractTextTask));
      }}
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
