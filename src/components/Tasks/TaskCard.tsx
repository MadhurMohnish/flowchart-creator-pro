
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'image' | 'text' | 'data' | 'export' | 'development';
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  isDraggable?: boolean;
  isOnCanvas?: boolean;
  position?: { x: number; y: number };
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick, 
  isDraggable = true, 
  isOnCanvas = false,
  position
}) => {
  const { title, description, icon: Icon, color } = task;
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
  };

  const style = position ? {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
  } as React.CSSProperties : {};

  return (
    <div
      className={cn(
        'task-card',
        `task-${color}`,
        isOnCanvas ? 'min-w-[180px]' : 'w-full',
        isOnCanvas ? 'animate-scale-in' : '',
        isOnCanvas && 'z-10'
      )}
      style={style}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onClick={() => onClick(task)}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-lg', 
          `bg-task-${color}/10`, 
          `text-task-${color}`
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          {!isOnCanvas && (
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
