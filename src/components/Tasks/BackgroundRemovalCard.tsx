
import React from 'react';
import { ImageOff } from 'lucide-react';
import TaskCard, { Task } from './TaskCard';

const backgroundRemovalTask: Task = {
  id: 'background-removal',
  title: 'Background Removal',
  description: 'Remove background from images using AI',
  icon: ImageOff,
  category: 'image',
  color: 'purple',
};

interface BackgroundRemovalCardProps {
  onClick: (task: Task) => void;
}

const BackgroundRemovalCard: React.FC<BackgroundRemovalCardProps> = ({ onClick }) => {
  return (
    <TaskCard
      task={backgroundRemovalTask}
      onClick={onClick}
    />
  );
};

export default BackgroundRemovalCard;
export { backgroundRemovalTask };
