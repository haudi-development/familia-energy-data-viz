import { Device, DeviceType, SensorData, DataPoint, MetricType, FacilityType, Alert } from '../types';
import { addMinutes, subDays } from 'date-fns';

const FACILITIES = {
  office: {
    name: 'Tokyo HQ Office',
    floors: 15,
    areas: ['North Wing', 'South Wing', 'Central'],
    zones: ['A', 'B', 'C', 'D']
  },
  factory: {
    name: 'Osaka Manufacturing Plant',
    floors: 3,
    areas: ['Production Line 1', 'Production Line 2', 'Warehouse', 'Quality Control'],
    zones: ['Zone 1', 'Zone 2', 'Zone 3']
  },
  retail: {
    name: 'Shibuya Shopping Center',
    floors: 8,
    areas: ['Fashion', 'Electronics', 'Food Court', 'Entertainment'],
    zones: ['East', 'West', 'Center']
  },
  datacenter: {
    name: 'Cloud Data Center DC-1',
    floors: 2,
    areas: ['Server Room A', 'Server Room B', 'Network Core', 'Cooling Plant'],
    zones: ['Rack 1-10', 'Rack 11-20', 'Rack 21-30']
  }
};

const DEVICE_CONFIGS = {
  environmental: {
    metrics: ['temperature', 'humidity', 'co2'] as MetricType[],
    count: 3
  },
  power: {
    metrics: ['power'] as MetricType[],
    count: 2
  },
  hvac: {
    metrics: ['temperature', 'setTemperature', 'hvacStatus'] as MetricType[],
    count: 2
  },
  lighting: {
    metrics: ['illuminance', 'power'] as MetricType[],
    count: 2
  },
  occupancy: {
    metrics: ['occupancy'] as MetricType[],
    count: 1
  },
  security: {
    metrics: ['noise'] as MetricType[],
    count: 1
  }
};

function generateDeviceId(facility: string, type: DeviceType, index: number): string {
  return `${facility}-${type}-${String(index).padStart(3, '0')}`;
}

function generateDeviceName(type: DeviceType, location: { floor: number; area: string }, index: number): string {
  const typeLabels = {
    environmental: 'ENV Sensor',
    power: 'Power Meter',
    hvac: 'HVAC Unit',
    lighting: 'Lighting Controller',
    occupancy: 'Occupancy Sensor',
    security: 'Security Monitor'
  };
  
  return `${typeLabels[type]} ${location.floor}F-${location.area.substring(0, 3)}-${index}`;
}

export function generateDevices(facilityType: FacilityType = 'office'): Device[] {
  const devices: Device[] = [];
  const facility = FACILITIES[facilityType];
  
  for (let floor = 1; floor <= facility.floors; floor++) {
    for (const area of facility.areas) {
      for (const [deviceType, config] of Object.entries(DEVICE_CONFIGS)) {
        for (let i = 1; i <= config.count; i++) {
          const device: Device = {
            id: generateDeviceId(facilityType, deviceType as DeviceType, devices.length + 1),
            name: generateDeviceName(deviceType as DeviceType, { floor, area }, i),
            type: deviceType as DeviceType,
            location: {
              facility: facility.name,
              floor,
              area,
              zone: facility.zones[Math.floor(Math.random() * facility.zones.length)]
            },
            metrics: config.metrics,
            status: Math.random() > 0.05 ? 'online' : Math.random() > 0.5 ? 'offline' : 'error',
            lastUpdate: new Date()
          };
          devices.push(device);
        }
      }
    }
  }
  
  return devices;
}

