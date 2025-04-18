
import React from 'react';
import { Crop } from 'lucide-react';
import TaskCard, { Task } from './TaskCard';

export const imageCropTask: Task = {
  id: 'crop-image',
  title: 'Crop Image',
  description: 'Crop images to selected area',
  icon: Crop,
  category: 'image',
  color: 'blue'
};

interface ImageCropCardProps {
  onClick: (task: Task) => void;
}

const ImageCropCard: React.FC<ImageCropCardProps> = ({ onClick }) => {
  return (
    <TaskCard
      task={imageCropTask}
      onClick={onClick}
    />
  );
};

export default ImageCropCard;
