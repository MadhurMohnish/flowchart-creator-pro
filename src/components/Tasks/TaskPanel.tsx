import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Search,
  ImageIcon,
  Type,
  Database,
  Share2,
  Code,
  X,
} from 'lucide-react';
import TaskCard, { Task } from './TaskCard';
import BackgroundRemovalCard from './BackgroundRemovalCard';
import ExtractTextCard from './ExtractTextCard';

// Sample task data for demonstration
const imageTasks: Task[] = [
  {
    id: 'resize-image',
    title: 'Resize Image',
    description: 'Resize images to specific dimensions',
    icon: ImageIcon,
    category: 'image',
    color: 'blue',
  },
  {
    id: 'crop-image',
    title: 'Crop Image',
    description: 'Crop images to selected area',
    icon: ImageIcon,
    category: 'image',
    color: 'blue',
  },
];

const textTasks: Task[] = [
  {
    id: 'translate-text',
    title: 'Translate Text',
    description: 'Translate text between languages',
    icon: Type,
    category: 'text',
    color: 'green',
  },
];

const dataTasks: Task[] = [
  {
    id: 'csv-parser',
    title: 'CSV Parser',
    description: 'Parse CSV files into structured data',
    icon: Database,
    category: 'data',
    color: 'purple',
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format and validate JSON data',
    icon: Database,
    category: 'data',
    color: 'purple',
  },
];

const exportTasks: Task[] = [
  {
    id: 'export-pdf',
    title: 'Export to PDF',
    description: 'Export workflow results to PDF',
    icon: Share2,
    category: 'export',
    color: 'orange',
  },
  {
    id: 'export-api',
    title: 'Export to API',
    description: 'Send workflow results to external API',
    icon: Share2,
    category: 'export',
    color: 'orange',
  },
];

const devTasks: Task[] = [
  {
    id: 'custom-code',
    title: 'Custom Code',
    description: 'Run custom JavaScript code',
    icon: Code,
    category: 'development',
    color: 'red',
  },
  {
    id: 'webhook',
    title: 'Webhook',
    description: 'Trigger or consume webhooks',
    icon: Code,
    category: 'development',
    color: 'red',
  },
];

const allTasks = [
  ...imageTasks,
  ...textTasks,
  ...dataTasks,
  ...exportTasks,
  ...devTasks,
];

interface TaskPanelProps {
  onTaskClick: (task: Task) => void;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ onTaskClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredTasks = allTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <div className="h-full w-80 border-l border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 border-b border-border/40">
        <h2 className="text-lg font-medium">Tasks</h2>
        <p className="text-xs text-muted-foreground">Drag tasks to the canvas</p>
        
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8 pr-8"
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {searchQuery ? (
        <ScrollArea className="h-[calc(100%-8rem)]">
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-medium">Search Results</h3>
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={onTaskClick}
                />
              ))}
              {filteredTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No results found.</p>
              )}
            </div>
          </div>
        </ScrollArea>
      ) : (
        <Tabs defaultValue="image" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border/40 bg-transparent px-4">
            <TabsTrigger value="image" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <ImageIcon className="mr-2 h-4 w-4" />
              Image
            </TabsTrigger>
            <TabsTrigger value="text" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Type className="mr-2 h-4 w-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="data" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Database className="mr-2 h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(100%-8rem)]">
            <TabsContent value="image" className="p-4 space-y-4 mt-0">
              <div className="space-y-2">
                <BackgroundRemovalCard onClick={onTaskClick} />
                {imageTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={onTaskClick}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="p-4 space-y-4 mt-0">
              <div className="space-y-2">
                <ExtractTextCard onClick={onTaskClick} />
                {textTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={onTaskClick}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="p-4 space-y-4 mt-0">
              <div className="space-y-2">
                {dataTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={onTaskClick}
                  />
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </div>
  );
};

export default TaskPanel;
