import React from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Wind, Zap, Users, Sun, CheckSquare, Square, Thermometer } from 'lucide-react';
import { MetricType } from '../types';

interface MetricSelectorProps {
  selectedMetrics: MetricType[];
  onSelectionChange: (metrics: MetricType[]) => void;
  compact?: boolean;
}

const MetricSelector: React.FC<MetricSelectorProps> = ({ 
  selectedMetrics, 
  onSelectionChange,
  compact = false
}) => {
  const { t } = useTranslation();

  const metrics: { id: MetricType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'temperature', label: t('metrics.temperature'), icon: <Thermometer className="w-4 h-4" />, color: 'text-red-500' },
    { id: 'humidity', label: t('metrics.humidity'), icon: <Droplets className="w-4 h-4" />, color: 'text-blue-500' },
    { id: 'co2', label: t('metrics.co2'), icon: <Wind className="w-4 h-4" />, color: 'text-green-500' },
    { id: 'power', label: t('metrics.power'), icon: <Zap className="w-4 h-4" />, color: 'text-yellow-500' },
    { id: 'occupancy', label: t('metrics.occupancy'), icon: <Users className="w-4 h-4" />, color: 'text-purple-500' },
    { id: 'light', label: t('metrics.light'), icon: <Sun className="w-4 h-4" />, color: 'text-orange-500' },
  ];

  const toggleMetric = (metric: MetricType) => {
    if (selectedMetrics.includes(metric)) {
      onSelectionChange(selectedMetrics.filter(m => m !== metric));
    } else {
      onSelectionChange([...selectedMetrics, metric]);
    }
  };

  const selectAll = () => {
    onSelectionChange(metrics.map(m => m.id));
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  // Compact layout for drawer
  if (compact) {
    return (
      <div className="space-y-2">
        {/* Quick Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={selectAll}
              className="px-2 py-1 text-xs font-medium rounded-md
                bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800
                text-primary-700 dark:text-primary-300 transition-colors"
            >
              全選択
            </button>
            <button
              onClick={deselectAll}
              className="px-2 py-1 text-xs font-medium rounded-md
                bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                text-gray-700 dark:text-gray-300 transition-colors"
            >
              解除
            </button>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selectedMetrics.length}/{metrics.length} 選択中
          </span>
        </div>

        {/* Compact Metric Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          {metrics.map(metric => {
            const isSelected = selectedMetrics.includes(metric.id);
            
            return (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-md transition-all border
                  ${isSelected 
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700' 
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
              >
                <div className={`${metric.color}`}>
                  {React.cloneElement(metric.icon as React.ReactElement, { className: 'w-3 h-3' })}
                </div>
                <span className={`text-xs font-medium ${
                  isSelected 
                    ? 'text-primary-700 dark:text-primary-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {metric.label}
                </span>
                {isSelected && <CheckSquare className="w-3 h-3 text-primary-600 dark:text-primary-400" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Original full layout
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          データ種別
        </h3>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {selectedMetrics.length} 選択中
          </span>
        </div>
      </div>

      {/* Select/Deselect All Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={selectAll}
          className="px-3 py-1 text-sm font-medium rounded-lg
            bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800
            text-primary-700 dark:text-primary-300 transition-colors"
        >
          全て選択
        </button>
        <button
          onClick={deselectAll}
          className="px-3 py-1 text-sm font-medium rounded-lg
            bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
            text-gray-700 dark:text-gray-300 transition-colors"
        >
          選択解除
        </button>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 gap-2">
        {metrics.map(metric => {
          const isSelected = selectedMetrics.includes(metric.id);
          const Icon = isSelected ? CheckSquare : Square;
          
          return (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all
                ${isSelected 
                  ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700' 
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                } border`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
              <div className={`${metric.color}`}>
                {metric.icon}
              </div>
              <span className={`text-sm font-medium ${
                isSelected 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {metric.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MetricSelector;