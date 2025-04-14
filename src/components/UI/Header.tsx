
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
import { UserAvatar } from '@/components/Auth/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { exportCanvasAsImage } from '@/utils/canvasExport';

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
  const { user } = useAuth();

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
    // Show saved workflows dialog
    const savedWorkflowsEvent = new CustomEvent('showSavedWorkflows');
    window.dispatchEvent(savedWorkflowsEvent);
  };

  const handleShare = () => {
    toast({
      title: 'Coming soon',
      description: 'Sharing functionality will be available in a future update.',
    });
  };

  const handleExport = () => {
    exportCanvasAsImage();
  };

  const handleSettings = () => {
    toast({
      title: 'Coming soon',
      description: 'Settings functionality will be available in a future update.',
    });
  };

  const handleHelp = () => {
    // Redirect to GitHub repository
    window.open('https://github.com/flow-ai/flow-ai', '_blank');
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
        {user ? (
          <Link to="/profile">
            <UserAvatar />
          </Link>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link to="/auth">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
