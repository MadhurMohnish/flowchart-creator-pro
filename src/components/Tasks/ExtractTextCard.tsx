
import React from 'react';
import { Type } from 'lucide-react';
import TaskCard, { Task } from './TaskCard';

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
    <TaskCard
      task={extractTextTask}
      onClick={onClick}
    />
  );
};

export default ExtractTextCard;
