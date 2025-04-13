
import React from 'react';
import { TextElement } from './types';

interface CanvasTextsProps {
  texts: TextElement[];
}

const CanvasTexts: React.FC<CanvasTextsProps> = ({ texts }) => {
  return (
    <>
      {texts.map((textEl, index) => (
        <text
          key={`text-${index}`}
          x={textEl.position.x}
          y={textEl.position.y}
          fontSize={textEl.fontSize}
          fill={textEl.color}
          style={{ userSelect: 'none' }}
        >
          {textEl.content}
        </text>
      ))}
    </>
  );
};

export default CanvasTexts;
