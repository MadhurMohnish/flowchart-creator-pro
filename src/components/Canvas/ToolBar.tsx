
import React from 'react';
import { 
  Pointer, 
  Pen, 
  Square, 
  Circle, 
  Type, 
  ArrowRight, 
  Image, 
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Download,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

export type ToolType = 'select' | 'pen' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'image';

interface ToolBarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  onSave?: () => void;
  onExport?: () => void;
}

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon: Icon, label, isActive = false, onClick }) => (
  <TooltipProvider>
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button 
          className={cn("tool-button", isActive && "active")}
          onClick={onClick}
          aria-label={label}
        >
          <Icon className="h-5 w-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ToolBar: React.FC<ToolBarProps> = ({ 
  activeTool, 
  setActiveTool, 
  onClear, 
  onZoomIn, 
  onZoomOut, 
  onUndo,
  onSave,
  onExport
}) => {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2 rounded-xl glass-panel animate-slide-up z-10">
      <div className="space-y-2 pb-2 border-b border-border/40">
        <ToolButton 
          icon={Pointer} 
          label="Select" 
          isActive={activeTool === 'select'} 
          onClick={() => setActiveTool('select')} 
        />
        <ToolButton 
          icon={Pen} 
          label="Draw" 
          isActive={activeTool === 'pen'} 
          onClick={() => setActiveTool('pen')} 
        />
        <ToolButton 
          icon={Square} 
          label="Rectangle" 
          isActive={activeTool === 'rectangle'} 
          onClick={() => setActiveTool('rectangle')} 
        />
        <ToolButton 
          icon={Circle} 
          label="Circle" 
          isActive={activeTool === 'circle'} 
          onClick={() => setActiveTool('circle')} 
        />
        <ToolButton 
          icon={Type} 
          label="Text" 
          isActive={activeTool === 'text'} 
          onClick={() => setActiveTool('text')} 
        />
        <ToolButton 
          icon={ArrowRight} 
          label="Arrow" 
          isActive={activeTool === 'arrow'} 
          onClick={() => setActiveTool('arrow')} 
        />
        <ToolButton 
          icon={Image} 
          label="Image" 
          isActive={activeTool === 'image'} 
          onClick={() => setActiveTool('image')} 
        />
      </div>
      
      <div className="space-y-2 pb-2 border-b border-border/40">
        <ToolButton icon={ZoomIn} label="Zoom In" onClick={onZoomIn} />
        <ToolButton icon={ZoomOut} label="Zoom Out" onClick={onZoomOut} />
        <ToolButton icon={RotateCcw} label="Undo" onClick={onUndo} />
      </div>
      
      <div className="space-y-2">
        <ToolButton icon={Save} label="Save" onClick={onSave || (() => {})} />
        <ToolButton icon={Download} label="Export" onClick={onExport || (() => {})} />
        <ToolButton icon={Trash2} label="Clear" onClick={onClear} />
      </div>
    </div>
  );
};

export default ToolBar;
