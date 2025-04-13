import React, { useState, useRef, useEffect } from 'react';
import ToolBar, { ToolType } from './ToolBar';
import TaskCard, { Task } from '../Tasks/TaskCard';
import CanvasPopup from './CanvasPopup';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface CanvasAreaProps {
  onAddTask: (task: Task, position: { x: number; y: number }) => void;
}

interface CanvasTask {
  task: Task;
  position: { x: number; y: number };
}

interface DrawingPath {
  path: { x: number; y: number }[];
  tool: ToolType;
  color: string;
  width: number;
}

interface ShapeElement {
  type: 'rectangle' | 'circle';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  width: number;
}

interface TextElement {
  position: { x: number; y: number };
  content: string;
  fontSize: number;
  color: string;
}

interface PopupState {
  isOpen: boolean;
  position: { x: number; y: number };
  taskId: string;
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData('task');
    
    if (taskData) {
      try {
        const task = JSON.parse(taskData) as Task;
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        
        if (canvasRect) {
          const x = (e.clientX - canvasRect.left) / zoom;
          const y = (e.clientY - canvasRect.top) / zoom;
          
          const newTask = {
            task,
            position: { x, y }
          };
          
          setTasks(prev => [...prev, newTask]);
          onAddTask(task, { x, y });
          
          if (task.id === 'extract-text') {
            setPopup({
              isOpen: true,
              position: { x: x + 100, y: y - 50 },
              taskId: task.id,
            });
          }
          
          if (tasks.length > 0) {
            const nearestTask = findNearestTask({ x, y });
            if (nearestTask && calculateDistance(nearestTask.position, { x, y }) < 200) {
              setConnections(prev => [...prev, { 
                start: nearestTask.task.id, 
                end: task.id 
              }]);
            }
          }
        }
      } catch (error) {
        console.error('Error adding task to canvas:', error);
      }
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

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const currentPathToSvgPath = () => {
    if (currentPath.length < 2) return '';
    
    return currentPath.reduce((path, point, index) => {
      return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
    }, '');
  };

  const saveToLocalStorage = () => {
    const workflow = {
      tasks,
      connections,
      paths,
      shapes,
      texts,
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('flowAI_workflow', JSON.stringify(workflow));
      toast({
        title: 'Workflow saved',
        description: 'Your workflow has been saved to browser storage.'
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        title: 'Save failed',
        description: 'Failed to save workflow. Your browser storage might be full.',
        variant: 'destructive'
      });
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedWorkflow = localStorage.getItem('flowAI_workflow');
      if (savedWorkflow) {
        const { tasks: savedTasks, connections: savedConnections, paths: savedPaths, shapes: savedShapes, texts: savedTexts } = JSON.parse(savedWorkflow);
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
          description: 'No saved workflow found in browser storage.'
        });
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      toast({
        title: 'Load failed',
        description: 'Failed to load workflow.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (tasks.length > 0 || paths.length > 0 || shapes.length > 0 || texts.length > 0) {
        saveToLocalStorage();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [tasks, paths, shapes, texts]);

  const handlePopupClose = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
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

  return (
    <div className="flex-1 relative overflow-hidden">
      <ToolBar 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onClear={handleClear}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onUndo={handleUndo}
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
          {connections.map((connection, index) => {
            const startTask = tasks.find(t => t.task.id === connection.start);
            const endTask = tasks.find(t => t.task.id === connection.end);
            
            if (!startTask || !endTask) return null;
            
            const startX = startTask.position.x + 90;
            const startY = startTask.position.y + 25;
            const endX = endTask.position.x;
            const endY = endTask.position.y + 25;
            
            return (
              <g key={`connection-${index}`}>
                <path
                  d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke="rgba(90, 162, 245, 0.6)"
                  strokeWidth="2"
                  className="connection-line"
                />
                <circle 
                  cx={endX} 
                  cy={endY} 
                  r="3" 
                  fill="rgba(90, 162, 245, 0.9)" 
                />
              </g>
            );
          })}
          
          {paths.map((pathObj, index) => (
            <path
              key={`drawing-path-${index}`}
              d={pathObj.path.reduce((pathData, point, i) => (
                pathData + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`)
              ), '')}
              stroke={pathObj.color}
              strokeWidth={pathObj.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          
          {isDrawing && activeTool === 'pen' && (
            <path
              d={currentPathToSvgPath()}
              stroke={drawingColor}
              strokeWidth={drawingWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {shapes.map((shape, index) => (
            shape.type === 'rectangle' ? (
              <rect
                key={`shape-rect-${index}`}
                x={Math.min(shape.startX, shape.endX)}
                y={Math.min(shape.startY, shape.endY)}
                width={Math.abs(shape.endX - shape.startX)}
                height={Math.abs(shape.endY - shape.startY)}
                stroke={shape.color}
                strokeWidth={shape.width}
                fill="none"
              />
            ) : (
              <ellipse
                key={`shape-circle-${index}`}
                cx={(shape.startX + shape.endX) / 2}
                cy={(shape.startY + shape.endY) / 2}
                rx={Math.abs(shape.endX - shape.startX) / 2}
                ry={Math.abs(shape.endY - shape.startY) / 2}
                stroke={shape.color}
                strokeWidth={shape.width}
                fill="none"
              />
            )
          ))}
          
          {isDrawing && (activeTool === 'rectangle' || activeTool === 'circle') && currentShape && (
            currentShape.type === 'rectangle' ? (
              <rect
                x={Math.min(currentShape.startX, currentShape.endX)}
                y={Math.min(currentShape.startY, currentShape.endY)}
                width={Math.abs(currentShape.endX - currentShape.startX)}
                height={Math.abs(currentShape.endY - currentShape.startY)}
                stroke={currentShape.color}
                strokeWidth={currentShape.width}
                fill="none"
              />
            ) : (
              <ellipse
                cx={(currentShape.startX + currentShape.endX) / 2}
                cy={(currentShape.startY + currentShape.endY) / 2}
                rx={Math.abs(currentShape.endX - currentShape.startX) / 2}
                ry={Math.abs(currentShape.endY - currentShape.startY) / 2}
                stroke={currentShape.color}
                strokeWidth={currentShape.width}
                fill="none"
              />
            )
          )}
          
          {texts.map((textEl, index) => (
            <text
              key={`text-${index}`}
              x={textEl.position.x}
              y={textEl.position.y}
              fontSize={textEl.fontSize}
              fill={textEl.color}
              style={{ userSelect: 'none' }}
            >
              {textEl.content}
            </text>
          ))}
        </svg>
        
        {tasks.map((canvasTask, index) => (
          <TaskCard
            key={`canvas-task-${canvasTask.task.id}-${index}`}
            task={canvasTask.task}
            position={canvasTask.position}
            isOnCanvas={true}
            onClick={() => {
              if (canvasTask.task.id === 'extract-text') {
                setPopup({
                  isOpen: true,
                  position: { 
                    x: canvasTask.position.x + 100, 
                    y: canvasTask.position.y - 50 
                  },
                  taskId: canvasTask.task.id,
                });
              } else {
                toast({
                  title: 'Task selected',
                  description: `${canvasTask.task.title} configuration will be available in a future update.`,
                });
              }
            }}
          />
        ))}
        
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
