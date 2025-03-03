
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Share2, 
  Download, 
  Settings, 
  HelpCircle,
  LucideIcon 
} from 'lucide-react';

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
    console.log('Saving workflow...');
    // Implementation will be added later
  };

  const handleShare = () => {
    console.log('Sharing workflow...');
    // Implementation will be added later
  };

  const handleExport = () => {
    console.log('Exporting workflow...');
    // Implementation will be added later
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    // Implementation will be added later
  };

  const handleHelp = () => {
    console.log('Opening help...');
    // Implementation will be added later
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
