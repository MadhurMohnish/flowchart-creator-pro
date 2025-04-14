import React, { useState, useRef, useEffect } from 'react';
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
  const canvasRef = useRef<HTMLDivElement>(null);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData('task');
    
    if (!taskData) {
      console.log("No task data found in drop event");
      return;
    }
    
    try {
      const task = JSON.parse(taskData) as Task;
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (!canvasRect) {
        console.log("Canvas reference not available");
        return;
      }
      
      const x = (e.clientX - canvasRect.left) / zoom;
      const y = (e.clientY - canvasRect.top) / zoom;
      
      const newTask = {
        task,
        position: { x, y }
      };
      
      setTasks(prev => [...prev, newTask]);
      
      try {
        onAddTask(task, { x, y });
      } catch (error) {
        console.error("Error in onAddTask callback:", error);
      }
      
      if (task.id === 'extract-text') {
        setPopup({
          isOpen: true,
          position: { x: x + 100, y: y - 50 },
          taskId: task.id,
        });
      }
      
      if (tasks.length > 0) {
        try {
          const nearestTask = findNearestTask({ x, y });
          if (nearestTask && calculateDistance(nearestTask.position, { x, y }) < 200) {
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || activeTool === 'select') return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const x = (e.clientX - canvasRect.left) / zoom;
    const y = (e.clientY - canvasRect.top) / zoom;
    
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'select') return;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const x = (e.clientX - canvasRect.left) / zoom;
    const y = (e.clientY - canvasRect.top) / zoom;
    
    setIsDrawing(true);
    
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

  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSaveToLocalStorage = () => {
    const result = saveToLocalStorage({
      tasks,
      connections,
      paths,
      shapes,
      texts
    });
    
    if (result.success) {
      toast({
        title: 'Workflow saved',
        description: 'Your workflow has been saved to browser storage.'
      });
    } else {
      toast({
        title: 'Save failed',
        description: 'Failed to save workflow. Your browser storage might be full.',
        variant: 'destructive'
      });
    }
  };

  const handleLoadFromLocalStorage = () => {
    const result = loadFromLocalStorage();
    
    if (result.success) {
      const { tasks: savedTasks, connections: savedConnections, paths: savedPaths, shapes: savedShapes, texts: savedTexts } = result.data;
      setTasks(savedTasks);
      setConnections(savedConnections);
      setPaths(savedPaths);
      setShapes(savedShapes);
      setTexts(savedTexts);
      toast({
        title: 'Workflow loaded',
        description: 'Your workflow has been loaded from browser storage.'
      });
    } else {
      toast({
        title: 'No workflow found',
        description: result.error || 'Error loading workflow',
        variant: 'destructive'
      });
    }
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (tasks.length > 0 || paths.length > 0 || shapes.length > 0 || texts.length > 0) {
        handleSaveToLocalStorage();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [tasks, paths, shapes, texts]);

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
      
      <div 
        ref={canvasRef}
        className="w-full h-full canvas-grid bg-canvas-background"
        style={{ 
          transform: `scale(${zoom})`,
          transformOrigin: 'center',
          transition: 'transform 0.2s ease-out'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
      </div>
    </div>
  );
};

export default CanvasArea;
