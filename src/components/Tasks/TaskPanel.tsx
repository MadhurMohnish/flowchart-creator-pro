
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard, { Task } from './TaskCard';
import { ImageIcon, FileText, Download, Code, ClipboardCheck, FileOutput } from 'lucide-react';

interface TaskPanelProps {
  onTaskClick: (task: Task) => void;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ onTaskClick }) => {
  // Define our sample tasks
  const imageTasks: Task[] = [
    {
      id: 'image-bg-remove',
      title: 'Background Removal',
      description: 'Remove background from images automatically.',
      icon: ImageIcon,
      category: 'image',
      color: 'blue'
    },
    {
      id: 'image-enhancement',
      title: 'Image Enhancement',
      description: 'Improve image quality and lighting.',
      icon: ImageIcon,
      category: 'image',
      color: 'blue'
    },
    {
      id: 'image-replace-bg',
      title: 'Replace Background',
      description: 'Replace image background with a new one.',
      icon: ImageIcon,
      category: 'image',
      color: 'blue'
    }
  ];
  
  const textTasks: Task[] = [
    {
      id: 'text-ocr',
      title: 'OCR Extraction',
      description: 'Convert handwritten notes to text.',
      icon: FileText,
      category: 'text',
      color: 'green'
    },
    {
      id: 'text-summarize',
      title: 'Text Summarization',
      description: 'Create concise summaries from long text.',
      icon: FileText,
      category: 'text',
      color: 'green'
    },
    {
      id: 'text-to-flowchart',
      title: 'Text to Flowchart',
      description: 'Convert text descriptions into flowchart diagrams.',
      icon: FileText,
      category: 'text',
      color: 'green'
    }
  ];
  
  const exportTasks: Task[] = [
    {
      id: 'export-flowchart',
      title: 'Generate Flowchart',
      description: 'Convert text to a flowchart diagram.',
      icon: Download,
      category: 'export',
      color: 'orange'
    },
    {
      id: 'export-pdf',
      title: 'Export to PDF',
      description: 'Create a PDF from your workflow or results.',
      icon: Download,
      category: 'export',
      color: 'orange'
    },
    {
      id: 'export-image',
      title: 'Export to Image',
      description: 'Save your workflow as JPG or PNG.',
      icon: FileOutput,
      category: 'export',
      color: 'orange'
    }
  ];
  
  const developmentTasks: Task[] = [
    {
      id: 'dev-unit-test',
      title: 'Unit Test Generator',
      description: 'Generate unit tests from code.',
      icon: Code,
      category: 'development',
      color: 'purple'
    },
    {
      id: 'dev-syntax-check',
      title: 'Syntax Checker',
      description: 'Validate code syntax and find errors.',
      icon: ClipboardCheck,
      category: 'development',
      color: 'purple'
    }
  ];

  const aiTasks: Task[] = [
    {
      id: 'ai-resume-generator',
      title: 'Resume Generator',
      description: 'Generate professional resumes from your info.',
      icon: FileText,
      category: 'data',
      color: 'red'
    }
  ];

  return (
    <div className="min-w-[300px] w-[300px] border-l border-border/40 p-4 overflow-y-auto animate-slide-up">
      <h2 className="font-medium text-lg mb-4">AI Tasks</h2>
      
      <Tabs defaultValue="image">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="image" className="flex-1">Image</TabsTrigger>
          <TabsTrigger value="text" className="flex-1">Text</TabsTrigger>
          <TabsTrigger value="export" className="flex-1">Export</TabsTrigger>
          <TabsTrigger value="dev" className="flex-1">Dev</TabsTrigger>
          <TabsTrigger value="ai" className="flex-1">AI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="image" className="space-y-3 mt-2">
          {imageTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="text" className="space-y-3 mt-2">
          {textTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="export" className="space-y-3 mt-2">
          {exportTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="dev" className="space-y-3 mt-2">
          {developmentTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-3 mt-2">
          {aiTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick} 
            />
          ))}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 pt-4 border-t border-border/40">
        <h3 className="text-sm font-medium mb-2">How to use</h3>
        <p className="text-xs text-muted-foreground">
          Drag and drop tasks onto the canvas to create your workflow. 
          Connect tasks by placing them near each other. Use drawing tools to annotate your workflow.
        </p>
      </div>
    </div>
  );
};

export default TaskPanel;
