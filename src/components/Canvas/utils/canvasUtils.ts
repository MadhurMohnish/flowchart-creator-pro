
export const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const saveToLocalStorage = (data: any) => {
  const workflow = {
    ...data,
    timestamp: new Date().toISOString()
  };
  
  try {
    localStorage.setItem('flowAI_workflow', JSON.stringify(workflow));
    return { success: true };
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return { success: false, error };
  }
};

export const loadFromLocalStorage = () => {
  try {
    const savedWorkflow = localStorage.getItem('flowAI_workflow');
    if (!savedWorkflow) {
      return { success: false, error: 'No saved workflow found' };
    }
    
    return { 
      success: true, 
      data: JSON.parse(savedWorkflow) 
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return { success: false, error };
  }
};
