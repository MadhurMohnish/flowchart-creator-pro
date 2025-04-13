
import React from 'react';
import TaskCard from '../Tasks/TaskCard';
import { CanvasTask } from './types';

interface CanvasTasksProps {
  tasks: CanvasTask[];
  onTaskClick: (taskId: string, position: { x: number; y: number }) => void;
}

const CanvasTasks: React.FC<CanvasTasksProps> = ({ tasks, onTaskClick }) => {
  return (
    <>
      {tasks.map((canvasTask, index) => (
        <TaskCard
          key={`canvas-task-${canvasTask.task.id}-${index}`}
          task={canvasTask.task}
          position={canvasTask.position}
          isOnCanvas={true}
          onClick={() => {
            onTaskClick(canvasTask.task.id, { 
              x: canvasTask.position.x + 100, 
              y: canvasTask.position.y - 50 
            });
          }}
        />
      ))}
    </>
  );
};

export default CanvasTasks;
