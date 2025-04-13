
import React from 'react';
import { CanvasTask } from './types';

interface CanvasConnectionsProps {
  connections: { start: string; end: string }[];
  tasks: CanvasTask[];
}

const CanvasConnections: React.FC<CanvasConnectionsProps> = ({ connections, tasks }) => {
  return (
    <>
      {connections.map((connection, index) => {
        const startTask = tasks.find(t => t.task.id === connection.start);
        const endTask = tasks.find(t => t.task.id === connection.end);
        
        if (!startTask || !endTask) return null;
        
        const startX = startTask.position.x + 90;
        const startY = startTask.position.y + 25;
        const endX = endTask.position.x;
        const endY = endTask.position.y + 25;
        
        return (
          <g key={`connection-${index}`}>
            <path
              d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
              fill="none"
              stroke="rgba(90, 162, 245, 0.6)"
              strokeWidth="2"
              className="connection-line"
            />
            <circle 
              cx={endX} 
              cy={endY} 
              r="3" 
              fill="rgba(90, 162, 245, 0.9)" 
            />
          </g>
        );
      })}
    </>
  );
};

export default CanvasConnections;