function generateDataPattern(
  metric: MetricType,
  startDate: Date,
  endDate: Date,
  interval: number // minutes
): DataPoint[] {
  const data: DataPoint[] = [];
  let current = new Date(startDate);
  
  const baseValues = {
    temperature: 22,
    humidity: 45,
    co2: 500,
    power: 50,
    occupancy: 20,
    illuminance: 500,
    noise: 45,
    pressure: 1013,
    hvacStatus: 1,
    setTemperature: 22
  };
  
  const variations = {
    temperature: { range: 5, pattern: 'sine' },
    humidity: { range: 15, pattern: 'random' },
    co2: { range: 300, pattern: 'occupancy' },
    power: { range: 30, pattern: 'business_hours' },
    occupancy: { range: 50, pattern: 'business_hours' },
    illuminance: { range: 300, pattern: 'daylight' },
    noise: { range: 20, pattern: 'random' },
    pressure: { range: 10, pattern: 'slow_sine' },
    hvacStatus: { range: 0, pattern: 'binary' },
    setTemperature: { range: 2, pattern: 'step' }
  };
  
  const units = {
    temperature: '°C',
    humidity: '%',
    co2: 'ppm',
    power: 'kWh',
    occupancy: 'people',
    illuminance: 'lx',
    noise: 'dB',
    pressure: 'hPa',
    hvacStatus: '',
    setTemperature: '°C'
  };
  
  let index = 0;
  while (current <= endDate) {
    const hour = current.getHours();
    const dayOfWeek = current.getDay();
    const isBusinessHours = hour >= 8 && hour <= 18 && dayOfWeek >= 1 && dayOfWeek <= 5;
    
    let value = baseValues[metric];
    const variation = variations[metric];
    
    switch (variation.pattern) {
      case 'sine':
        value += Math.sin(index * 0.1) * variation.range;
        break;
      case 'slow_sine':
        value += Math.sin(index * 0.02) * variation.range;
        break;
      case 'random':
        value += (Math.random() - 0.5) * variation.range;
        break;
      case 'business_hours':
        if (isBusinessHours) {
          value += variation.range * 0.8 + Math.random() * variation.range * 0.2;
        } else {
          value += Math.random() * variation.range * 0.2;
        }
        break;
      case 'occupancy':
        if (isBusinessHours) {
          value += variation.range * 0.6 + Math.random() * variation.range * 0.4;
        } else {
          value += Math.random() * variation.range * 0.1;
        }
        break;
      case 'daylight':
        const dayProgress = hour / 24;
        value += Math.sin(dayProgress * Math.PI) * variation.range;
        break;
      case 'binary':
        value = isBusinessHours ? 1 : 0;
        break;
      case 'step':
        value += Math.floor(index / 20) % 3 - 1;
        break;
    }
    
    // Add occasional anomalies
    if (Math.random() < 0.02) {
      value *= Math.random() > 0.5 ? 1.5 : 0.5;
    }
    
    // Add missing data points
    const quality = Math.random() < 0.98 ? 'good' : Math.random() < 0.5 ? 'interpolated' : 'error';
    
    data.push({
      timestamp: new Date(current),
      value: Math.max(0, value),
      unit: units[metric],
      quality
    });
    
    current = addMinutes(current, interval);
    index++;
  }
  
  return data;
}

export function generateSensorData(
  devices: Device[],
  dateRange: { start: Date; end: Date },
  interval: number = 5 // minutes
): SensorData[] {
  const sensorData: SensorData[] = [];
  
  if (!devices || devices.length === 0) {
    return sensorData;
  }
  
  for (const device of devices) {
    if (!device || device.status !== 'online') continue;
    
    if (!device.metrics || device.metrics.length === 0) continue;
    
    for (const metric of device.metrics) {
      const data = generateDataPattern(metric, dateRange.start, dateRange.end, interval);
      
      sensorData.push({
        deviceId: device.id,
        metric,
        data,
        aggregation: interval < 60 ? 'raw' : interval < 1440 ? 'hour' : 'day'
      });
    }
  }
  
  return sensorData;
}

export function generateAlerts(devices: Device[], count: number = 10): Alert[] {
  const alerts: Alert[] = [];
  const alertTypes: Alert['type'][] = ['warning', 'error', 'info'];
  const alertMessages = {
    temperature: {
      warning: 'Temperature exceeds normal range',
      error: 'Critical temperature alert',
      info: 'Temperature sensor calibration required'
    },
    humidity: {
      warning: 'High humidity detected',
      error: 'Humidity level critical',
      info: 'Humidity trending upward'
    },
    co2: {
      warning: 'CO2 levels elevated',
      error: 'CO2 levels dangerous',
      info: 'Ventilation adjustment recommended'
    },
    power: {
      warning: 'Power consumption above average',
      error: 'Power overload detected',
      info: 'Power factor correction needed'
    },
    occupancy: {
      warning: 'Area overcrowded',
      error: 'Maximum occupancy exceeded',
      info: 'Unusual occupancy pattern detected'
    }
  };
  
  for (let i = 0; i < count; i++) {
    const device = devices[Math.floor(Math.random() * devices.length)];
    const metric = device.metrics[Math.floor(Math.random() * device.metrics.length)];
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    const messageSet = alertMessages[metric as keyof typeof alertMessages];
    const message = messageSet ? messageSet[type] : `${metric} alert`;
    
    alerts.push({
      id: `alert-${i + 1}`,
      deviceId: device.id,
      metric,
      type,
      message,
      timestamp: subDays(new Date(), Math.floor(Math.random() * 7)),
      acknowledged: Math.random() > 0.3
    });
  }
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateRealtimeUpdate(existingData: DataPoint[], metric: MetricType): DataPoint {
  const lastPoint = existingData[existingData.length - 1];
  const baseValue = lastPoint ? lastPoint.value : 20;
  
  const units = {
    temperature: '°C',
    humidity: '%',
    co2: 'ppm',
    power: 'kWh',
    occupancy: 'people',
    illuminance: 'lx',
    noise: 'dB',
    pressure: 'hPa',
    hvacStatus: '',
    setTemperature: '°C'
  };
  
  const variation = (Math.random() - 0.5) * 2;
  const newValue = baseValue + variation;
  
  return {
    timestamp: new Date(),
    value: Math.max(0, newValue),
    unit: units[metric] || '',
    quality: Math.random() > 0.02 ? 'good' : 'error'
  };
}