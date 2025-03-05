
import React from 'react';
import { useGlobe } from '@/context/GlobeContext';
import { DATA_TYPES, DATA_LABELS, PROJECTION_TYPES } from '@/lib/constants';
import { 
  Wind, 
  Thermometer, 
  Waves, 
  BarChart3, 
  Globe as GlobeIcon, 
  Map, 
  Pause, 
  Play,
  Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Controls: React.FC = () => {
  const { 
    dataType, 
    setDataType, 
    projectionType, 
    setProjectionType, 
    rotating, 
    setRotating, 
    date, 
    setDate 
  } = useGlobe();
  
  const handleDateChange = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
  };
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 glass-panel py-2 px-3 flex items-center gap-1 sm:gap-2">
      <div className="flex items-center gap-1 mr-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`control-button ${dataType === DATA_TYPES.WIND ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => setDataType(DATA_TYPES.WIND)}
              >
                <Wind size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Wind Patterns</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`control-button ${dataType === DATA_TYPES.TEMP ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => setDataType(DATA_TYPES.TEMP)}
              >
                <Thermometer size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Temperature</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`control-button ${dataType === DATA_TYPES.OCEAN ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => setDataType(DATA_TYPES.OCEAN)}
              >
                <Waves size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ocean Currents</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`control-button ${dataType === DATA_TYPES.PRESSURE ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => setDataType(DATA_TYPES.PRESSURE)}
              >
                <BarChart3 size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Air Pressure</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="h-6 w-px bg-white/10 mx-1 sm:mx-2" />
      
      <div className="flex items-center gap-1 mr-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`control-button ${projectionType === PROJECTION_TYPES.ORTHOGRAPHIC ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => setProjectionType(PROJECTION_TYPES.ORTHOGRAPHIC)}
              >
                <GlobeIcon size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>3D Globe View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`control-button ${projectionType === PROJECTION_TYPES.EQUIRECTANGULAR ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => setProjectionType(PROJECTION_TYPES.EQUIRECTANGULAR)}
              >
                <Map size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Flat Map View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="h-6 w-px bg-white/10 mx-1 sm:mx-2" />
      
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="control-button"
                onClick={() => setRotating(!rotating)}
              >
                {rotating ? <Pause size={18} /> : <Play size={18} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{rotating ? 'Pause Rotation' : 'Start Rotation'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="control-button"
                onClick={() => handleDateChange(-1)}
              >
                <Calendar size={18} />
                <span className="ml-1 text-xs">-1d</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Previous Day</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="control-button"
                onClick={() => handleDateChange(1)}
              >
                <Calendar size={18} />
                <span className="ml-1 text-xs">+1d</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Next Day</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Controls;
