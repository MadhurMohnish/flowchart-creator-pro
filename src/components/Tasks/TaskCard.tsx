
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
  const { title, description, icon: Icon, color, category } = task;
  
  const handleDragStart = (e: React.DragEvent) => {
    try {
      // Set the task data as JSON string
      const taskData = JSON.stringify(task);
      e.dataTransfer.setData('task', taskData);
      e.dataTransfer.effectAllowed = 'copy';
      
      // Optional: set a custom drag image for better UX
      if (!isOnCanvas && e.target instanceof HTMLElement) {
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

  const bgColor = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50'
  };
  
  const iconBgColor = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100'
  };
  
  const iconColor = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  };

  return (
    <Card
      className={cn(
        'task-card border shadow-sm hover:shadow-md transition-shadow',
        isOnCanvas ? 'min-w-[180px]' : 'w-full',
        isOnCanvas ? 'animate-scale-in' : '',
        'relative cursor-pointer p-3'
      )}
      style={position ? {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
      } as React.CSSProperties : {}}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-lg', 
          iconBgColor[color], 
          iconColor[color]
        )}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          {(!isOnCanvas || true) && (
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
