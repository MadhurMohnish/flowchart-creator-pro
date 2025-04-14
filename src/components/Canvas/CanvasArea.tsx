
import React, { useState, useEffect } from 'react';
import ToolBar, { ToolType } from './ToolBar';
import { Task } from '../Tasks/TaskCard';
import CanvasPopup from './CanvasPopup';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import CanvasConnections from './CanvasConnections';
import CanvasDrawings from './CanvasDrawings';
import CanvasShapes from './CanvasShapes';
import CanvasTexts from './CanvasTexts';
import CanvasTasks from './CanvasTasks';
import CanvasDropZone from './CanvasDropZone';
import CanvasInteractions from './CanvasInteractions';
import SavedWorkflows from './SavedWorkflows';
import { calculateDistance, saveToLocalStorage, loadFromLocalStorage } from './utils/canvasUtils';
import { CanvasTask, DrawingPath, ShapeElement, TextElement, PopupState } from './types';

interface CanvasAreaProps {
  onAddTask: (task: Task, position: { x: number; y: number }) => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ onAddTask }) => {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [zoom, setZoom] = useState(1);
  const [tasks, setTasks] = useState<CanvasTask[]>([]);
  const [connections, setConnections] = useState<{ start: string; end: string }[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [shapes, setShapes] = useState<ShapeElement[]>([]);
  const [texts, setTexts] = useState<TextElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [drawingWidth, setDrawingWidth] = useState(2);
  const [currentShape, setCurrentShape] = useState<ShapeElement | null>(null);
  const [popup, setPopup] = useState<PopupState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    taskId: '',
  });
  const navigate = useNavigate();

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleClear = () => {
    if (tasks.length > 0 || connections.length > 0 || paths.length > 0 || shapes.length > 0 || texts.length > 0) {
      if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
        setTasks([]);
        setConnections([]);
        setPaths([]);
        setShapes([]);
        setTexts([]);
        toast({
          title: 'Canvas cleared',
          description: 'All tasks, connections, and annotations have been removed.',
        });
      }
    }
  };

  const handleUndo = () => {
    if (paths.length > 0) {
      setPaths(paths.slice(0, -1));
    } else if (shapes.length > 0) {
      setShapes(shapes.slice(0, -1));
    } else if (texts.length > 0) {
      setTexts(texts.slice(0, -1));
    } else if (tasks.length > 0) {
      setTasks(tasks.slice(0, -1));
      const lastTask = tasks[tasks.length - 1];
      setConnections(connections.filter(
        conn => conn.start !== lastTask.task.id && conn.end !== lastTask.task.id
      ));
    }
  };

  const findNearestTask = (position: { x: number; y: number }) => {
    if (tasks.length === 0) return null;
    
    let nearestTask = tasks[0];
    let minDistance = calculateDistance(tasks[0].position, position);
    
    for (let i = 1; i < tasks.length; i++) {
      const distance = calculateDistance(tasks[i].position, position);
      if (distance < minDistance) {
        minDistance = distance;
        nearestTask = tasks[i];
      }
    }
    
    return nearestTask;
  };

  const handleDrop = (task: Task, position: { x: number; y: number }) => {
    try {
      const newTask = {
        task,
        position
      };
      
      setTasks(prev => [...prev, newTask]);
      
      try {
        onAddTask(task, position);
      } catch (error) {
        console.error("Error in onAddTask callback:", error);
      }
      
      if (task.id === 'extract-text') {
        setPopup({
          isOpen: true,
          position: { x: position.x + 100, y: position.y - 50 },
          taskId: task.id,
        });
      }
      
      if (tasks.length > 0) {
        try {
          const nearestTask = findNearestTask(position);
          if (nearestTask && calculateDistance(nearestTask.position, position) < 200) {
            setConnections(prev => [...prev, { 
              start: nearestTask.task.id, 
              end: task.id 
            }]);
          }
        } catch (error) {
          console.error("Error adding connection:", error);
        }
      }
    } catch (error) {
      console.error('Error processing dropped task:', error);
      toast({
        title: 'Error',
        description: 'Could not add task to canvas. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSaveToLocalStorage = () => {
    // Create a unique ID for the workflow
    const workflowId = `workflow_${Date.now()}`;
    
    // Prompt for workflow name
    const workflowName = prompt('Enter a name for this workflow:', `Workflow ${new Date().toLocaleString()}`);
    
    if (!workflowName) return; // User cancelled
    
    const workflowData = {
      name: workflowName,
      tasks,
      connections,
      paths,
      shapes,
      texts,
      timestamp: new Date().toISOString()
    };
    
    // Save to both default storage and as a named workflow
    const defaultResult = saveToLocalStorage(workflowData);
    
    try {
      // Save as a named workflow
      localStorage.setItem(`flowAI_workflow_${workflowId}`, JSON.stringify(workflowData));
      
      if (defaultResult.success) {
        toast({
          title: 'Workflow saved',
          description: `Your workflow "${workflowName}" has been saved.`
        });
      } else {
        toast({
          title: 'Save partially successful',
          description: 'Your workflow was saved but not set as the default.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save workflow. Your browser storage might be full.',
        variant: 'destructive'
      });
    }
  };

  const handleLoadFromLocalStorage = () => {
    // This now just triggers the SavedWorkflows dialog to open
    const savedWorkflowsEvent = new CustomEvent('showSavedWorkflows');
    window.dispatchEvent(savedWorkflowsEvent);
  };

  const handlePopupClose = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const handleTaskClick = (taskId: string, position: { x: number; y: number }) => {
    if (taskId === 'extract-text') {
      setPopup({
        isOpen: true,
        position,
        taskId,
      });
    } else {
      toast({
        title: 'Task selected',
        description: `${taskId} configuration will be available in a future update.`,
      });
    }
  };

  const handleImageUpload = (file: File) => {
    toast({
      title: 'Image uploaded',
      description: 'Processing your image...',
    });
    
    if (popup.taskId === 'extract-text') {
      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem('ocrImage', reader.result as string);
        setPopup(prev => ({ ...prev, isOpen: false }));
        const taskObj = tasks.find(t => t.task.id === 'extract-text');
        if (taskObj) {
          navigate('/', { state: { selectedTaskId: 'extract-text' } });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (x: number, y: number) => {
    if (activeTool === 'pen') {
      setCurrentPath([{ x, y }]);
    } else if (activeTool === 'rectangle' || activeTool === 'circle') {
      setCurrentShape({
        type: activeTool === 'rectangle' ? 'rectangle' : 'circle',
        startX: x,
        startY: y,
        endX: x,
        endY: y,
        color: drawingColor,
        width: drawingWidth
      });
    } else if (activeTool === 'text') {
      const content = prompt('Enter text:');
      if (content) {
        setTexts(prev => [...prev, {
          position: { x, y },
          content,
          fontSize: 16,
          color: drawingColor
        }]);
      }
    }
  };

  const handleMouseMove = (x: number, y: number) => {
    if (activeTool === 'pen') {
      setCurrentPath(prev => [...prev, { x, y }]);
    } else if ((activeTool === 'rectangle' || activeTool === 'circle') && currentShape) {
      setCurrentShape({
        ...currentShape,
        endX: x,
        endY: y
      });
    }
  };

  const handleMouseUp = () => {
    if (activeTool === 'pen' && currentPath.length > 1) {
      setPaths(prev => [...prev, {
        path: currentPath,
        tool: activeTool,
        color: drawingColor,
        width: drawingWidth
      }]);
      setCurrentPath([]);
    } else if ((activeTool === 'rectangle' || activeTool === 'circle') && currentShape) {
      setShapes(prev => [...prev, currentShape]);
      setCurrentShape(null);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (tasks.length > 0 || paths.length > 0 || shapes.length > 0 || texts.length > 0) {
        const workflowData = {
          name: 'Auto-saved Workflow',
          tasks,
          connections,
          paths,
          shapes,
          texts,
          timestamp: new Date().toISOString()
        };
        saveToLocalStorage(workflowData);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [tasks, paths, shapes, texts, connections]);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Canvas error caught:', error.message);
      toast({
        title: 'Something went wrong',
        description: 'An error occurred while rendering the canvas. Try refreshing the page.',
        variant: 'destructive',
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    // Load saved workflow from localStorage on first render
    const result = loadFromLocalStorage();
    
    if (result.success) {
      const { tasks: savedTasks, connections: savedConnections, paths: savedPaths, shapes: savedShapes, texts: savedTexts } = result.data;
      setTasks(savedTasks);
      setConnections(savedConnections);
      setPaths(savedPaths);
      setShapes(savedShapes);
      setTexts(savedTexts);
    }
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden">
      <ToolBar 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onClear={handleClear}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onUndo={handleUndo}
        onSave={handleSaveToLocalStorage}
        onExport={handleLoadFromLocalStorage}
      />
      
      <CanvasDropZone 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        zoom={zoom}
      >
        <CanvasInteractions
          activeTool={activeTool}
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          zoom={zoom}
        >
          <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full">
            <CanvasConnections connections={connections} tasks={tasks} />
            <CanvasDrawings 
              paths={paths} 
              currentPath={currentPath}
              isDrawing={isDrawing}
              activeTool={activeTool}
              drawingColor={drawingColor}
              drawingWidth={drawingWidth}
            />
            <CanvasShapes 
              shapes={shapes}
              currentShape={currentShape}
              isDrawing={isDrawing}
              activeTool={activeTool}
            />
            <CanvasTexts texts={texts} />
          </svg>
          
          <CanvasTasks tasks={tasks} onTaskClick={handleTaskClick} />
          
          {popup.isOpen && (
            <CanvasPopup
              position={popup.position}
              onClose={handlePopupClose}
              onImageUpload={handleImageUpload}
              title={popup.taskId === 'extract-text' ? 'Upload Image for Text Extraction' : 'Upload Image'}
            />
          )}
        </CanvasInteractions>
      </CanvasDropZone>
      
      <SavedWorkflows />
    </div>
  );
};

export default CanvasArea;
