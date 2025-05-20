
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Task } from '../../Tasks/TaskCard';
import { CanvasTask, PopupState } from '../types';
import { calculateDistance } from '../utils/canvasUtils';
import { v4 as uuidv4 } from 'uuid';

export const useCanvasHandlers = (
  tasks: CanvasTask[],
  setTasks: React.Dispatch<React.SetStateAction<CanvasTask[]>>,
  setConnections: React.Dispatch<React.SetStateAction<{ start: string; end: string; id: string }[]>>,
  setPopup: React.Dispatch<React.SetStateAction<PopupState>>,
  onAddTask: (task: Task, position: { x: number; y: number }) => void
) => {
  const navigate = useNavigate();

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
      const taskId = `${task.id}-${uuidv4().substring(0, 8)}`;
      
      const newTask = {
        task,
        position,
        id: taskId
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
          position: { x: position.x + 110, y: position.y - 50 },
          taskId: task.id,
        });
      }
      
      if (tasks.length > 0) {
        try {
          // Find tasks that are above this one
          const tasksAbove = tasks.filter(t => 
            t.position.y < position.y && 
            Math.abs(t.position.x - position.x) < 200
          );
          
          if (tasksAbove.length > 0) {
            // Sort by vertical distance
            tasksAbove.sort((a, b) => 
              Math.abs(position.y - a.position.y) - Math.abs(position.y - b.position.y)
            );
            
            const nearestTask = tasksAbove[0];
            const connectionId = `conn-${uuidv4().substring(0, 8)}`;
            
            setConnections(prev => [...prev, { 
              start: nearestTask.id, 
              end: taskId,
              id: connectionId
            }]);
            
            toast({
              title: 'Connection created',
              description: `Connected ${nearestTask.task.title} to ${task.title}`,
            });
          }
        } catch (error) {
          console.error("Error adding connection:", error);
        }
      }
      
      return taskId;
    } catch (error) {
      console.error('Error processing dropped task:', error);
      toast({
        title: 'Error',
        description: 'Could not add task to canvas. Please try again.',
        variant: 'destructive',
      });
      return '';
    }
  };

  const handleTaskClick = (taskId: string, position: { x: number; y: number }) => {
    const matchingTask = tasks.find(t => t.id.startsWith(taskId));
    if (!matchingTask) return;
    
    if (taskId === 'extract-text') {
      setPopup({
        isOpen: true,
        position,
        taskId,
      });
    } else {
      toast({
        title: 'Task selected',
        description: `${matchingTask.task.title} configuration will be available in a future update.`,
      });
    }
  };

  const handleImageUpload = (file: File) => {
    toast({
      title: 'Image uploaded',
      description: 'Processing your image...',
    });
    
    setPopup(prevPopup => {
      if (prevPopup.taskId === 'extract-text') {
        const reader = new FileReader();
        reader.onload = () => {
          sessionStorage.setItem('ocrImage', reader.result as string);
          setPopup(prev => ({ ...prev, isOpen: false }));
          navigate('/', { state: { selectedTaskId: 'extract-text' } });
        };
        reader.readAsDataURL(file);
      }
      
      return prevPopup;
    });
  };

  return {
    handleDrop,
    handleTaskClick,
    handleImageUpload,
  };
};
