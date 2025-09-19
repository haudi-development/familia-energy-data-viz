import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Monitor, BarChart3, X, Move, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import DateRangeSelector from './DateRangeSelector';
import DeviceSelector from './DeviceSelector';
import MetricSelector from './MetricSelector';
import { Device, DateRange, MetricType } from '../types';

interface FloatingControlsProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  devices: Device[];
  selectedDevices: string[];
  onDevicesChange: (devices: string[]) => void;
  selectedMetrics: MetricType[];
  onMetricsChange: (metrics: MetricType[]) => void;
}

type PanelType = 'period' | 'devices' | 'metrics' | null;

const FloatingControls: React.FC<FloatingControlsProps> = ({
  dateRange,
  onDateRangeChange,
  devices,
  selectedDevices,
  onDevicesChange,
  selectedMetrics,
  onMetricsChange,
}) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [expandedPanel, setExpandedPanel] = useState<PanelType>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep panel within viewport
      const maxX = window.innerWidth - (panelRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (panelRef.current?.offsetHeight || 0);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const togglePanel = (panel: PanelType) => {
    setExpandedPanel(expandedPanel === panel ? null : panel);
  };

  const controls = [
    {
      id: 'period' as PanelType,
      icon: Calendar,
      label: '期間',
      value: `${format(dateRange.start, 'MM/dd', { locale: ja })}-${format(dateRange.end, 'MM/dd', { locale: ja })}`,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'devices' as PanelType,
      icon: Monitor,
      label: 'デバイス',
      value: `${selectedDevices.length}台`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'metrics' as PanelType,
      icon: BarChart3,
      label: 'データ',
      value: `${selectedMetrics.length}種類`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800'
    }
  ];

  return (
    <div
      ref={panelRef}
      className="fixed z-50 select-none"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {/* Main Control Bar */}
      <div className={`
        bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg
        rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50
        transition-all duration-300
        ${isMinimized ? 'opacity-75 hover:opacity-100' : ''}
      `}>
        {/* Header */}
        <div 
          className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              コントロール
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isMinimized ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <button
              onClick={() => setExpandedPanel(null)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Control Buttons */}
        {!isMinimized && (
          <div className="flex items-center p-2 space-x-2">
            {controls.map(control => {
              const Icon = control.icon;
              const isExpanded = expandedPanel === control.id;
              return (
                <button
                  key={control.id}
                  onClick={() => togglePanel(control.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg
                    transition-all duration-200 border
                    ${isExpanded 
                      ? `${control.bgColor} ${control.borderColor}` 
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isExpanded ? control.color : 'text-gray-500'}`} />
                  <div className="text-left">
                    <p className={`text-xs font-medium ${isExpanded ? control.color : 'text-gray-600 dark:text-gray-300'}`}>
                      {control.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {control.value}
                    </p>
                  </div>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              );
            })}
          </div>
        )}

        {/* Expanded Panel */}
        {!isMinimized && expandedPanel && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 max-w-2xl max-h-96 overflow-auto">
            {expandedPanel === 'period' && (
              <DateRangeSelector
                value={dateRange}
                onChange={onDateRangeChange}
              />
            )}
            {expandedPanel === 'devices' && (
              <DeviceSelector
                devices={devices}
                selectedDevices={selectedDevices}
                onSelectionChange={onDevicesChange}
              />
            )}
            {expandedPanel === 'metrics' && (
              <MetricSelector
                selectedMetrics={selectedMetrics}
                onSelectionChange={onMetricsChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingControls;