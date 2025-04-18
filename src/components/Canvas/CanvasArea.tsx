
import React, { useEffect } from 'react';
import ToolBar from './ToolBar';
import { Task } from '../Tasks/TaskCard';
import CanvasPopup from './CanvasPopup';
import CanvasConnections from './CanvasConnections';
import CanvasDrawings from './CanvasDrawings';
import CanvasShapes from './CanvasShapes';
import CanvasTexts from './CanvasTexts';
import CanvasTasks from './CanvasTasks';
import CanvasDropZone from './CanvasDropZone';
import CanvasInteractions from './CanvasInteractions';
import SavedWorkflows from './SavedWorkflows';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/canvasUtils';
import { useCanvasState } from './hooks/useCanvasState';
import { useCanvasHandlers } from './hooks/useCanvasHandlers';
import { useCanvasDrawing } from './hooks/useCanvasDrawing';
import { toast } from '@/components/ui/use-toast';

interface CanvasAreaProps {
  onAddTask: (task: Task, position: { x: number; y: number }) => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ onAddTask }) => {
  const {
    zoom,
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
    drawingWidth,
    currentShape,
    setCurrentShape,
    popup,
    setPopup,
    handleZoomIn,
    handleZoomOut,
    handleClear,
    handleUndo
  } = useCanvasState();

  const [activeTool, setActiveTool] = React.useState<'select' | 'pen' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'image'>('select');

  const {
    handleDrop,
    handleTaskClick,
    handleImageUpload,
  } = useCanvasHandlers(tasks, setTasks, setConnections, setPopup, onAddTask);

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasDrawing(
    activeTool,
    setCurrentPath,
    setCurrentShape,
    setPaths,
    setTexts,
    setShapes,
    drawingColor,
    drawingWidth
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePopupClose = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
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
