
import React from 'react';
import { ImageIcon } from 'lucide-react';
import TaskCard, { Task } from './TaskCard';

export const imageResizeTask: Task = {
  id: 'resize-image',
  title: 'Resize Image',
  description: 'Resize images to specific dimensions',
  icon: ImageIcon,
  category: 'image',
  color: 'blue'
};

interface ImageResizeCardProps {
  onClick: (task: Task) => void;
}

const ImageResizeCard: React.FC<ImageResizeCardProps> = ({ onClick }) => {
  return (
    <TaskCard
      task={imageResizeTask}
      onClick={onClick}
    />
  );
};

export default ImageResizeCard;
