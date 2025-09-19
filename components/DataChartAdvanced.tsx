import React, { useState, useMemo, useRef, useCallback, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Brush
} from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, Download, Settings, RotateCcw, BarChart3, Activity, Layers, Edit2, Check, X, Sliders, Grid3x3 } from 'lucide-react';
import { SensorData, ChartConfig, MetricType, AxisConfig } from '../types';

interface DataChartAdvancedProps {
  data: SensorData[];
  config: ChartConfig;
  onConfigChange: (config: ChartConfig) => void;
  chartTitle?: string;
  onChartTitleChange?: (title: string) => void;
  customColors?: Record<string, string>;
  onCustomColorsChange?: (colors: Record<string, string>) => void;
  chartHeight?: number;
  onChartHeightChange?: (height: number) => void;
}

// メトリックの単位定義
const METRIC_UNITS: Record<MetricType, string> = {
  temperature: '°C',
  humidity: '%',
  co2: 'ppm',
  power: 'kW',
  occupancy: '人',
  illuminance: 'lux',
  noise: 'dB',
  pressure: 'hPa',
  hvacStatus: '',
  setTemperature: '°C'
};

// メトリックのデフォルト範囲
const METRIC_RANGES: Record<MetricType, [number, number]> = {
  temperature: [15, 30],
  humidity: [30, 80],
  co2: [400, 2000],
  power: [0, 100],
  occupancy: [0, 50],
  illuminance: [0, 2000],
  noise: [30, 90],
  pressure: [990, 1030],
  hvacStatus: [0, 1],
  setTemperature: [18, 28]
};

