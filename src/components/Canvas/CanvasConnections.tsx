
import React from 'react';
import { CanvasTask, Connection } from './types';

interface CanvasConnectionsProps {
  connections: Connection[];
  tasks: CanvasTask[];
}

const CanvasConnections: React.FC<CanvasConnectionsProps> = ({ connections, tasks }) => {
  return (
    <>
      {connections.map((connection) => {
        const startTask = tasks.find(t => t.id === connection.start);
        const endTask = tasks.find(t => t.id === connection.end);
        
        if (!startTask || !endTask) return null;
        
        const startX = startTask.position.x + 110; // Center of the card
        const startY = startTask.position.y + 70; // Bottom connection point
        const endX = endTask.position.x + 110; // Center of the card
        const endY = endTask.position.y; // Top connection point
        
        // Calculate control points for the bezier curve
        const midY = (startY + endY) / 2;
        const controlPoint1Y = startY + Math.min(80, (endY - startY) / 2);
        const controlPoint2Y = endY - Math.min(80, (endY - startY) / 2);
        
        return (
          <g key={connection.id}>
            <path
              d={`M ${startX} ${startY} C ${startX} ${controlPoint1Y}, ${endX} ${controlPoint2Y}, ${endX} ${endY}`}
              fill="none"
              stroke="rgba(100, 116, 139, 0.5)"
              strokeWidth="2"
              className="connection-line"
            />
            
            {/* Circle at the end of the connection */}
            <circle 
              cx={endX} 
              cy={endY} 
              r="3" 
              fill="rgba(100, 116, 139, 0.8)" 
            />
          </g>
        );
      })}
    </>
  );
};

export default CanvasConnections;
