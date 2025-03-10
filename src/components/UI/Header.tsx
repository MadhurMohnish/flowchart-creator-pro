
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Share2, 
  Download, 
  Settings, 
  HelpCircle,
  Upload,
  LucideIcon 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface HeaderButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ icon: Icon, label, onClick }) => (
  <Button 
    variant="ghost" 
    size="sm" 
    onClick={onClick}
    className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-secondary"
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </Button>
);

const Header: React.FC = () => {
  const handleSave = () => {
    // Save workflow to localStorage
    const workflow = localStorage.getItem('flowAI_workflow');
    if (workflow) {
      localStorage.setItem('flowAI_workflow', workflow);
      toast({
        title: 'Workflow saved',
        description: 'Your workflow has been saved to browser storage.',
      });
    } else {
      toast({
        title: 'Nothing to save',
        description: 'Add some tasks to your canvas first.',
      });
    }
  };

  const handleLoad = () => {
    // Load workflow from localStorage
    const workflow = localStorage.getItem('flowAI_workflow');
    if (workflow) {
      try {
        // Parse to validate JSON
        JSON.parse(workflow);
        // We just validated it, the CanvasArea component does the actual loading
        toast({
          title: 'Workflow loaded',
          description: 'Your workflow has been loaded from browser storage.',
        });
        // Reload the page to load the workflow
        window.location.reload();
      } catch (error) {
        toast({
          title: 'Error loading workflow',
          description: 'The saved workflow is invalid or corrupted.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'No workflow found',
        description: 'No saved workflow found in browser storage.',
      });
    }
  };

  const handleShare = () => {
    toast({
      title: 'Coming soon',
      description: 'Sharing functionality will be available in a future update.',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Coming soon',
      description: 'Export functionality will be available in a future update.',
    });
  };

  const handleSettings = () => {
    toast({
      title: 'Coming soon',
      description: 'Settings functionality will be available in a future update.',
    });
  };

  const handleHelp = () => {
    toast({
      title: 'Help',
      description: 'Drag AI tasks from the right panel to the canvas. Use the tools on the left for drawing annotations.',
    });
  };

  return (
    <header className="w-full px-4 py-3 border-b border-border/40 flex items-center justify-between animate-fade-in">
      <div className="flex items-center">
        <div className="mr-6">
          <h1 className="text-xl font-medium tracking-tight">Flow AI</h1>
          <p className="text-xs text-muted-foreground">Visual Workflow Automation</p>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <HeaderButton icon={Save} label="Save" onClick={handleSave} />
          <HeaderButton icon={Upload} label="Load" onClick={handleLoad} />
          <HeaderButton icon={Share2} label="Share" onClick={handleShare} />
          <HeaderButton icon={Download} label="Export" onClick={handleExport} />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <HeaderButton icon={Settings} label="Settings" onClick={handleSettings} />
        <HeaderButton icon={HelpCircle} label="Help" onClick={handleHelp} />
      </div>
    </header>
  );
};

export default Header;
