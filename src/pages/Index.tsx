
import React, { useState } from 'react';
import Header from '@/components/UI/Header';
import CanvasArea from '@/components/Canvas/CanvasArea';
import TaskPanel from '@/components/Tasks/TaskPanel';
import { Task } from '@/components/Tasks/TaskCard';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskClick = (task: Task) => {
    toast({
      title: `${task.title} selected`,
      description: 'Drag this task to the canvas to add it to your workflow.',
    });
  };

  const handleAddTask = (task: Task, position: { x: number; y: number }) => {
    toast({
      title: `${task.title} added`,
      description: 'Task added to your workflow. Connect it with other tasks to build your automation.',
    });
    setTasks(prev => [...prev, task]);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <CanvasArea onAddTask={handleAddTask} />
        <TaskPanel onTaskClick={handleTaskClick} />
      </div>
    </div>
  );
};

export default Index;
