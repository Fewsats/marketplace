import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute hidden group-hover:block bg-gray-800 text-white p-2 rounded text-xs whitespace-normal bottom-full left-1/2 transform mb-1 w-36">
        {content}
      </div>
    </div>
  );
}