
export const GLOBE_RADIUS = 200;
export const CAMERA_DISTANCE = 400;

export const DATA_TYPES = {
  WIND: 'wind',
  TEMP: 'temp',
  OCEAN: 'ocean',
  PRESSURE: 'pressure',
} as const;

export type DataType = typeof DATA_TYPES[keyof typeof DATA_TYPES];

export const DATA_LABELS = {
  [DATA_TYPES.WIND]: 'Wind',
  [DATA_TYPES.TEMP]: 'Temperature',
  [DATA_TYPES.OCEAN]: 'Ocean Currents',
  [DATA_TYPES.PRESSURE]: 'Air Pressure',
};

export const COLOR_SCALES = {
  [DATA_TYPES.WIND]: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'],
  [DATA_TYPES.TEMP]: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2', '#fef2f2'],
  [DATA_TYPES.OCEAN]: ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe'],
  [DATA_TYPES.PRESSURE]: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff'],
};

export const PROJECTION_TYPES = {
  ORTHOGRAPHIC: 'orthographic',
  EQUIRECTANGULAR: 'equirectangular',
} as const;

export type ProjectionType = typeof PROJECTION_TYPES[keyof typeof PROJECTION_TYPES];
