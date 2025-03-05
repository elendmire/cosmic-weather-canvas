
import React from 'react';
import { useGlobe } from '@/context/GlobeContext';
import { DATA_LABELS } from '@/lib/constants';

const Header: React.FC = () => {
  const { dataType } = useGlobe();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-10 glass-panel py-2 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-xl font-light tracking-wide">Earth</div>
        <div className="h-4 w-px bg-white/10" />
        <div className="text-sm font-light text-muted-foreground">
          Global {DATA_LABELS[dataType]} Visualization
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground hidden sm:block">
        {new Date().toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </header>
  );
};

export default Header;
