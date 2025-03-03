
import React, { useState, useRef, useEffect } from 'react';
import ToolBar, { ToolType } from './ToolBar';
import TaskCard, { Task } from '../Tasks/TaskCard';
import { toast } from '@/components/ui/use-toast';

interface CanvasAreaProps {
  onAddTask: (task: Task, position: { x: number; y: number }) => void;
}

interface CanvasTask {
  task: Task;
  position: { x: number; y: number };
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ onAddTask }) => {
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [zoom, setZoom] = useState(1);
  const [tasks, setTasks] = useState<CanvasTask[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [connections, setConnections] = useState<{ start: string; end: string }[]>([]);
  
  // Handle zooming
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Handle clearing the canvas
  const handleClear = () => {
    if (tasks.length > 0 || connections.length > 0) {
      if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
        setTasks([]);
        setConnections([]);
        toast({
          title: 'Canvas cleared',
          description: 'All tasks and connections have been removed.',
        });
      }
    }
  };

  // Handle undo (placeholder for now)
  const handleUndo = () => {
    // Will implement actual undo functionality later
    toast({
      title: 'Undo not implemented',
      description: 'Undo functionality will be added in a future update.',
    });
  };

  // Handle task dropping on canvas
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
          
          // Auto-connect with nearest task if exists
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

  // Find the nearest task to a position
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

  // Calculate distance between two points
  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Logic for handling canvas drawing will be implemented in future versions
  
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
      >
        {/* Draw connections between tasks */}
        <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full">
          {connections.map((connection, index) => {
            const startTask = tasks.find(t => t.task.id === connection.start);
            const endTask = tasks.find(t => t.task.id === connection.end);
            
            if (!startTask || !endTask) return null;
            
            const startX = startTask.position.x + 90; // Center of task card
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
        </svg>
        
        {/* Render tasks on canvas */}
        {tasks.map((canvasTask, index) => (
          <TaskCard
            key={`canvas-task-${canvasTask.task.id}-${index}`}
            task={canvasTask.task}
            position={canvasTask.position}
            isOnCanvas={true}
            onClick={() => {
              // Will implement task configuration in future versions
              toast({
                title: 'Task selected',
                description: `${canvasTask.task.title} configuration will be available in a future update.`,
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CanvasArea;
