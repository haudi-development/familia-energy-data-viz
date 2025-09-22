'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Sidebar from '@/components/Sidebar';
import DateRangeSelector from '@/components/DateRangeSelector';
import DeviceSelector from '@/components/DeviceSelector';
import MetricSelector from '@/components/MetricSelector';
import DataChartAdvanced from '@/components/DataChartAdvanced';
import {
  generateDevices,
  generateSensorData,
  generateAlerts
} from '@/utils/mockDataGenerator';
import { Device, DateRange, SensorData, Alert, MetricType, ChartPreset, GraphConfigItem } from '@/types';
import { subDays, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Monitor, BarChart3, ChevronDown, ChevronUp, X, Bookmark, Trash2, Plus, Edit2, RefreshCw } from 'lucide-react';
import { savePreset, getPresets, deletePreset } from '@/utils/presetManager';

type DrawerType = 'period' | 'devices' | 'metrics' | 'presets' | null;

export default function DashboardPage() {
  // State Management
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(),
    end: new Date()
  });
  const [alerts] = useState<Alert[]>([]);
  const [graphs, setGraphs] = useState<GraphConfigItem[]>([]);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [realtimeInterval, setRealtimeInterval] = useState(5);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [presets, setPresets] = useState<ChartPreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  // const [activeGraphId, setActiveGraphId] = useState<string | null>(null);
  const [graphDrawer, setGraphDrawer] = useState<{ graphId: string; type: 'devices' | 'metrics' | 'period' } | null>(null);
  const [currentPresetId, setCurrentPresetId] = useState<string | null>(null);
  const [currentPresetName, setCurrentPresetName] = useState<string | null>(null);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editingPresetName, setEditingPresetName] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  // Initialize dates on client side
  useEffect(() => {
    setMounted(true);

    // Load presets first
    const loadedPresets = getPresets();
    setPresets(loadedPresets);

    // Load devices
    const generatedDevices = generateDevices('office');
    setDevices(generatedDevices);

    // If presets exist, load the first one
    if (loadedPresets.length > 0) {
      const firstPreset = loadedPresets[0];
      setDateRange(firstPreset.dateRange);
      setCurrentPresetId(firstPreset.id);
      setCurrentPresetName(firstPreset.name);
      if (firstPreset.graphs && firstPreset.graphs.length > 0) {
        setGraphs(firstPreset.graphs.map(g => ({ ...g })));
      } else {
        // 旧形式のプリセットへの後方互換性
        setGraphs([{
          id: 'graph-1',
          title: (firstPreset as unknown as { chartTitle?: string }).chartTitle || firstPreset.name,
          selectedDevices: (firstPreset as unknown as { selectedDevices?: string[] }).selectedDevices || [],
          selectedMetrics: (firstPreset as unknown as { selectedMetrics?: MetricType[] }).selectedMetrics || [],
          chartConfig: (firstPreset as unknown as { chartConfig?: ChartConfig }).chartConfig || {
            type: 'line',
            showLegend: true,
            enableZoom: true,
            multiAxis: false,
            showGrid: true,
            displayMode: 'standard'
          },
          customColors: (firstPreset as unknown as { customColors?: Record<string, string> }).customColors || {},
          expanded: true
        }]);
      }
    } else {
      // Only set default values if no presets exist
      const end = new Date();
      const start = subDays(end, 1);
      setDateRange({ start, end });

      // Set default graph with some initial devices and metrics
      setGraphs([{
        id: 'graph-1',
        title: 'グラフ 1',
        // 各タイプから1つずつデバイスを選択
        selectedDevices: [
          generatedDevices.find(d => d.type === 'environmental')?.id,
          generatedDevices.find(d => d.type === 'power')?.id,
          generatedDevices.find(d => d.type === 'hvac')?.id
        ].filter(Boolean) as string[],
        selectedMetrics: ['temperature', 'humidity', 'power'],
        chartConfig: {
          type: 'line',
          showLegend: true,
          enableZoom: true,
          multiAxis: false,
          showGrid: true,
          displayMode: 'standard'
        },
        customColors: {},
        expanded: true,
        dateRange: { start, end }
      }]);
    }

    setAlerts(generateAlerts(generatedDevices, 5));
  }, []);

  // Real-time data updates
  useEffect(() => {
    if (!realtimeEnabled) return;

    const interval = setInterval(() => {
      // Update data for each graph
      setLastUpdate(new Date());
    }, realtimeInterval * 1000);

    return () => clearInterval(interval);
  }, [realtimeEnabled, realtimeInterval]);

  const toggleDrawer = (drawer: DrawerType) => {
    console.log('Toggle drawer:', drawer, 'Current:', openDrawer);
    setOpenDrawer(openDrawer === drawer ? null : drawer);
  };

  const toggleGraphDrawer = (graphId: string, type: 'devices' | 'metrics' | 'period') => {
    if (graphDrawer?.graphId === graphId && graphDrawer?.type === type) {
      setGraphDrawer(null);
    } else {
      setGraphDrawer({ graphId, type });
    }
  };

  // Alert dismissal function - currently unused but kept for future alert management
  // const dismissAlert = useCallback((alertId: string) => {
  //   setAlerts(prev => prev.filter(a => a.id !== alertId));
  // }, []);

  const addGraph = () => {
    const newGraph: GraphConfigItem = {
      id: `graph-${Date.now()}`,
      title: `グラフ ${graphs.length + 1}`,
      // 各タイプから1つずつデバイスを選択
      selectedDevices: [
        devices.find(d => d.type === 'environmental')?.id,
        devices.find(d => d.type === 'power')?.id,
        devices.find(d => d.type === 'hvac')?.id
      ].filter(Boolean) as string[],
      selectedMetrics: ['temperature', 'humidity', 'power'], // デフォルトメトリクス
      chartConfig: {
        type: 'line',
        showLegend: true,
        enableZoom: true,
        multiAxis: false,
        showGrid: true,
        displayMode: 'standard'
      },
      customColors: {},
      expanded: true,
      dateRange: graphs[0]?.dateRange || dateRange, // 既存グラフの期間設定を引き継ぐ
      chartHeight: 400
    };
    setGraphs([...graphs, newGraph]);
  };

  const removeGraph = (graphId: string) => {
    if (graphs.length <= 1) {
      alert('最後のグラフは削除できません');
      return;
    }
    setGraphs(graphs.filter(g => g.id !== graphId));
  };

  const updateGraph = (graphId: string, updates: Partial<GraphConfigItem>) => {
    setGraphs(graphs.map(g => g.id === graphId ? { ...g, ...updates } : g));
  };

  const generateDataForGraph = (graph: GraphConfigItem): SensorData[] => {
    const graphDateRange = graph.dateRange || dateRange;
    if (!graphDateRange.start || !graphDateRange.end || devices.length === 0) return [];
    const selectedDeviceObjects = devices.filter(d => graph.selectedDevices.includes(d.id));
    const allData = generateSensorData(selectedDeviceObjects, graphDateRange, 5);
    return allData.filter(sd => graph.selectedMetrics.includes(sd.metric));
  };

  const handleSavePreset = () => {
    console.log('handleSavePreset called', { presetName });
    if (!presetName.trim()) {
      console.log('Preset name is empty');
      return;
    }

    try {
      // 全てのグラフの設定を保存
      const newPreset: ChartPreset = {
        id: `preset-${Date.now()}`,
        name: presetName,
        dateRange,
        graphs: graphs.map(g => ({ ...g })), // 全グラフの設定をコピー
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Saving preset:', newPreset);
      savePreset(newPreset);
      const updatedPresets = getPresets();
      console.log('Updated presets:', updatedPresets);
      setPresets(updatedPresets);
      setCurrentPresetId(newPreset.id);
      setCurrentPresetName(newPreset.name);
      setPresetName('');
      setShowSavePreset(false);
      alert('プリセットを保存しました');
    } catch (error) {
      console.error('Error saving preset:', error);
      alert('プリセットの保存に失敗しました: ' + error);
    }
  };

  const handleLoadPreset = (preset: ChartPreset) => {
    console.log('Loading preset:', preset);
    console.log('Current devices:', devices);
    setDateRange(preset.dateRange);
    // プリセットから全グラフを復元
    if (preset.graphs && preset.graphs.length > 0) {
      // デバイスIDの検証とマッピング
      const restoredGraphs = preset.graphs.map(g => {
        const validDeviceIds = g.selectedDevices.filter(deviceId =>
          devices.some(d => d.id === deviceId)
        );

        // メトリクスが設定されていない場合のデフォルト値
        const validMetrics = g.selectedMetrics && g.selectedMetrics.length > 0
          ? g.selectedMetrics
          : ['temperature', 'humidity', 'power'] as MetricType[];

        // 有効なデバイスがない場合、現在のデバイスから同じタイプのものを選択
        if (validDeviceIds.length === 0 && devices.length > 0) {
          console.warn(`No valid devices found for graph ${g.id}, selecting default devices`);
          // 各タイプから1つずつデバイスを選択
          const defaultDevices = [
            devices.find(d => d.type === 'environmental')?.id,
            devices.find(d => d.type === 'power')?.id,
            devices.find(d => d.type === 'hvac')?.id
          ].filter(Boolean) as string[];

          return {
            ...g,
            selectedDevices: defaultDevices.length > 0 ? defaultDevices : [devices[0].id],
            selectedMetrics: validMetrics
          };
        }

        return {
          ...g,
          selectedDevices: validDeviceIds,
          selectedMetrics: validMetrics
        };
      });

      setGraphs(restoredGraphs);
    } else {
      // 旧形式のプリセットへの後方互換性
      console.warn('Loading old format preset, converting to new format');
      setGraphs([{
        id: 'graph-1',
        title: (preset as unknown as { chartTitle?: string }).chartTitle || preset.name,
        selectedDevices: (preset as unknown as { selectedDevices?: string[] }).selectedDevices || [],
        selectedMetrics: (preset as unknown as { selectedMetrics?: MetricType[] }).selectedMetrics || [],
        chartConfig: (preset as unknown as { chartConfig?: ChartConfig }).chartConfig || {
          type: 'line',
          showLegend: true,
          enableZoom: true,
          multiAxis: false,
          displayMode: 'standard'
        },
        customColors: (preset as unknown as { customColors?: Record<string, string> }).customColors || {},
        expanded: true,
        dateRange: preset.dateRange
      }]);
    }
    setCurrentPresetId(preset.id);
    setCurrentPresetName(preset.name);
    setOpenDrawer(null);
  };

  const handleUpdatePreset = () => {
    if (!currentPresetId) return;

    const preset = presets.find(p => p.id === currentPresetId);
    if (!preset) return;

    const updatedPreset: ChartPreset = {
      ...preset,
      dateRange,
      graphs: graphs.map(g => ({ ...g })), // 全グラフの設定を更新
      updatedAt: new Date()
    };

    savePreset(updatedPreset);
    setPresets(getPresets());
    alert(`プリセット 「${preset.name}」 を更新しました`);
  };

  const handleRenamePreset = (presetId: string, newName: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    const updatedPreset: ChartPreset = {
      ...preset,
      name: newName,
      // chartTitleは変更しない（プリセット名とグラフタイトルは別管理）
      updatedAt: new Date()
    };

    savePreset(updatedPreset);
    setPresets(getPresets());
    setEditingPresetId(null);
    setEditingPresetName('');
  };

  const handleDeletePreset = (id: string) => {
    deletePreset(id);
    setPresets(getPresets());
  };

  return (
    <ThemeProvider>
      <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeTab="analysis" 
          onTabChange={() => {}}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Compact Control Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-3 md:px-4 py-2 md:py-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                {/* Control Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Preset Selector */}
                  <button
                    onClick={() => toggleDrawer('presets')}
                    className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all text-xs md:text-sm
                      ${openDrawer === 'presets'
                        ? 'bg-[#50A69F]/20 dark:bg-[#50A69F]/30 text-[#3A7A74] dark:text-[#6BBDB6] shadow-sm border border-[#50A69F]/30 dark:border-[#50A69F]/50'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-transparent'
                      }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <div className="text-left">
                      <div className="text-xs opacity-75 hidden md:block">プリセット</div>
                      <div className="font-medium">
                        {presets.length > 0 ? `${presets.length} 件` : '未保存'}
                      </div>
                    </div>
                    {openDrawer === 'presets' ? <ChevronUp className="w-3 h-3 ml-1 md:ml-2" /> : <ChevronDown className="w-3 h-3 ml-1 md:ml-2" />}
                  </button>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

                  {/* Status Info */}
                  <div className="hidden md:flex items-center space-x-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{graphs.length}</span> グラフ表示中
                      {currentPresetName && (
                        <span className="ml-2">/ プリセット: <span className="font-medium text-[#50A69F] dark:text-[#6BBDB6]">{currentPresetName}</span></span>
                      )}
                    </span>
                    {mounted && lastUpdate && (
                      <span className="text-gray-600 dark:text-gray-400">
                        更新: <span className="font-medium text-gray-900 dark:text-gray-100">
                          {format(lastUpdate, 'HH:mm:ss', { locale: ja })}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center space-x-2 md:space-x-3">
                  {/* Realtime Toggle */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setRealtimeEnabled(!realtimeEnabled)}
                      className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all
                        ${realtimeEnabled
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {realtimeEnabled && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                      <span className="hidden sm:inline">{realtimeEnabled ? 'リアルタイム ON' : 'リアルタイム OFF'}</span>
                      <span className="sm:hidden">{realtimeEnabled ? 'ON' : 'OFF'}</span>
                    </button>
                    {realtimeEnabled && (
                      <select
                        value={realtimeInterval}
                        onChange={(e) => setRealtimeInterval(Number(e.target.value))}
                        className="px-1 md:px-2 py-1 text-xs md:text-sm rounded-md border border-gray-300 dark:border-gray-600
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value={1}>1秒</option>
                        <option value={5}>5秒</option>
                        <option value={10}>10秒</option>
                        <option value={30}>30秒</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Drawer */}
            {openDrawer && (
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 animate-slide-down">
                <div className="px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 max-w-6xl">
                      {openDrawer === 'presets' && (
                        <div style={{display: 'block'}}>
                          <div className="mb-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                プリセット管理
                                {currentPresetId && (
                                  <span className="ml-2 text-xs text-[#50A69F] dark:text-[#6BBDB6]">
                                    (現在: {presets.find(p => p.id === currentPresetId)?.name})
                                  </span>
                                )}
                              </h3>
                              <div className="flex items-center space-x-2">
                                {currentPresetId && (
                                  <button
                                    onClick={handleUpdatePreset}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                                    title="現在のプリセットを上書き保存"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>上書き保存</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    console.log('Save button clicked');
                                    setShowSavePreset(!showSavePreset);
                                  }}
                                  className="flex items-center space-x-1 px-3 py-1.5 bg-[#50A69F] hover:bg-[#3A7A74] text-white rounded text-sm font-medium"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>新規保存</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {showSavePreset && (
                            <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={presetName}
                                  onChange={(e) => setPresetName(e.target.value)}
                                  placeholder="プリセット名を入力"
                                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50A69F] text-sm"
                                  autoFocus
                                  onCompositionStart={() => setIsComposing(true)}
                                  onCompositionEnd={() => setIsComposing(false)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isComposing && presetName.trim()) handleSavePreset();
                                    if (e.key === 'Escape') {
                                      setShowSavePreset(false);
                                      setPresetName('');
                                    }
                                  }}
                                />
                                <button
                                  onClick={handleSavePreset}
                                  disabled={!presetName.trim()}
                                  className="px-3 py-2 bg-[#50A69F] hover:bg-[#3A7A74] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                  保存
                                </button>
                                <button
                                  onClick={() => {
                                    setShowSavePreset(false);
                                    setPresetName('');
                                  }}
                                  className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                  キャンセル
                                </button>
                              </div>
                            </div>
                          )}

                          {presets.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {presets.map(preset => (
                                <div
                                  key={preset.id}
                                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 transition-colors"
                                >
                                  <div
                                    onClick={() => handleLoadPreset(preset)}
                                    className="flex-1 cursor-pointer"
                                  >
                                    {editingPresetId === preset.id ? (
                                      <div className="flex items-center space-x-2">
                                        <input
                                          type="text"
                                          value={editingPresetName}
                                          onChange={(e) => setEditingPresetName(e.target.value)}
                                          onClick={(e) => e.stopPropagation()}
                                          onCompositionStart={(e) => {
                                            e.stopPropagation();
                                            setIsComposing(true);
                                          }}
                                          onCompositionEnd={(e) => {
                                            e.stopPropagation();
                                            setIsComposing(false);
                                          }}
                                          onKeyDown={(e) => {
                                            e.stopPropagation();
                                            if (e.key === 'Enter' && !isComposing) {
                                              handleRenamePreset(preset.id, editingPresetName);
                                            }
                                            if (e.key === 'Escape') {
                                              setEditingPresetId(null);
                                              setEditingPresetName('');
                                            }
                                          }}
                                          className="flex-1 px-2 py-1 bg-white dark:bg-gray-900 border border-[#50A69F] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#50A69F]"
                                          autoFocus
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {preset.name}
                                          </span>
                                          {currentPresetId === preset.id && (
                                            <span className="px-2 py-0.5 bg-[#50A69F]/20 dark:bg-[#50A69F]/30 text-[#3A7A74] dark:text-[#6BBDB6] text-xs rounded-full">
                                              使用中
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                          {preset.graphs ? `${preset.graphs.length}グラフ` : 'レガシー形式'}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingPresetId(preset.id);
                                        setEditingPresetName(preset.name);
                                      }}
                                      className="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                      title="名前を変更"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePreset(preset.id);
                                      }}
                                      className="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                      title="削除"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                              保存されたプリセットがありません
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Close Button */}
                    <button
                      onClick={() => setOpenDrawer(null)}
                      className="ml-4 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Chart Area */}
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto space-y-4 p-3 md:p-6">
              {graphs.map((graph) => (
                <div key={graph.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  {/* Graph Header */}
                  <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <button
                          onClick={() => updateGraph(graph.id, { expanded: !graph.expanded })}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                        >
                          {graph.expanded ? <ChevronUp className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                        <input
                          type="text"
                          value={graph.title}
                          onChange={(e) => updateGraph(graph.id, { title: e.target.value })}
                          className="text-base md:text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#50A69F] rounded px-2 py-1 flex-1 min-w-0"
                          placeholder="グラフタイトル"
                        />
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-2 ml-7 sm:ml-0 flex-shrink-0">
                        {/* Period Selector for this graph */}
                        <button
                          onClick={() => toggleGraphDrawer(graph.id, 'period')}
                          className={`flex items-center space-x-1 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm transition-all ${
                            graphDrawer?.graphId === graph.id && graphDrawer?.type === 'period'
                              ? 'bg-[#50A69F]/20 dark:bg-[#50A69F]/30 text-[#3A7A74] dark:text-[#6BBDB6]'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span className="hidden sm:inline">
                            {graph.dateRange && graph.dateRange.start && graph.dateRange.end
                              ? `${format(graph.dateRange.start, 'MM/dd', { locale: ja })} - ${format(graph.dateRange.end, 'MM/dd', { locale: ja })}`
                              : '期間未設定'}
                          </span>
                          <span className="sm:hidden">期間</span>
                        </button>
                        {/* Device Selector for this graph */}
                        <button
                          onClick={() => toggleGraphDrawer(graph.id, 'devices')}
                          className={`flex items-center space-x-1 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm transition-all ${
                            graphDrawer?.graphId === graph.id && graphDrawer?.type === 'devices'
                              ? 'bg-[#50A69F]/20 dark:bg-[#50A69F]/30 text-[#3A7A74] dark:text-[#6BBDB6]'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Monitor className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span className="hidden sm:inline">{graph.selectedDevices.length} デバイス</span>
                          <span className="sm:hidden">{graph.selectedDevices.length}</span>
                        </button>
                        {/* Metrics Selector for this graph */}
                        <button
                          onClick={() => toggleGraphDrawer(graph.id, 'metrics')}
                          className={`flex items-center space-x-1 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm transition-all ${
                            graphDrawer?.graphId === graph.id && graphDrawer?.type === 'metrics'
                              ? 'bg-[#50A69F]/20 dark:bg-[#50A69F]/30 text-[#3A7A74] dark:text-[#6BBDB6]'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <BarChart3 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span className="hidden sm:inline">{graph.selectedMetrics.length} メトリクス</span>
                          <span className="sm:hidden">{graph.selectedMetrics.length}</span>
                        </button>
                        {/* Remove Graph */}
                        {graphs.length > 1 && (
                          <button
                            onClick={() => removeGraph(graph.id)}
                            className="p-1 md:p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="グラフを削除"
                          >
                            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Inline selectors panel - outside of header */}
                  {graphDrawer?.graphId === graph.id && (
                    <div className="px-3 md:px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      {graphDrawer.type === 'period' && mounted && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            期間選択
                          </h4>
                          <DateRangeSelector
                            value={graph.dateRange || dateRange}
                            onChange={(newDateRange) => updateGraph(graph.id, { dateRange: newDateRange })}
                          />
                        </div>
                      )}
                      {graphDrawer.type === 'devices' && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            デバイス選択
                          </h4>
                          <DeviceSelector
                            devices={devices}
                            selectedDevices={graph.selectedDevices}
                            onSelectionChange={(newDevices) => updateGraph(graph.id, { selectedDevices: newDevices })}
                            compact={true}
                          />
                        </div>
                      )}
                      {graphDrawer.type === 'metrics' && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            データ種別選択
                          </h4>
                          <MetricSelector
                            selectedMetrics={graph.selectedMetrics}
                            onSelectionChange={(newMetrics) => updateGraph(graph.id, { selectedMetrics: newMetrics })}
                            compact={true}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Graph Content */}
                  {graph.expanded && (
                    <div className="p-3 md:p-4">
                      <DataChartAdvanced
                        data={generateDataForGraph(graph)}
                        config={graph.chartConfig}
                        onConfigChange={(newConfig) => updateGraph(graph.id, { chartConfig: newConfig })}
                        chartTitle=""
                        onChartTitleChange={() => {}}
                        customColors={graph.customColors || {}}
                        onCustomColorsChange={(colors) => updateGraph(graph.id, { customColors: colors })}
                        chartHeight={graph.chartHeight || 400}
                        onChartHeightChange={(height) => updateGraph(graph.id, { chartHeight: height })}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Add Graph Button at Bottom */}
              <div className="flex justify-center py-8">
                <button
                  onClick={addGraph}
                  className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg transition-all hover:border-gray-400 dark:hover:border-gray-500"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">新しいグラフを追加</span>
                </button>
              </div>
            </div>
          </main>

          {/* Minimal Status Bar */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 md:px-4 py-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 md:space-x-4">
                <span className="text-gray-500 dark:text-gray-400 hidden md:inline">
                  Familia Energy Dashboard v1.0
                </span>
                <span className="text-gray-500 dark:text-gray-400 md:hidden">
                  Familia Energy
                </span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                <span className="text-gray-500 dark:text-gray-400">
                  {graphs.filter(g => g.selectedDevices.length > 0 && g.selectedMetrics.length > 0).length} / {graphs.length} アクティブ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </ThemeProvider>
  );
}