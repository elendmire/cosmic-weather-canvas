
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-20 sm:bottom-24 right-6 z-10 glass-panel py-1 px-3 flex items-center text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <div>
          Data visualization inspired by Earth.nullschool.net
        </div>
      </div>
    </footer>
  );
};

export default Footer;
