
import React, { useEffect, useState } from 'react';
import { GlobeProvider } from '@/context/GlobeContext';
import Globe from '@/components/Globe';
import Controls from '@/components/Controls';
import InfoPanel from '@/components/InfoPanel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  
  useEffect(() => {
    // Welcome toast notification
    setTimeout(() => {
      toast({
        title: 'Welcome to Earth Visualization',
        description: 'Explore global weather patterns in real-time. Drag to rotate the globe.',
        duration: 5000,
      });
    }, 1000);
    
    // Show info panel after a delay
    const infoTimer = setTimeout(() => {
      setShowInfo(true);
    }, 2000);
    
    return () => {
      clearTimeout(infoTimer);
    };
  }, []);
  
  return (
    <GlobeProvider>
      <div className="min-h-screen overflow-hidden relative">
        <Globe />
        <Header />
        <Controls />
        {showInfo && <InfoPanel />}
        <Footer />
      </div>
    </GlobeProvider>
  );
};

export default Index;
