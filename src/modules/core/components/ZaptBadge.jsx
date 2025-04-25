import React from 'react';

export function ZaptBadge() {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <a 
        href="https://www.zapt.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs font-medium text-text-light hover:text-primary transition-colors"
      >
        Made on ZAPT
      </a>
    </div>
  );
}