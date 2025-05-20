
import React from 'react';
import { CanvasTask } from './types';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface CanvasTasksProps {
  tasks: CanvasTask[];
  onTaskClick: (taskId: string, position: { x: number; y: number }) => void;
}

const CanvasTasks: React.FC<CanvasTasksProps> = ({ tasks, onTaskClick }) => {
  return (
    <>
      {tasks.map((canvasTask) => {
        const { task, position, id } = canvasTask;
        const Icon = task.icon;
        
        return (
          <div
            key={id}
            className="absolute node-transition group"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 10,
              width: '220px',
            }}
            onClick={() => {
              onTaskClick(task.id, { 
                x: position.x + 110, 
                y: position.y - 50 
              });
            }}
          >
            <Card className={`bg-${task.category === 'text' ? 'blue' : task.color === 'blue' ? 'indigo' : task.color}-50/90 border-${task.color}-200/70 p-4 shadow-lg rounded-lg overflow-visible transition-all duration-150`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-${task.color === 'blue' ? 'indigo' : task.color}-100/80 text-${task.color === 'blue' ? 'indigo' : task.color}-600`}>
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-800">{task.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                </div>
              </div>
              
              {/* Connection points */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-300/80 rounded-full border-2 border-white group-hover:bg-gray-400 transition-colors cursor-pointer z-20" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-300/80 rounded-full border-2 border-white group-hover:bg-gray-400 transition-colors cursor-pointer z-20" />
            </Card>
          </div>
        );
      })}
    </>
  );
};

export default CanvasTasks;
