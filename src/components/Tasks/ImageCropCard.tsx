
import { Crop } from 'lucide-react';
import { Task } from './TaskCard';

export const imageCropTask: Task = {
  id: 'crop-image',
  title: 'Crop Image',
  description: 'Crop images to selected area',
  icon: Crop,
  category: 'image',
  color: 'blue'
};

const ImageCropCard = ({ onClick }: { onClick: (task: Task) => void }) => {
  return (
    <div 
      onClick={() => onClick(imageCropTask)}
      className="task-card task-blue w-full relative cursor-pointer"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('task', JSON.stringify(imageCropTask));
      }}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-task-blue/10 text-task-blue">
          <Crop className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">Crop Image</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            Crop images to selected area
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageCropCard;
