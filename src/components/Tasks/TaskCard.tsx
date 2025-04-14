
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
    try {
      // Set the task data as JSON string
      const taskData = JSON.stringify(task);
      e.dataTransfer.setData('task', taskData);
      
      // Create a drag image to improve the user experience
      if (!isOnCanvas && e.target instanceof HTMLElement) {
        e.dataTransfer.effectAllowed = 'copy';
        
        // Optional: set a custom drag image
        const dragIcon = document.createElement('div');
        dragIcon.classList.add('bg-white', 'p-2', 'rounded', 'shadow', 'border');
        dragIcon.textContent = title;
        document.body.appendChild(dragIcon);
        e.dataTransfer.setDragImage(dragIcon, 0, 0);
        
        // Clean up the element after the drag operation
        setTimeout(() => {
          if (dragIcon.parentNode) {
            document.body.removeChild(dragIcon);
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error in drag start:", error);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    try {
      onClick(task);
    } catch (error) {
      console.error("Error in task click:", error);
    }
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
        isOnCanvas && 'z-10',
        'relative'
      )}
      style={style}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onClick={handleClick}
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
      
      {isOnCanvas && (
        <div className="absolute -right-2 -bottom-2 h-4 w-4 bg-primary rounded-full opacity-70 hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
};

export default TaskCard;
