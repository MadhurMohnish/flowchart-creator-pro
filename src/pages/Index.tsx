
import React, { useState, useEffect } from 'react';
import Header from '@/components/UI/Header';
import CanvasArea from '@/components/Canvas/CanvasArea';
import TaskPanel from '@/components/Tasks/TaskPanel';
import { Task } from '@/components/Tasks/TaskCard';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    // Set canvas as ready after a short delay to let everything render
    const timer = setTimeout(() => {
      setCanvasReady(true);
      // Check for saved workflow on first load
      const savedWorkflow = localStorage.getItem('flowAI_workflow');
      if (savedWorkflow) {
        toast({
          title: 'Workflow found',
          description: 'A previously saved workflow is available. You can load it from the canvas menu.',
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
      
      {canvasReady && (
        <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-border/30 animate-fade-in z-50">
          <h3 className="text-sm font-medium mb-1">Getting Started</h3>
          <p className="text-xs text-muted-foreground">
            Drag tasks from the panel to the canvas and connect them.<br />
            Use the toolbar on the left for drawing and annotations.
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
