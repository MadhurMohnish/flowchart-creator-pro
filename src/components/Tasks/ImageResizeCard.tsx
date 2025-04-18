
import { ImageIcon } from 'lucide-react';
import { Task } from './TaskCard';

export const imageResizeTask: Task = {
  id: 'resize-image',
  title: 'Resize Image',
  description: 'Resize images to specific dimensions',
  icon: ImageIcon,
  category: 'image',
  color: 'blue'
};

const ImageResizeCard = ({ onClick }: { onClick: (task: Task) => void }) => {
  return (
    <div 
      onClick={() => onClick(imageResizeTask)}
      className="task-card task-blue w-full relative cursor-pointer"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('task', JSON.stringify(imageResizeTask));
      }}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-task-blue/10 text-task-blue">
          <ImageIcon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">Resize Image</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            Resize images to specific dimensions
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageResizeCard;
