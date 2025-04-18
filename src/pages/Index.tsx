
import React, { useState, useEffect } from 'react';
import Header from '@/components/UI/Header';
import CanvasArea from '@/components/Canvas/CanvasArea';
import TaskPanel from '@/components/Tasks/TaskPanel';
import BackgroundRemovalTask from '@/components/Tasks/BackgroundRemovalTask';
import ExtractTextTask from '@/components/Tasks/ExtractTextTask';
import ImageResizeTask from '@/components/Tasks/ImageResizeTask';
import ImageCropTask from '@/components/Tasks/ImageCropTask';
import { Task } from '@/components/Tasks/TaskCard';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [canvasReady, setCanvasReady] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
    setSelectedTask(task);
    
    toast({
      title: `${task.title} selected`,
      description: task.id === 'background-removal' 
        ? 'Use this tool to remove backgrounds from your images.'
        : task.id === 'extract-text'
        ? 'Use this tool to extract text from your images.'
        : 'Drag this task to the canvas to add it to your workflow.',
    });
  };

  const handleAddTask = (task: Task, position: { x: number; y: number }) => {
    toast({
      title: `${task.title} added`,
      description: 'Task added to your workflow. Connect it with other tasks to build your automation.',
    });
    setTasks(prev => [...prev, task]);
  };

  const renderSelectedTaskComponent = () => {
    if (!selectedTask) return null;
    
    switch (selectedTask.id) {
      case 'background-removal':
        return <BackgroundRemovalTask />;
      case 'extract-text':
        return <ExtractTextTask />;
      case 'resize-image':
        return <ImageResizeTask />;
      case 'crop-image':
        return <ImageCropTask />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {(selectedTask?.id === 'background-removal' || selectedTask?.id === 'extract-text') ? (
          <div className="flex-1 p-4 overflow-y-auto">
            {renderSelectedTaskComponent()}
          </div>
        ) : (
          <CanvasArea onAddTask={handleAddTask} />
        )}
        <TaskPanel onTaskClick={handleTaskClick} />
      </div>
      
      {canvasReady && !selectedTask && (
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
