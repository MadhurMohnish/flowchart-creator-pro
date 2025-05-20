
import { useState } from 'react';
import { Task } from '../../Tasks/TaskCard';
import { CanvasTask, DrawingPath, ShapeElement, TextElement, PopupState, Connection } from '../types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useCanvasState = () => {
  const [zoom, setZoom] = useState(1);
  const [tasks, setTasks] = useState<CanvasTask[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
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

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

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
    } else if (connections.length > 0) {
      // Remove the last connection first
      setConnections(connections.slice(0, -1));
    } else if (tasks.length > 0) {
      const lastTask = tasks[tasks.length - 1];
      // Remove connections associated with this task
      setConnections(connections.filter(
        conn => conn.start !== lastTask.id && conn.end !== lastTask.id
      ));
      // Then remove the task
      setTasks(tasks.slice(0, -1));
    }
  };

  return {
    zoom,
    setZoom,
    tasks,
    setTasks,
    connections,
    setConnections,
    currentPath,
    setCurrentPath,
    paths,
    setPaths,
    shapes,
    setShapes,
    texts,
    setTexts,
    isDrawing,
    setIsDrawing,
    drawingColor,
    setDrawingColor,
    drawingWidth,
    setDrawingWidth,
    currentShape,
    setCurrentShape,
    popup,
    setPopup,
    handleZoomIn,
    handleZoomOut,
    handleClear,
    handleUndo
  };
};
