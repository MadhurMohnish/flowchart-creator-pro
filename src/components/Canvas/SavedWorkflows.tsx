
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface SavedWorkflow {
  id: string;
  name: string;
  timestamp: string;
  preview?: string;
}

const SavedWorkflows = () => {
  const [open, setOpen] = useState(false);
  const [workflows, setWorkflows] = useState<SavedWorkflow[]>([]);

  useEffect(() => {
    const handleShowDialog = () => {
      loadWorkflows();
      setOpen(true);
    };

    window.addEventListener('showSavedWorkflows', handleShowDialog);
    return () => window.removeEventListener('showSavedWorkflows', handleShowDialog);
  }, []);

  const loadWorkflows = () => {
    const savedWorkflow = localStorage.getItem('flowAI_workflow');
    
    if (savedWorkflow) {
      try {
        const workflow = JSON.parse(savedWorkflow);
        const workflowList: SavedWorkflow[] = [{
          id: 'default',
          name: 'Default Workflow',
          timestamp: workflow.timestamp || new Date().toISOString(),
          preview: generatePreviewFromWorkflow(workflow)
        }];
        
        // Check for additional saved workflows
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('flowAI_workflow_')) {
            try {
              const additionalWorkflow = JSON.parse(localStorage.getItem(key) || '');
              const id = key.replace('flowAI_workflow_', '');
              workflowList.push({
                id,
                name: additionalWorkflow.name || `Workflow ${id}`,
                timestamp: additionalWorkflow.timestamp || new Date().toISOString(),
                preview: generatePreviewFromWorkflow(additionalWorkflow)
              });
            } catch (error) {
              console.error(`Error parsing workflow ${key}:`, error);
            }
          }
        }
        
        // Sort by most recent
        workflowList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setWorkflows(workflowList);
      } catch (error) {
        console.error('Error loading workflows:', error);
        toast({
          title: 'Error loading workflows',
          description: 'Failed to load saved workflows.',
          variant: 'destructive',
        });
      }
    } else {
      setWorkflows([]);
    }
  };

  const generatePreviewFromWorkflow = (workflow: any): string => {
    // This is a simplified preview, in a real app you'd generate a thumbnail
    return workflow.tasks?.length > 0 ? 
      `${workflow.tasks.length} tasks, ${workflow.connections?.length || 0} connections` : 
      'Empty workflow';
  };

  const handleLoadWorkflow = (id: string) => {
    try {
      let workflow;
      
      if (id === 'default') {
        workflow = localStorage.getItem('flowAI_workflow');
      } else {
        workflow = localStorage.getItem(`flowAI_workflow_${id}`);
      }
      
      if (workflow) {
        // Set as current workflow
        localStorage.setItem('flowAI_workflow', workflow);
        
        toast({
          title: 'Workflow loaded',
          description: 'Your workflow has been loaded successfully.',
        });
        
        // Close dialog and reload page to show the loaded workflow
        setOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error loading workflow:', error);
      toast({
        title: 'Load failed',
        description: 'Could not load the selected workflow.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteWorkflow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the load action
    
    try {
      if (id === 'default') {
        localStorage.removeItem('flowAI_workflow');
      } else {
        localStorage.removeItem(`flowAI_workflow_${id}`);
      }
      
      toast({
        title: 'Workflow deleted',
        description: 'Your workflow has been deleted.',
      });
      
      loadWorkflows();
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast({
        title: 'Delete failed',
        description: 'Could not delete the selected workflow.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Saved Workflows</DialogTitle>
          <DialogDescription>
            Your previously saved workflows. Click on one to load it.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] p-4 rounded-md border">
          {workflows.length > 0 ? (
            <div className="space-y-2">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  onClick={() => handleLoadWorkflow(workflow.id)}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{workflow.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(workflow.timestamp), { addSuffix: true })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{workflow.preview}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteWorkflow(workflow.id, e)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-muted-foreground">No saved workflows found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some tasks to your canvas and click the Save button to save your workflow.
              </p>
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedWorkflows;
