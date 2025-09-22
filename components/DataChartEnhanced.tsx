import React, { useMemo } from 'react';
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Brush, ComposedChart
} from 'recharts';
import { format } from 'date-fns';
// import { ja } from 'date-fns/locale';
import { SensorData, ChartConfig, MetricType } from '../types';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Grid3x3, Layers, GitBranch } from 'lucide-react';

interface DataChartProps {
  data: SensorData[];
  config: ChartConfig;
  onConfigChange: (config: ChartConfig) => void;
}

const DataChartEnhanced: React.FC<DataChartProps> = ({ data, config, onConfigChange }) => {
  const { t } = useTranslation();

  // メトリックタイプごとの単位
  const metricUnits: Record<MetricType, { unit: string; color: string; domain?: [number, number] }> = {
    temperature: { unit: '°C', color: '#ef4444', domain: [0, 40] },
    humidity: { unit: '%', color: '#3b82f6', domain: [0, 100] },
    co2: { unit: 'ppm', color: '#10b981', domain: [0, 2000] },
    power: { unit: 'kW', color: '#f59e0b', domain: [0, 100] },
    occupancy: { unit: '人', color: '#8b5cf6', domain: [0, 50] },
    illuminance: { unit: 'lx', color: '#f97316', domain: [0, 1000] },
    light: { unit: 'lx', color: '#f97316', domain: [0, 1000] },
    noise: { unit: 'dB', color: '#06b6d4', domain: [0, 100] },
    pressure: { unit: 'hPa', color: '#ec4899', domain: [900, 1100] },
    hvacStatus: { unit: '', color: '#64748b', domain: [0, 1] },
    setTemperature: { unit: '°C', color: '#dc2626', domain: [15, 30] },
  };

  // データの正規化
  const normalizeValue = (value: number, metric: MetricType): number => {
    const domain = metricUnits[metric].domain || [0, 100];
    return ((value - domain[0]) / (domain[1] - domain[0])) * 100;
  };

  // チャートデータの準備
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const timeMap = new Map<string, Record<string, unknown>>();
    
    data.forEach(sensor => {
      sensor.data.forEach(point => {
        const timeKey = format(point.timestamp, 'HH:mm');
        if (!timeMap.has(timeKey)) {
          timeMap.set(timeKey, { time: timeKey, timestamp: point.timestamp });
        }
        
        const dataPoint = timeMap.get(timeKey);
        const key = `${sensor.deviceId}_${sensor.metric}`;
        
        if (config.displayMode === 'normalized') {
          dataPoint[key] = normalizeValue(point.value, sensor.metric);
          dataPoint[`${key}_original`] = point.value;
          dataPoint[`${key}_unit`] = metricUnits[sensor.metric].unit;
        } else {
          dataPoint[key] = point.value;
        }
      });
    });

    return Array.from(timeMap.values()).sort((a, b) =>
      (a.timestamp as Date).getTime() - (b.timestamp as Date).getTime()
    );
  }, [data, config.displayMode]);

  // データ系列の取得
  const series = useMemo(() => {
    const uniqueSeries: { key: string; name: string; color: string; metric: MetricType }[] = [];
    const colorMap = new Map<string, string>();
    let colorIndex = 0;
    
    data.forEach(sensor => {
      const key = `${sensor.deviceId}_${sensor.metric}`;
      if (!colorMap.has(key)) {
        const color = metricUnits[sensor.metric].color;
        colorMap.set(key, color);
        uniqueSeries.push({
          key,
          name: `${sensor.deviceId} - ${t(`metrics.${sensor.metric}`)}`,
          color,
          metric: sensor.metric
        });
        colorIndex++;
      }
    });
    
    return uniqueSeries;
  }, [data, t]);

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      name: string;
      color: string;
      dataKey: string;
      payload: Record<string, unknown>;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
          {payload.map((entry, index) => {
            const originalValue = config.displayMode === 'normalized' 
              ? entry.payload[`${entry.dataKey}_original`]
              : entry.value;
            const unit = config.displayMode === 'normalized'
              ? entry.payload[`${entry.dataKey}_unit`]
              : metricUnits[series.find(s => s.key === entry.dataKey)?.metric || 'temperature'].unit;
            
            return (
              <div key={index} className="flex items-center justify-between space-x-4 text-sm">
                <span style={{ color: entry.color }}>{entry.name}:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {originalValue?.toFixed(1)} {unit}
                  {config.displayMode === 'normalized' && ` (${entry.value?.toFixed(0)}%)`}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // 表示モード切り替えボタン
  const DisplayModeSelector = () => (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => onConfigChange({ ...config, displayMode: 'standard' })}
        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${
          config.displayMode === 'standard'
            ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
        title="標準表示"
      >
        <TrendingUp className="w-3 h-3" />
        <span>標準</span>
      </button>
      <button
        onClick={() => onConfigChange({ ...config, displayMode: 'normalized' })}
        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${
          config.displayMode === 'normalized'
            ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
        title="正規化表示（0-100%）"
      >
        <Grid3x3 className="w-3 h-3" />
        <span>正規化</span>
      </button>
      <button
        onClick={() => onConfigChange({ ...config, displayMode: 'split' })}
        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${
          config.displayMode === 'split'
            ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
        title="分割表示"
      >
        <Layers className="w-3 h-3" />
        <span>分割</span>
      </button>
      <button
        onClick={() => onConfigChange({ ...config, displayMode: 'dual-axis' })}
        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${
          config.displayMode === 'dual-axis'
            ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
        title="デュアル軸表示"
      >
        <GitBranch className="w-3 h-3" />
        <span>デュアル軸</span>
      </button>
    </div>
  );

  // 分割表示モード
  if (config.displayMode === 'split') {
    const metricGroups = Array.from(new Set(data.map(d => d.metric)));
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            データ分析 - 分割表示
          </h3>
          <DisplayModeSelector />
        </div>
        
        <div className="flex-1 grid grid-rows-auto gap-4 overflow-auto">
          {metricGroups.map((metric) => {
            const metricData = data.filter(d => d.metric === metric);
            const metricChartData = (() => {
              const timeMap = new Map<string, Record<string, unknown>>();
              metricData.forEach(sensor => {
                sensor.data.forEach(point => {
                  const timeKey = format(point.timestamp, 'HH:mm');
                  if (!timeMap.has(timeKey)) {
                    timeMap.set(timeKey, { time: timeKey, timestamp: point.timestamp });
                  }
                  const dataPoint = timeMap.get(timeKey);
                  if (dataPoint) {
                    dataPoint[`${sensor.deviceId}`] = point.value;
                  }
                });
              });
              return Array.from(timeMap.values()).sort((a, b) =>
                (a.timestamp as Date).getTime() - (b.timestamp as Date).getTime()
              );
            })();

            return (
              <div key={metric} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t(`metrics.${metric}`)} ({metricUnits[metric].unit})
                </h4>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={metricChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      fontSize={10}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={10}
                      domain={metricUnits[metric].domain}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {metricData.map((sensor, idx) => (
                      <Line
                        key={sensor.deviceId}
                        type="monotone"
                        dataKey={sensor.deviceId}
                        stroke={metricUnits[metric].color}
                        strokeWidth={2}
                        dot={false}
                        name={sensor.deviceId}
                        opacity={0.8 - idx * 0.1}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // デュアル軸モード
  if (config.displayMode === 'dual-axis' && series.length > 0) {
    const leftAxisMetrics = series.filter(s => ['temperature', 'humidity', 'co2'].includes(s.metric));
    const rightAxisMetrics = series.filter(s => ['power', 'occupancy', 'illuminance', 'light'].includes(s.metric));
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            データ分析 - デュアル軸
          </h3>
          <DisplayModeSelector />
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              label={{ value: '環境データ', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              label={{ value: '電力・その他', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {leftAxisMetrics.map(s => (
              <Line
                key={s.key}
                yAxisId="left"
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                name={s.name}
              />
            ))}
            
            {rightAxisMetrics.map(s => (
              <Line
                key={s.key}
                yAxisId="right"
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                name={s.name}
                strokeDasharray="5 5"
              />
            ))}
            
            {config.enableZoom && <Brush dataKey="time" height={30} stroke="#50A69F" />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 標準・正規化表示
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          データ分析 {config.displayMode === 'normalized' && '- 正規化表示 (0-100%)'}
        </h3>
        <DisplayModeSelector />
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
            domain={config.displayMode === 'normalized' ? [0, 100] : undefined}
            label={config.displayMode === 'normalized' ? { value: '正規化値 (%)', angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip content={<CustomTooltip />} />
          {config.showLegend && <Legend />}
          
          {series.map(s => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              name={s.name}
            />
          ))}
          
          {config.enableZoom && <Brush dataKey="time" height={30} stroke="#50A69F" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataChartEnhanced;