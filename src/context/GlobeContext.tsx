
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DataType, DATA_TYPES, ProjectionType, PROJECTION_TYPES } from '@/lib/constants';

interface GlobeContextType {
  dataType: DataType;
  setDataType: (type: DataType) => void;
  projectionType: ProjectionType;
  setProjectionType: (type: ProjectionType) => void;
  date: Date;
  setDate: (date: Date) => void;
  rotating: boolean;
  setRotating: (rotating: boolean) => void;
  selectedLocation: { lat: number; lon: number } | null;
  setSelectedLocation: (location: { lat: number; lon: number } | null) => void;
}

const GlobeContext = createContext<GlobeContextType | undefined>(undefined);

export const GlobeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dataType, setDataType] = useState<DataType>(DATA_TYPES.WIND);
  const [projectionType, setProjectionType] = useState<ProjectionType>(PROJECTION_TYPES.ORTHOGRAPHIC);
  const [date, setDate] = useState<Date>(new Date());
  const [rotating, setRotating] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);

  return (
    <GlobeContext.Provider
      value={{
        dataType,
        setDataType,
        projectionType,
        setProjectionType,
        date,
        setDate,
        rotating,
        setRotating,
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </GlobeContext.Provider>
  );
};

export const useGlobe = (): GlobeContextType => {
  const context = useContext(GlobeContext);
  if (!context) {
    throw new Error('useGlobe must be used within a GlobeProvider');
  }
  return context;
};
