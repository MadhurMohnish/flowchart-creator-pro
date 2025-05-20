
import { Task } from '../Tasks/TaskCard';

export interface CanvasTask {
  task: Task;
  position: { x: number; y: number };
  id: string; // Unique ID for each instance on the canvas
}

export interface DrawingPath {
  path: { x: number; y: number }[];
  tool: ToolType;
  color: string;
  width: number;
}

export interface ShapeElement {
  type: 'rectangle' | 'circle';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  width: number;
}

export interface TextElement {
  position: { x: number; y: number };
  content: string;
  fontSize: number;
  color: string;
}

export interface PopupState {
  isOpen: boolean;
  position: { x: number; y: number };
  taskId: string;
}

export interface Connection {
  start: string;
  end: string;
  id: string;
}

export type ToolType = 'select' | 'pen' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'image' | 'eraser';
