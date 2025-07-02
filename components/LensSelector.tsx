import React from 'react';
import { useLens } from '@/hooks/useLens';
import { LENSES } from '@/utils/lenses';

export const LensSelector: React.FC = () => {
  const { lens, setLens } = useLens();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      <div className="text-xs text-gray-500 text-right font-medium">
        Theory Lens
      </div>
      {Object.entries(LENSES).map(([key, config]) => (
        <button
          key={key}
          onClick={() => setLens(key as any)}
          className="lens-chip"
          style={{
            backgroundColor: lens === key 
              ? config.primaryColor 
              : `${config.primaryColor}80`, // 50% opacity when inactive
          }}
          data-active={lens === key}
          title={config.description}
        >
          <span className="text-lg">{config.emoji}</span>
          <span className="font-semibold">{key}</span>
        </button>
      ))}
      
      {/* Theory description tooltip */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 max-w-48 border border-white/20">
        <div className="font-semibold text-gray-800 mb-1">
          {LENSES[lens].emoji} {LENSES[lens].title}
        </div>
        <div>{LENSES[lens].description}</div>
      </div>
    </div>
  );
};