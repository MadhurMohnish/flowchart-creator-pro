import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Task } from '../../Tasks/TaskCard';
import { CanvasTask, PopupState } from '../types';
import { calculateDistance } from '../utils/canvasUtils';

export const useCanvasHandlers = (
  tasks: CanvasTask[],
  setTasks: React.Dispatch<React.SetStateAction<CanvasTask[]>>,
  setConnections: React.Dispatch<React.SetStateAction<{ start: string; end: string }[]>>,
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
    
    setPopup(prevPopup => {
      if (prevPopup.taskId === 'extract-text') {
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
      
      return prevPopup;
    });
  };

  return {
    handleDrop,
    handleTaskClick,
    handleImageUpload,
  };
};
