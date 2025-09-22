import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Brush
} from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, Download, Settings, RotateCcw, BarChart3, Activity, Layers, Edit2, Check, X } from 'lucide-react';
import { SensorData, ChartConfig, MetricType } from '../types';

interface DataChartProps {
  data: SensorData[];
  config: ChartConfig;
  onConfigChange: (config: ChartConfig) => void;
  chartTitle?: string;
  onChartTitleChange?: (title: string) => void;
  customColors?: Record<string, string>;
  onCustomColorsChange?: (colors: Record<string, string>) => void;
}

const DataChart: React.FC<DataChartProps> = ({
  data,
  config,
  onConfigChange,
  chartTitle = 'データ可視化',
  onChartTitleChange,
  customColors: externalCustomColors = {},
  onCustomColorsChange
}) => {
  const { t } = useTranslation();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [zoomDomain, setZoomDomain] = useState<{ startIndex?: number; endIndex?: number }>({});
  const [normalizeData, setNormalizeData] = useState(false);
  const [customColors, setCustomColors] = useState<Record<string, string>>(externalCustomColors);
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(chartTitle);

  // 視認性の高い配色パレット（順番に使用）
  const defaultColorPalette = [
    '#50a69f',  // Haudy teal
    '#f59e0b',  // Amber
    '#8b5cf6',  // Purple
    '#ef4444',  // Red
    '#06b6d4',  // Cyan
    '#10b981',  // Emerald
    '#ec4899',  // Pink
    '#3b82f6',  // Blue
    '#f97316',  // Orange
    '#84cc16',  // Lime
    '#a855f7',  // Violet
    '#14b8a6',  // Teal
    '#f43f5e',  // Rose
    '#0ea5e9',  // Sky
    '#eab308',  // Yellow
  ];

  // プリセットカラー（カラーピッカー用）
  const presetColors = [
    '#50a69f', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4',
    '#10b981', '#ec4899', '#3b82f6', '#f97316', '#84cc16',
    '#6366f1', '#14b8a6', '#f43f5e', '#0ea5e9', '#eab308',
  ];

  const changeSeriesColor = (seriesKey: string, color: string) => {
    const newColors = {
      ...customColors,
      [seriesKey]: color
    };
    setCustomColors(newColors);
    onCustomColorsChange?.(newColors);
    setColorPickerOpen(null);
  };

  const handleTitleSave = () => {
    onChartTitleChange?.(tempTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(chartTitle);
    setIsEditingTitle(false);
  };

  // メトリックごとの単位と正規化範囲
  const metricRanges: Record<string, [number, number]> = {
    temperature: [0, 40],
    humidity: [0, 100],
    co2: [0, 2000],
    power: [0, 100],
    occupancy: [0, 50],
    illuminance: [0, 1000],
    light: [0, 1000],
    noise: [0, 100],
    pressure: [900, 1100],
    hvacStatus: [0, 1],
    setTemperature: [15, 30]
  };

  const normalizeValue = (value: number, metric: MetricType): number => {
    const range = metricRanges[metric] || [0, 100];
    return ((value - range[0]) / (range[1] - range[0])) * 100;
  };

  const chartData = useMemo(() => {
    if (!data.length) return [];

    const dataByTimestamp = new Map<number, Record<string, unknown>>();

    data.forEach(sensorData => {
      const seriesKey = `${sensorData.deviceId}_${sensorData.metric}`;
      
      sensorData.data.forEach(point => {
        const timestamp = point.timestamp.getTime();
        const date = point.timestamp;
        const minutes = date.getMinutes();
        // Round to nearest 5 minutes for cleaner display
        const roundedMinutes = Math.round(minutes / 5) * 5;
        const displayTime = format(date, roundedMinutes === 0 || roundedMinutes === 30 ? 'HH:mm' : 'HH:mm');
        
        if (!dataByTimestamp.has(timestamp)) {
          dataByTimestamp.set(timestamp, {
            timestamp,
            time: displayTime,
            fullTime: point.timestamp
          });
        }
        
        const entry = dataByTimestamp.get(timestamp);
        if (entry) {
          if (normalizeData) {
            entry[seriesKey] = normalizeValue(point.value, sensorData.metric);
            entry[`${seriesKey}_original`] = point.value;
          } else {
            entry[seriesKey] = point.value;
          }
          entry[`${seriesKey}_unit`] = point.unit;
          entry[`${seriesKey}_quality`] = point.quality;
          entry[`${seriesKey}_metric`] = sensorData.metric;
        }
      });
    });

    return Array.from(dataByTimestamp.values())
      .sort((a, b) => (a.timestamp as number) - (b.timestamp as number));
  }, [data, normalizeData]);

  const series = useMemo(() => {
    const uniqueSeries: Array<{
      key: string;
      name: string;
      metric: MetricType;
      color: string;
      yAxisId: string;
      unit: string;
    }> = [];

    let colorIndex = 0;

    data.forEach(sensorData => {
      const key = `${sensorData.deviceId}_${sensorData.metric}`;
      const unit = sensorData.data[0]?.unit || '';
      
      // カスタムカラーが設定されていればそれを使用、なければパレットから順番に取得
      const color = customColors[key] || defaultColorPalette[colorIndex % defaultColorPalette.length];
      
      uniqueSeries.push({
        key,
        name: `${sensorData.deviceId} - ${t(`metrics.${sensorData.metric}`)}`,
        metric: sensorData.metric,
        color,
        yAxisId: config.multiAxis ? sensorData.metric : 'left',
        unit
      });
      
      colorIndex++;
    });

    return uniqueSeries;
  }, [data, config.multiAxis, t, customColors]);

  const visibleSeries = series.filter(s => !hiddenSeries.has(s.key));

  const toggleSeries = (seriesKey: string) => {
    const newHidden = new Set(hiddenSeries);
    if (newHidden.has(seriesKey)) {
      newHidden.delete(seriesKey);
    } else {
      newHidden.add(seriesKey);
    }
    setHiddenSeries(newHidden);
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', ...visibleSeries.map(s => s.name)].join(','),
      ...chartData.map(row =>
        [(row.fullTime as Date).toISOString(), ...visibleSeries.map(s => row[s.key] || '')].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energia-data-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ChartComponent = config.type === 'bar' ? BarChart : 
                         config.type === 'area' ? AreaChart : LineChart;
  
  const DataComponent = config.type === 'bar' ? Bar : 
                        config.type === 'area' ? Area : Line;

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
    if (!active || !payload) return null;

    return (
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100 tabular-nums">
                {normalizeData && entry.payload[`${entry.dataKey}_original`]
                  ? `${(entry.payload[`${entry.dataKey}_original`] as number).toFixed(2)} ${entry.payload[`${entry.dataKey}_unit`]} (${entry.value?.toFixed(0)}%)`
                  : `${entry.value?.toFixed(2)} ${entry.payload[`${entry.dataKey}_unit`]}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const resetZoom = () => {
    setZoomDomain({});
  };

  const chartTypeIcons = {
    line: <Activity className="w-4 h-4" />,
    bar: <BarChart3 className="w-4 h-4" />,
    area: <Layers className="w-4 h-4" />
  };

  if (!chartData.length) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t('common.noData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden">
      {/* Chart Header */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {chartTitle ? (
              isEditingTitle ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="px-3 py-1 text-xl font-bold bg-white dark:bg-gray-700 border border-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-100"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') handleTitleCancel();
                    }}
                  />
                  <button
                    onClick={handleTitleSave}
                    className="p-1.5 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleTitleCancel}
                    className="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 group">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {chartTitle}
                  </h3>
                  <button
                    onClick={() => {
                      setTempTitle(chartTitle);
                      setIsEditingTitle(true);
                    }}
                    className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                    title="タイトルを編集"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )
            ) : null}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Chart Type Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {(['line', 'bar', 'area'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => onConfigChange({ ...config, type })}
                  className={`p-2 rounded-md transition-all ${
                    config.type === type
                      ? 'bg-white dark:bg-gray-600 shadow-md text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title={t(`chart.chartType.${type}`)}
                >
                  {chartTypeIcons[type]}
                </button>
              ))}
            </div>

            {/* Normalize Toggle */}
            <button
              onClick={() => setNormalizeData(!normalizeData)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                normalizeData
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={normalizeData ? '通常表示に戻す' : '正規化表示 (0-100%)'}
            >
              {normalizeData ? '正規化 ON' : '正規化 OFF'}
            </button>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={resetZoom}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                  dark:hover:text-gray-100 transition-colors rounded-md hover:bg-white/50 dark:hover:bg-gray-600"
                title={t('chart.reset')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleExport}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 
                  dark:hover:text-gray-100 transition-colors rounded-md hover:bg-white/50 dark:hover:bg-gray-600"
                title={t('chart.export')}
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => onConfigChange({ ...config, multiAxis: !config.multiAxis })}
                className={`p-2 transition-colors rounded-md ${
                  config.multiAxis 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-600'
                }`}
                title="Multi-Axis"
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => onConfigChange({ ...config, showLegend: !config.showLegend })}
                className={`p-2 transition-colors rounded-md ${
                  config.showLegend 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-600'
                }`}
                title={t('chart.showLegend')}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      {config.showLegend && (
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-wrap gap-3">
            {series.map(s => (
              <div key={s.key} className="relative">
                <div
                  onClick={() => toggleSeries(s.key)}
                  className={`group flex items-center space-x-2 px-4 py-2 rounded-xl text-sm cursor-pointer
                    transition-all transform hover:scale-105 ${
                      hiddenSeries.has(s.key)
                        ? 'bg-gray-200/50 dark:bg-gray-700/30 text-gray-400 dark:text-gray-500'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md hover:shadow-lg'
                    }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setColorPickerOpen(colorPickerOpen === s.key ? null : s.key);
                    }}
                    className={`w-5 h-5 rounded-full transition-all border-2 border-white dark:border-gray-600 ${
                      hiddenSeries.has(s.key) ? 'opacity-30' : 'shadow-sm hover:shadow-md hover:scale-110'
                    }`}
                    style={{ backgroundColor: s.color }}
                    title="クリックして色を変更"
                  />
                  <span className={`font-medium ${hiddenSeries.has(s.key) ? 'line-through' : ''}`}>
                    {s.name}
                  </span>
                  {s.unit && (
                    <span className="text-gray-500 dark:text-gray-400 text-xs">({s.unit})</span>
                  )}
                </div>
                
                {/* Color Picker Popup */}
                {colorPickerOpen === s.key && (
                  <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {presetColors.map(color => (
                        <button
                          key={color}
                          onClick={() => changeSeriesColor(s.key, color)}
                          className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <input
                        type="color"
                        value={s.color}
                        onChange={(e) => changeSeriesColor(s.key, e.target.value)}
                        className="w-full h-8 rounded cursor-pointer"
                      />
                      <button
                        onClick={() => setColorPickerOpen(null)}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        閉じる
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="p-6">
        <div className="w-full" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
              <defs>
                {visibleSeries.map(s => (
                  <linearGradient key={`gradient-${s.key}`} id={`gradient-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={s.color} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb"
                className="dark:opacity-20"
                vertical={false}
              />
              
              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
              />
              
              {/* Y-Axes */}
              {config.multiAxis && !normalizeData ? (
                <>
                  {Array.from(new Set(visibleSeries.map(s => s.metric))).map((metric, index) => {
                    const seriesForMetric = visibleSeries.find(s => s.metric === metric);
                    const color = seriesForMetric?.color || '#9ca3af';
                    return (
                      <YAxis
                        key={metric}
                        yAxisId={metric}
                        orientation={index % 2 === 0 ? 'left' : 'right'}
                        stroke={color}
                        tick={{ fontSize: 12 }}
                        label={{ 
                          value: t(`metrics.${metric}`), 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { fill: color, fontSize: 12 }
                        }}
                      />
                    );
                  })}
                </>
              ) : (
                <YAxis 
                  yAxisId="left"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                  domain={normalizeData ? [0, 100] : undefined}
                  label={normalizeData ? { value: '正規化値 (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } } : undefined}
                />
              )}

              <Tooltip content={<CustomTooltip />} />
              
              {config.enableZoom && (
                <Brush 
                  dataKey="time" 
                  height={40} 
                  stroke="#9ca3af"
                  fill="#f3f4f6"
                  onChange={(domain: { startIndex?: number; endIndex?: number }) => setZoomDomain(domain)}
                />
              )}

              {/* Data Series */}
              {visibleSeries.map(s => (
                <DataComponent
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  fill={config.type === 'area' ? `url(#gradient-${s.key})` : s.color}
                  strokeWidth={config.type === 'line' ? 3 : 2}
                  yAxisId={s.yAxisId}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  fillOpacity={config.type === 'area' ? 1 : 0.8}
                />
              ))}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataChart;