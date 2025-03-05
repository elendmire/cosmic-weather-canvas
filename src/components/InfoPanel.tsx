
import React from 'react';
import { useGlobe } from '@/context/GlobeContext';
import { DATA_LABELS, COLOR_SCALES } from '@/lib/constants';
import { Wind, Thermometer, Waves, BarChart3 } from 'lucide-react';

const InfoPanel: React.FC = () => {
  const { dataType, date, selectedLocation } = useGlobe();
  
  const getDataIcon = () => {
    switch (dataType) {
      case 'wind':
        return <Wind className="text-blue-400" size={18} />;
      case 'temp':
        return <Thermometer className="text-red-400" size={18} />;
      case 'ocean':
        return <Waves className="text-cyan-400" size={18} />;
      case 'pressure':
        return <BarChart3 className="text-violet-400" size={18} />;
      default:
        return <Wind className="text-blue-400" size={18} />;
    }
  };
  
  // Mock data for visualization
  const mockValue = () => {
    return Math.floor(Math.random() * 100);
  };
  
  const colorScale = COLOR_SCALES[dataType];
  
  return (
    <div className="fixed top-16 left-6 z-10 glass-panel p-4 w-72 max-w-full animate-slide-in-right">
      <div className="flex items-center gap-2 mb-4">
        {getDataIcon()}
        <h2 className="text-lg font-light">{DATA_LABELS[dataType]} Data</h2>
      </div>
      
      <div className="mb-4 text-sm">
        <div className="data-label">Date</div>
        <div className="data-value">{date.toLocaleDateString(undefined, { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</div>
      </div>
      
      {selectedLocation ? (
        <div className="space-y-3">
          <div>
            <div className="data-label">Location</div>
            <div className="data-value">
              {selectedLocation.lat.toFixed(2)}°, {selectedLocation.lon.toFixed(2)}°
            </div>
          </div>
          
          <div>
            <div className="data-label">Current Value</div>
            <div className="data-value">
              {mockValue()} {dataType === 'wind' ? 'km/h' : dataType === 'temp' ? '°C' : dataType === 'pressure' ? 'hPa' : ''}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Click on the globe to select a location and view specific data.
        </div>
      )}
      
      <div className="mt-6">
        <div className="data-label mb-2">Color Scale</div>
        <div className="flex h-4 rounded-sm overflow-hidden">
          {colorScale.map((color, index) => (
            <div
              key={index}
              className="flex-1"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <div className="text-xs">Min</div>
          <div className="text-xs">Max</div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
