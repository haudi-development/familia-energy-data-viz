export type FacilityType = 'office' | 'factory' | 'retail' | 'datacenter';

export type DeviceType = 'environmental' | 'power' | 'hvac' | 'lighting' | 'security' | 'occupancy';

export type MetricType = 
  | 'temperature'
  | 'humidity' 
  | 'co2'
  | 'power'
  | 'occupancy'
  | 'illuminance'
  | 'noise'
  | 'pressure'
  | 'hvacStatus'
  | 'setTemperature';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  location: {
    facility: string;
    floor: number;
    area: string;
    zone?: string;
  };
  metrics: MetricType[];
  status: 'online' | 'offline' | 'error';
  lastUpdate: Date;
}

export interface DataPoint {
  timestamp: Date;
  value: number;
  unit: string;
  quality?: 'good' | 'interpolated' | 'error';
}

export interface SensorData {
  deviceId: string;
  metric: MetricType;
  data: DataPoint[];
  aggregation?: 'raw' | 'minute' | 'hour' | 'day';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface AxisConfig {
  min?: number;
  max?: number;
  ticks?: number;
  label?: string;
  unit?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'area';
  showLegend: boolean;
  enableZoom: boolean;
  multiAxis: boolean;
  showGrid: boolean;
  comparison?: ComparisonMode;
  displayMode?: 'standard' | 'normalized' | 'split' | 'dual-axis';
  yAxisConfig?: {
    [key: string]: AxisConfig;  // メトリクスごとの独立した設定
  };
  xAxisConfig?: AxisConfig;
  metricTypes?: {
    [key: string]: 'line' | 'bar' | 'area';  // メトリクスごとのグラフタイプ
  };
  commonTickCount?: number;  // Y軸共通目盛り数
  hiddenSeries?: string[];  // 非表示の系列
  normalizeData?: boolean;  // 正規化の有効/無効
  seriesOpacity?: Record<string, number>;  // 系列ごとの不透明度
}

export type ComparisonMode = 
  | { type: 'timeSeries'; devices: string[] }
  | { type: 'period'; periods: DateRange[] }
  | { type: 'device'; metric: MetricType };

export interface Alert {
  id: string;
  deviceId: string;
  metric: MetricType;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface DashboardSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'ja' | 'en' | 'vi';
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  dateFormat: string;
  numberFormat: {
    decimalSeparator: string;
    thousandsSeparator: string;
  };
}

// 個別のグラフ設定
export interface GraphConfigItem {
  id: string;
  title: string;
  selectedDevices: string[];
  selectedMetrics: MetricType[];
  chartConfig: ChartConfig;
  customColors?: Record<string, string>;
  expanded: boolean;
  dateRange?: DateRange; // グラフごとの期間設定
  chartHeight?: number; // グラフの高さ設定
}

export interface ChartPreset {
  id: string;
  name: string;
  dateRange: DateRange;
  graphs: GraphConfigItem[]; // 複数グラフの設定を保存
  createdAt: Date;
  updatedAt: Date;
}