const DataChartAdvanced: React.FC<DataChartAdvancedProps> = ({
  data,
  config,
  onConfigChange,
  chartTitle = 'データ可視化',
  onChartTitleChange,
  customColors: externalCustomColors = {},
  onCustomColorsChange,
  chartHeight = 320,
  onChartHeightChange
}) => {
  const { t } = useTranslation();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [zoomDomain, setZoomDomain] = useState<{ start?: number; end?: number }>({});
  const [normalizeData, setNormalizeData] = useState(false);
  const [customColors, setCustomColors] = useState<Record<string, string>>(externalCustomColors);
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(chartTitle);
  const [axisSettingsOpen, setAxisSettingsOpen] = useState<'left' | 'right' | 'x' | null>(null);
  const [tempAxisConfig, setTempAxisConfig] = useState<AxisConfig>({});
  const axisMinRef = useRef<HTMLInputElement>(null);
  const axisMaxRef = useRef<HTMLInputElement>(null);
  const axisTicksRef = useRef<HTMLInputElement>(null);
  const [tempHeight, setTempHeight] = useState(chartHeight);
  const [showHeightSetting, setShowHeightSetting] = useState(false);
  const [showGrid, setShowGrid] = useState(config.showGrid ?? true);
  const [commonTickCount, setCommonTickCount] = useState(5); // 共通の目盛り数
  const [showAxisConfig, setShowAxisConfig] = useState(false); // 軸設定パネル
  const [activeConfigTab, setActiveConfigTab] = useState<string>('common'); // アクティブなタブ
  const [metricOrder, setMetricOrder] = useState<string[]>([]);
  const [seriesOpacity, setSeriesOpacity] = useState<Record<string, number>>({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // レスポンシブ対応
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ブレークポイント
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 1024;

  // レスポンシブな軸幅を取得
  const getResponsiveAxisWidth = () => {
    if (isMobile) return { inner: 25, outer: 28 };
    if (isTablet) return { inner: 30, outer: 33 };
    return { inner: 35, outer: 38 };
  };

  // レスポンシブなマージンを取得（4軸分のスペースを常に確保）
  const getResponsiveMargins = () => {
    if (isMobile) {
      return {
        left: 50,  // 常に2軸分確保
        right: 50  // 常に2軸分確保
      };
    }
    if (isTablet) {
      return {
        left: 60,  // 常に2軸分確保
        right: 60  // 常に2軸分確保
      };
    }
    return {
      left: 70,  // 常に2軸分確保
      right: 70  // 常に2軸分確保
    };
  };

  // フォントサイズの取得
  const getFontSizes = () => ({
    tick: isMobile ? 8 : isTablet ? 9 : 10,
    label: isMobile ? 8 : isTablet ? 9 : 10
  });

  // メトリクスタイプに対応するデフォルト色（データ種別選択と同じ色）
  const METRIC_COLORS: Record<MetricType, string> = {
    temperature: '#ef4444',    // 赤
    humidity: '#3b82f6',       // 青
    co2: '#10b981',           // 緑
    power: '#fbbf24',         // 黄色
    occupancy: '#f59e0b',     // アンバー
    illuminance: '#fde047',   // 明るい黄色
    noise: '#ec4899',         // ピンク
    pressure: '#06b6d4',      // シアン
    hvacStatus: '#6366f1',    // インディゴ
    setTemperature: '#f97316' // オレンジ
  };

  // スタイリッシュな配色パレット
  const defaultColorPalette = [
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#84cc16', // Lime
    '#f97316', // Orange
    '#14b8a6', // Teal
  ];

  const presetColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6',
    '#6366f1', '#a855f7', '#f43f5e', '#0ea5e9', '#eab308',
    '#78716c', '#64748b', '#fbbf24', '#34d399', '#c084fc',
  ];

  const changeSeriesColor = (seriesKey: string, color: string) => {
    const newColors = { ...customColors, [seriesKey]: color };
    setCustomColors(newColors);
    onCustomColorsChange?.(newColors);
  };

  const changeSeriesOpacity = (seriesKey: string, opacity: number) => {
    setSeriesOpacity({ ...seriesOpacity, [seriesKey]: opacity });
  };

  const handleTitleSave = () => {
    onChartTitleChange?.(tempTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(chartTitle);
    setIsEditingTitle(false);
  };

  const handleAxisSettingSave = useCallback((side: 'left' | 'right' | 'x') => {
    const newConfig = { ...config };

    if (side === 'x') {
      const ticksValue = tempAxisConfig.ticks;
      newConfig.xAxisConfig = { ticks: ticksValue };
    } else {
      const minValue = axisMinRef.current?.value;
      const maxValue = axisMaxRef.current?.value;
      const metric = tempAxisConfig.metric;

      if (metric) {
        const updatedConfig: AxisConfig = {
          min: minValue === '' ? undefined : Number(minValue),
          max: maxValue === '' ? undefined : Number(maxValue)
        };

        if (!newConfig.yAxisConfig) newConfig.yAxisConfig = {};
        newConfig.yAxisConfig[metric] = updatedConfig;
      }
    }

    onConfigChange(newConfig);
    setAxisSettingsOpen(null);
    setTempAxisConfig({});
  }, [config, tempAxisConfig, onConfigChange]);


  const normalizeValue = (value: number, metric: MetricType): number => {
    const range = METRIC_RANGES[metric];
    return ((value - range[0]) / (range[1] - range[0])) * 100;
  };

  const chartData = useMemo(() => {
    if (!data.length) return [];

    const dataByTimestamp = new Map<number, any>();

    data.forEach(sensorData => {
      const seriesKey = `${sensorData.deviceId}_${sensorData.metric}`;

      sensorData.data.forEach(point => {
        const timestamp = point.timestamp.getTime();
        const displayTime = format(point.timestamp, 'HH:mm');

        if (!dataByTimestamp.has(timestamp)) {
          dataByTimestamp.set(timestamp, {
            timestamp,
            time: displayTime,
            fullTime: point.timestamp
          });
        }

        const entry = dataByTimestamp.get(timestamp);
        if (normalizeData) {
          entry[seriesKey] = normalizeValue(point.value, sensorData.metric);
          entry[`${seriesKey}_original`] = point.value;
        } else {
          entry[seriesKey] = point.value;
        }
        entry[`${seriesKey}_unit`] = METRIC_UNITS[sensorData.metric];
        entry[`${seriesKey}_metric`] = sensorData.metric;
      });
    });

    const sortedData = Array.from(dataByTimestamp.values())
      .sort((a, b) => a.timestamp - b.timestamp);

    // インデックスを追加（X軸の位置管理用）
    sortedData.forEach((item, index) => {
      item.index = index;
    });

    return sortedData;
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

    // 一時的に軸判定用のメトリクス種別をカウント
    const metricTypes = new Set(data.map(sd => sd.metric));
    const tempShouldUseMultiAxis = metricTypes.size > 1 && !normalizeData;

    // 現在のメトリクスを収集
    const currentMetrics = Array.from(new Set(data.map(sd => sd.metric)));

    // metricOrderを更新（新しいメトリクスを追加、存在しないものを削除）
    const newOrder = [...metricOrder];
    currentMetrics.forEach(metric => {
      if (!newOrder.includes(metric)) {
        newOrder.push(metric);
      }
    });
    const filteredOrder = newOrder.filter(m => currentMetrics.includes(m));
    if (JSON.stringify(filteredOrder) !== JSON.stringify(metricOrder)) {
      setTimeout(() => setMetricOrder(filteredOrder), 0);
    }

    data.forEach(sensorData => {
      const key = `${sensorData.deviceId}_${sensorData.metric}`;
      const unit = METRIC_UNITS[sensorData.metric];

      // メトリクスタイプに応じたデフォルト色を使用
      const color = customColors[key] || METRIC_COLORS[sensorData.metric] || defaultColorPalette[colorIndex % defaultColorPalette.length];

      uniqueSeries.push({
        key,
        name: `${sensorData.deviceId} - ${t(`metrics.${sensorData.metric}`)}`,
        metric: sensorData.metric,
        color,
        yAxisId: tempShouldUseMultiAxis ? sensorData.metric : 'left',
        unit
      });

      colorIndex++;
    });

    return uniqueSeries;
  }, [data, t, customColors, normalizeData, metricOrder]);

  const visibleSeries = series.filter(s => !hiddenSeries.has(s.key));


  // 異なるメトリクスがある場合は自動的にマルチ軸を有効化
  const hasMultipleMetrics = new Set(visibleSeries.map(s => s.metric)).size > 1;
  const shouldUseMultiAxis = hasMultipleMetrics && !normalizeData;

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
      ['Timestamp', ...visibleSeries.map(s => `${s.name} (${s.unit})`)].join(','),
      ...chartData.map(row =>
        [row.fullTime.toISOString(), ...visibleSeries.map(s => row[s.key] || '')].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart-data-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ChartComponent = config.type === 'bar' ? BarChart :
                         config.type === 'area' ? AreaChart : LineChart;

  const DataComponent = config.type === 'bar' ? Bar :
                        config.type === 'area' ? Area : Line;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100 tabular-nums">
                {normalizeData && entry.payload[`${entry.dataKey}_original`]
                  ? `${Math.round(entry.payload[`${entry.dataKey}_original`])} ${entry.payload[`${entry.dataKey}_unit`]} (${Math.round(entry.value)}%)`
                  : `${Math.round(entry.value)} ${entry.payload[`${entry.dataKey}_unit`]}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 軸設定のダイアログをメモ化
  const AxisSettingsDialog = memo(({ side, metric }: { side: 'left' | 'right' | 'x', metric?: string }) => {
    // メトリクスごとの独立した設定を取得
    const currentConfig = side === 'x' ? config.xAxisConfig || {} : (metric ? config.yAxisConfig?.[metric] || {} : {});
    const defaultRange = metric ? METRIC_RANGES[metric as MetricType] : [0, 100];
    const metricLabel = metric ? t(`metrics.${metric}`) : '';
    const axisLabel = side === 'x' ? '横軸' : metricLabel;

    return (
      <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-72">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
          {side === 'x' ? '横軸の設定' : `${axisLabel}の軸の設定`}
        </h4>
        <div className="space-y-3">
          {side === 'x' ? (
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">表示目盛り数</label>
              <select
                value={tempAxisConfig.ticks ?? currentConfig.ticks ?? 'auto'}
                onChange={(e) => setTempAxisConfig({ ...tempAxisConfig, ticks: e.target.value === 'auto' ? undefined : Number(e.target.value) })}
                className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded"
              >
                <option value="auto">自動</option>
                <option value="4">約5個表示</option>
                <option value="6">約7個表示</option>
                <option value="9">約10個表示</option>
                <option value="14">約15個表示</option>
                <option value="19">約20個表示</option>
                <option value="29">約30個表示</option>
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">最小値</label>
                <input
                  ref={axisMinRef}
                  type="number"
                  defaultValue={currentConfig.min ?? defaultRange[0]}
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">最大値</label>
                <input
                  ref={axisMaxRef}
                  type="number"
                  defaultValue={currentConfig.max ?? defaultRange[1]}
                  className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
            </>
          )}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => {
                setAxisSettingsOpen(null);
                setTempAxisConfig({});
              }}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              キャンセル
            </button>
            <button
              onClick={() => handleAxisSettingSave(side)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              適用
            </button>
          </div>
        </div>
      </div>
    );
  });

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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">データがありません</p>
        </div>
      </div>
    );
  }

  // マルチAxis用のY軸を生成（常に4軸分のスペースを確保）
  const renderYAxes = () => {
    // 常に4軸モードでレンダリング（単一軸でも4軸分のスペースを確保）
    if (false) {  // 単一軸モードは無効化
      // 単一メトリクスの場合、そのメトリクス情報を取得
      const firstSeries = visibleSeries[0];
      const firstMetric = firstSeries?.metric;
      const unit = firstMetric ? METRIC_UNITS[firstMetric] : '';
      const metricLabel = firstMetric ? t(`metrics.${firstMetric}`) : '';
      const seriesColor = firstSeries?.color || '#3b82f6';

      // メトリクスごとの設定を取得
      const metricConfig = firstMetric ? config.yAxisConfig?.[firstMetric] || {} : {};

      // ドメインを固定値で設定
      let domain: [number, number];
      if (normalizeData) {
        domain = [0, 100];
      } else if (firstMetric) {
        const defaultRange = METRIC_RANGES[firstMetric];
        domain = [
          metricConfig.min !== undefined ? metricConfig.min : defaultRange[0],
          metricConfig.max !== undefined ? metricConfig.max : defaultRange[1]
        ];
      } else {
        domain = [0, 100];
      }

      return (
        <YAxis
          yAxisId="left"
          stroke={seriesColor}
          tick={{ fontSize: 10, fill: seriesColor }}
          tickFormatter={(value) => Math.round(value).toString()}
          width={45}
          domain={domain}
          scale="linear"
          allowDataOverflow={true}
          allowDecimals={false}
          tickMargin={5}
          ticks={Array.from({ length: commonTickCount }, (_, i) =>
            domain[0] + (domain[1] - domain[0]) * (i / (commonTickCount - 1))
          )}
          label={{
            value: normalizeData ? '正規化値 (%)' : `${metricLabel} (${unit})`,
            angle: -90,
            position: 'insideLeft',
            offset: 10,
            style: { fontSize: 10, fill: seriesColor, textAnchor: 'middle' }
          }}
          onClick={() => {
            setTempAxisConfig({ metric: firstMetric });
            setAxisSettingsOpen('left');
          }}
          style={{ cursor: 'pointer' }}
        />
      );
    }

    const metricsByAxis = new Map<string, MetricType[]>();
    visibleSeries.forEach(s => {
      const axis = s.yAxisId;
      if (!metricsByAxis.has(axis)) {
        metricsByAxis.set(axis, []);
      }
      metricsByAxis.get(axis)!.push(s.metric);
    });

    // メトリクスの追加順序を保持して配置を決定
    const uniqueMetrics = Array.from(new Set(visibleSeries.map(s => s.metric)));
    const orderedMetrics = metricOrder.filter(m => uniqueMetrics.includes(m));

    // 順序が決まっていないメトリクスを追加
    uniqueMetrics.forEach(m => {
      if (!orderedMetrics.includes(m)) {
        orderedMetrics.push(m);
      }
    });

    // Y軸の配置を決定
    // 目標: 1番目→左1(内側), 2番目→左2(外側), 3番目→右1(内側), 4番目→右2(外側)
    const getAxisPosition = (index: number): { side: 'left1' | 'left2' | 'right1' | 'right2', metricIndex: number } => {
      switch(index) {
        case 0: return { side: 'left1', metricIndex: 1 };   // 1番目 → 左1（内側）
        case 1: return { side: 'left2', metricIndex: 2 };   // 2番目 → 左2（外側）
        case 2: return { side: 'right1', metricIndex: 3 };  // 3番目 → 右1（内側）
        case 3: return { side: 'right2', metricIndex: 4 };  // 4番目 → 右2（外側）
        default: return { side: 'left1', metricIndex: index + 1 };
      }
    };


    // メトリクスを正しいY軸に割り当てる
    // Rechartsは同じorientationのY軸を追加すると、後から追加したものが外側に配置される
    // そのため、2番目を先にレンダリングし、1番目を後にレンダリングする必要がある

    // 各メトリクスのインデックスを取得
    const metricIndices = new Map<string, number>();
    orderedMetrics.forEach((metric, index) => {
      metricIndices.set(metric, index);
    });

    // 特定の順番でY軸を作成
    const createAxis = (metric: string, targetIndex: number) => {
      const position = getAxisPosition(targetIndex);
      const unit = METRIC_UNITS[metric as MetricType];
      const seriesForMetric = visibleSeries.find(s => s.metric === metric);
      const color = seriesForMetric?.color || '#6b7280';
      // メトリクスごとの設定を取得（左右で共有せず、メトリクスごとに独立）
      const axisConfig = config.yAxisConfig?.[metric as MetricType];

      // 各軸のドメインを固定値で設定
      const metricRange = METRIC_RANGES[metric as MetricType];
      const min = axisConfig?.min !== undefined ? axisConfig.min : metricRange[0];
      const max = axisConfig?.max !== undefined ? axisConfig.max : metricRange[1];

      // レスポンシブな軸幅
      const axisWidths = getResponsiveAxisWidth();
      const fontSizes = getFontSizes();

      // Y軸の基本設定
      let orientation: 'left' | 'right';
      let width = axisWidths.inner;
      let labelOffset = 8;
      let tickDx = 0;

      // 各位置に応じた設定
      switch(position.side) {
        case 'left1':  // 左1（内側）
          orientation = 'left';
          width = axisWidths.inner;
          labelOffset = 8;
          break;
        case 'left2':  // 左2（外側）
          orientation = 'left';
          width = axisWidths.outer;
          labelOffset = 25;
          tickDx = -8;
          break;
        case 'right1': // 右1（内側）
          orientation = 'right';
          width = axisWidths.inner;
          labelOffset = 8;
          break;
        case 'right2': // 右2（外側）
          orientation = 'right';
          width = axisWidths.outer;
          labelOffset = 25;
          tickDx = 8;
          break;
      }

      // 軸ラベルのテキストを画面サイズに応じて調整
      const getAxisLabel = () => {
        if (isMobile) return unit; // モバイルは単位のみ
        if (isTablet) return `${t(`metrics.${metric}`).slice(0, 4)} (${unit})`; // タブレットは短縮
        return `${t(`metrics.${metric}`)} (${unit})`; // デスクトップはフル表示
      };

      const axisProps: any = {
        yAxisId: metric,
        orientation: orientation,
        stroke: color,
        tick: { fontSize: fontSizes.tick, fill: color, dx: tickDx },
        tickFormatter: (value: any) => Math.round(value).toString(),
        width: width,
        domain: [min, max],
        scale: "linear",
        allowDataOverflow: true,
        allowDecimals: false,
        tickMargin: 3,
        ticks: Array.from({ length: commonTickCount }, (_, i) =>
          min + (max - min) * (i / (commonTickCount - 1))
        ),
        label: {
          value: getAxisLabel(),
          angle: orientation === 'left' ? -90 : 90,
          position: orientation === 'left' ? 'insideLeft' : 'insideRight',
          offset: labelOffset,
          style: { fontSize: fontSizes.label, fill: color, textAnchor: 'middle' }
        },
        onClick: () => {
          // メトリクス情報を含めてダイアログを開く
          setTempAxisConfig({ metric });
          setAxisSettingsOpen(orientation === 'left' ? 'left' : 'right');
        },
        style: { cursor: 'pointer' }
      };

      const yAxis = <YAxis key={metric} {...axisProps} />;

      return yAxis;
    };

    // 4軸を常にレンダリング（使わない軸は透明化）
    const createPlaceholderAxis = (position: number) => {
      const { side } = getAxisPosition(position);
      const axisWidths = getResponsiveAxisWidth();
      const isOuter = side === 'left2' || side === 'right2';
      const isRight = side === 'right1' || side === 'right2';

      return (
        <YAxis
          key={`placeholder-${position}`}
          yAxisId={`placeholder-${position}`}
          orientation={isRight ? 'right' : 'left'}
          width={isOuter ? axisWidths.outer : axisWidths.inner}
          stroke="transparent"
          tick={false}
          axisLine={false}
          domain={[0, 100]}
        />
      );
    };

    // 正しい順番でY軸を作成
    // Rechartsは後から追加した同じorientationのY軸を内側に配置する
    const axes: JSX.Element[] = [];

    // 実験結果に基づいた順序：
    // 左側: 2番目を先に（外側）、1番目を後に（内側）
    // 右側: 4番目を先に（外側）、3番目を後に（内側）

    // 2番目のメトリクス（左2・外側）
    if (orderedMetrics[1]) {
      axes.push(createAxis(orderedMetrics[1], 1));
    } else {
      axes.push(createPlaceholderAxis(1));
    }

    // 1番目のメトリクス（左1・内側）
    if (orderedMetrics[0]) {
      axes.push(createAxis(orderedMetrics[0], 0));
    } else {
      axes.push(createPlaceholderAxis(0));
    }

    // 4番目のメトリクス（右2・外側）
    if (orderedMetrics[3]) {
      axes.push(createAxis(orderedMetrics[3], 3));
    } else {
      axes.push(createPlaceholderAxis(3));
    }

    // 3番目のメトリクス（右1・内側）
    if (orderedMetrics[2]) {
      axes.push(createAxis(orderedMetrics[2], 2));
    } else {
      axes.push(createPlaceholderAxis(2));
    }

    return axes;
  };

  return (
    <>
      {/* 軸設定ダイアログ（モーダル） */}
      {axisSettingsOpen && (
        <>
          {/* オーバーレイ */}
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => {
            setAxisSettingsOpen(null);
            setTempAxisConfig({});
          }} />
          <AxisSettingsDialog side={axisSettingsOpen} metric={tempAxisConfig.metric} />
        </>
      )}

      {/* 軸設定パネル（タブ付き） */}
      {showAxisConfig && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowAxisConfig(false)} />
          <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-96 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">軸の設定</h3>
            </div>

            {/* タブ */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveConfigTab('common')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeConfigTab === 'common'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                共通設定
              </button>
              {Array.from(new Set(data.map(d => d.metric))).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setActiveConfigTab(metric)}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    activeConfigTab === metric
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {t(`metrics.${metric}`)}
                </button>
              ))}
            </div>

            {/* パネル内容 */}
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {activeConfigTab === 'common' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Y軸目盛り数（全軸共通）
                    </label>
                    <input
                      type="number"
                      value={commonTickCount}
                      onChange={(e) => {
                        const value = Math.max(2, Math.min(10, Number(e.target.value)));
                        setCommonTickCount(value);
                      }}
                      min="2"
                      max="10"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      すべてのY軸に適用される目盛り数を設定します（2〜10）
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      X軸目盛り数
                    </label>
                    <select
                      value={config.xAxisConfig?.ticks ?? 'auto'}
                      onChange={(e) => {
                        const newConfig = { ...config };
                        if (!newConfig.xAxisConfig) newConfig.xAxisConfig = {};
                        newConfig.xAxisConfig.ticks = e.target.value === 'auto' ? undefined : Number(e.target.value);
                        onConfigChange(newConfig);
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="auto">自動</option>
                      <option value="4">約5個表示</option>
                      <option value="6">約7個表示</option>
                      <option value="9">約10個表示</option>
                      <option value="14">約15個表示</option>
                      <option value="19">約20個表示</option>
                      <option value="29">約30個表示</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t(`metrics.${activeConfigTab}`)}の軸設定
                  </h4>

                  {/* メトリクス固有の設定 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      最小値
                    </label>
                    <input
                      type="number"
                      value={config.yAxisConfig?.[activeConfigTab]?.min ?? METRIC_RANGES[activeConfigTab as MetricType]?.[0] ?? 0}
                      onChange={(e) => {
                        const newConfig = { ...config };
                        if (!newConfig.yAxisConfig) newConfig.yAxisConfig = {};
                        if (!newConfig.yAxisConfig[activeConfigTab]) newConfig.yAxisConfig[activeConfigTab] = {};
                        newConfig.yAxisConfig[activeConfigTab].min = Number(e.target.value);
                        onConfigChange(newConfig);
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      最大値
                    </label>
                    <input
                      type="number"
                      value={config.yAxisConfig?.[activeConfigTab]?.max ?? METRIC_RANGES[activeConfigTab as MetricType]?.[1] ?? 100}
                      onChange={(e) => {
                        const newConfig = { ...config };
                        if (!newConfig.yAxisConfig) newConfig.yAxisConfig = {};
                        if (!newConfig.yAxisConfig[activeConfigTab]) newConfig.yAxisConfig[activeConfigTab] = {};
                        newConfig.yAxisConfig[activeConfigTab].max = Number(e.target.value);
                        onConfigChange(newConfig);
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    単位: {METRIC_UNITS[activeConfigTab as MetricType]}
                  </div>
                </div>
              )}
            </div>

            {/* ボタン */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
              <button
                onClick={() => setShowAxisConfig(false)}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  // 設定を適用
                  setShowAxisConfig(false);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                適用
              </button>
            </div>
          </div>
        </>
      )}

    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden relative">

      {/* ヘッダー */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {chartTitle ? (
              isEditingTitle ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="px-2 py-1 text-sm font-medium bg-white dark:bg-gray-700 border border-primary-500 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') handleTitleCancel();
                    }}
                  />
                  <button onClick={handleTitleSave} className="p-1 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={handleTitleCancel} className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1 group">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{chartTitle}</h3>
                  <button
                    onClick={() => {
                      setTempTitle(chartTitle);
                      setIsEditingTitle(true);
                    }}
                    className="p-0.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )
            ) : null}
          </div>

          <div className="flex items-center space-x-2">
            {/* グラフタイプ選択 */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded p-0.5">
              {(['line', 'bar', 'area'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => onConfigChange({ ...config, type })}
                  className={`p-1.5 rounded transition-all ${
                    config.type === type
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {chartTypeIcons[type]}
                </button>
              ))}
            </div>

            {/* 正規化トグル */}
            <button
              onClick={() => setNormalizeData(!normalizeData)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                normalizeData
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {normalizeData ? '正規化' : '実数値'}
            </button>

            {/* アクションボタン */}
            <div className="flex items-center space-x-0.5 bg-gray-100 dark:bg-gray-700 rounded p-0.5">
              <button
                onClick={resetZoom}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded hover:bg-white/50 dark:hover:bg-gray-600"
                title="リセット"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleExport}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded hover:bg-white/50 dark:hover:bg-gray-600"
                title="エクスポート"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setShowGrid(!showGrid);
                }}
                className={`p-1.5 rounded ${
                  showGrid
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-600'
                }`}
                title="グリッド"
              >
                <Grid3x3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowAxisConfig(!showAxisConfig)}
                className={`p-1.5 rounded ${
                  showAxisConfig
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-600'
                }`}
                title="軸設定"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* グラフサイズ設定 */}
            <div className="relative">
              <button
                onClick={() => {
                  setTempHeight(chartHeight);
                  setShowHeightSetting(!showHeightSetting);
                }}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="グラフ高さ"
              >
                H: {chartHeight}px
              </button>
              {showHeightSetting && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowHeightSetting(false)} />
                  <div className="absolute right-0 top-8 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">グラフの高さ</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={tempHeight}
                        onChange={(e) => setTempHeight(Number(e.target.value))}
                        min="200"
                        max="800"
                        step="10"
                        className="w-24 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-500">px</span>
                      <button
                        onClick={() => {
                          onChartHeightChange?.(tempHeight);
                          setShowHeightSetting(false);
                        }}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        適用
                      </button>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {[200, 320, 400, 600].map(h => (
                        <button
                          key={h}
                          onClick={() => {
                            setTempHeight(h);
                            onChartHeightChange?.(h);
                            setShowHeightSetting(false);
                          }}
                          className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 凡例 */}
      {config.showLegend && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {series.map(s => (
              <div key={s.key} className="relative">
                <div
                  onClick={() => toggleSeries(s.key)}
                  className={`group flex items-center space-x-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-all ${
                    hiddenSeries.has(s.key)
                      ? 'bg-gray-200/50 dark:bg-gray-700/30 text-gray-400 dark:text-gray-500'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm hover:shadow'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setColorPickerOpen(colorPickerOpen === s.key ? null : s.key);
                    }}
                    className={`w-3 h-3 rounded-full border border-white dark:border-gray-600 ${
                      hiddenSeries.has(s.key) ? 'opacity-30' : ''
                    }`}
                    style={{ backgroundColor: s.color }}
                  />
                  <span className={`${hiddenSeries.has(s.key) ? 'line-through' : ''}`}>
                    {s.name}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">({s.unit})</span>
                </div>

                {/* カラーピッカー */}
                {colorPickerOpen === s.key && (
                  <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50" style={{ minWidth: '260px' }}>
                    <div className="grid grid-cols-5 gap-1 mb-2">
                      {presetColors.map(color => (
                        <button
                          key={color}
                          onClick={() => changeSeriesColor(s.key, color)}
                          className="w-8 h-8 rounded border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="space-y-3 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={s.color}
                          onChange={(e) => changeSeriesColor(s.key, e.target.value)}
                          className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                          title="カスタムカラー"
                        />
                        <input
                          type="text"
                          value={s.color}
                          onChange={(e) => changeSeriesColor(s.key, e.target.value)}
                          placeholder="#000000"
                          className="flex-1 px-2 py-1 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                          透明度: {Math.round((seriesOpacity[s.key] || 0.9) * 100)}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={Math.round((seriesOpacity[s.key] || 0.9) * 100)}
                          onChange={(e) => changeSeriesOpacity(s.key, Number(e.target.value) / 100)}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                      <button
                        onClick={() => setColorPickerOpen(null)}
                        className="w-full px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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

      {/* グラフ */}
      <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
        <div className="w-full" style={{ height: `${isMobile ? Math.min(chartHeight, 300) : chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent
              data={chartData}
              margin={{
                top: 5,
                right: getResponsiveMargins().right,  // 常に4軸分のマージンを使用
                left: getResponsiveMargins().left,  // 常に4軸分のマージンを使用
                bottom: isMobile ? 30 : 40
              }}
              barCategoryGap={config.type === 'bar' ? '20%' : undefined}
            >
              <defs>
                {visibleSeries.map(s => (
                  <linearGradient key={`gradient-${s.key}`} id={`gradient-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.6}/>
                    <stop offset="95%" stopColor={s.color} stopOpacity={0.05}/>
                  </linearGradient>
                ))}
              </defs>

              {/* グリッド用の非表示Y軸 - グリッドの基準となる */}
              {showGrid && (() => {
                // グリッド用の基準となるメトリクスを取得
                const referenceMetric = shouldUseMultiAxis
                  ? (metricOrder[0] || visibleSeries[0]?.metric)
                  : visibleSeries[0]?.metric;

                if (!referenceMetric) return null;

                const metricConfig = config.yAxisConfig?.[referenceMetric] || {};
                const defaultRange = METRIC_RANGES[referenceMetric as MetricType];
                const min = metricConfig.min !== undefined ? metricConfig.min : defaultRange[0];
                const max = metricConfig.max !== undefined ? metricConfig.max : defaultRange[1];

                const ticks = Array.from({ length: commonTickCount }, (_, i) =>
                  min + (max - min) * (i / (commonTickCount - 1))
                );

                return (
                  <YAxis
                    yAxisId="grid-reference"
                    domain={[min, max]}
                    ticks={ticks}
                    hide={true}
                    width={0}
                  />
                );
              })()}

              {/* グリッド */}
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={config.type === 'line' || config.type === 'area'}
                />
              )}

              <XAxis
                dataKey="time"
                stroke="#6b7280"
                tick={{ fontSize: 10 }}
                height={30}
                interval={(() => {
                  // X軸の表示数を計算
                  const xConfig = config.xAxisConfig?.ticks;
                  if (xConfig !== undefined && xConfig !== null) {
                    // ユーザー設定値からintervalを計算
                    // ticksが目標表示数なので、interval = (全データ数 / 目標数) - 1
                    const targetTicks = xConfig + 1; // "約N個表示"の設定値
                    const calculatedInterval = Math.max(0, Math.floor(chartData.length / targetTicks) - 1);
                    return calculatedInterval;
                  }
                  // 自動調整
                  const dataLength = chartData.length;
                  if (dataLength > 100) {
                    return Math.floor(dataLength / 10) - 1; // 約10個
                  } else if (dataLength > 50) {
                    return Math.floor(dataLength / 8) - 1; // 約8個
                  } else if (dataLength > 20) {
                    return Math.floor(dataLength / 6) - 1; // 約6個
                  }
                  return 'preserveStartEnd'; // デフォルト
                })()}
                onClick={() => {
                  setTempAxisConfig({});
                  setAxisSettingsOpen('x');
                }}
                style={{ cursor: 'pointer' }}
              />

              {/* Y軸 */}
              {renderYAxes()}

              <Tooltip content={<CustomTooltip />} />

              {config.enableZoom && (
                <Brush
                  dataKey="time"
                  height={20}
                  stroke="#9ca3af"
                  fill="#f3f4f6"
                  onChange={(domain: any) => setZoomDomain(domain)}
                  travellerWidth={8}
                  tickFormatter={(value: string) => value.slice(0, 5)}
                />
              )}

              {/* データシリーズ */}
              {visibleSeries.map(s => (
                <DataComponent
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  fill={config.type === 'area' ? `url(#gradient-${s.key})` : s.color}
                  strokeWidth={config.type === 'line' ? 1.5 : 1}
                  yAxisId={s.yAxisId}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  fillOpacity={(seriesOpacity[s.key] || 0.9) * (config.type === 'area' ? 1 : config.type === 'bar' ? 0.8 : 0.7)}
                  strokeOpacity={seriesOpacity[s.key] || 0.9}
                />
              ))}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </>
  );
};

export default DataChartAdvanced;