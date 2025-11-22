import React from 'react';

interface VibeLoaderProps {
  status: string;
}

export const VibeLoader: React.FC<VibeLoaderProps> = ({ status }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-ruka-purple/30 rounded-full animate-ping"></div>
        <div className="absolute inset-0 border-4 border-t-ruka-green border-r-transparent border-b-ruka-purple border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🦌</span>
        </div>
      </div>
      <p className="font-mono text-ruka-green animate-pulse text-sm uppercase tracking-widest">
        {status === 'THINKING' ? 'Cooking up responses...' : 'Rendering 4K Snow...'}
      </p>
    </div>
  );
};
