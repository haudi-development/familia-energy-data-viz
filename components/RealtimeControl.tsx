import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { format } from 'date-fns';

interface RealtimeControlProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  interval: number;
  onIntervalChange: (interval: number) => void;
  lastUpdate: Date | null;
}

const RealtimeControl: React.FC<RealtimeControlProps> = ({
  enabled,
  onToggle,
  interval,
  onIntervalChange,
  lastUpdate
}) => {
  const { t } = useTranslation();

  const intervals = [
    { value: 1, label: '1s' },
    { value: 5, label: '5s' },
    { value: 10, label: '10s' },
    { value: 30, label: '30s' },
    { value: 60, label: '1m' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            enabled 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            {enabled ? (
              <Wifi className="w-5 h-5" />
            ) : (
              <WifiOff className="w-5 h-5" />
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {t('realtime.label')}
            </h3>
            {lastUpdate && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('realtime.lastUpdate')}: {format(lastUpdate, 'HH:mm:ss')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Interval Selector */}
          <select
            value={interval}
            onChange={(e) => onIntervalChange(Number(e.target.value))}
            disabled={!enabled}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 
              rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {intervals.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Toggle Button */}
          <button
            onClick={() => onToggle(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full
              transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500
              ${enabled 
                ? 'bg-primary-600 dark:bg-primary-500' 
                : 'bg-gray-200 dark:bg-gray-600'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white
                transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>

      {/* Animation Indicator */}
      {enabled && (
        <div className="mt-3 flex items-center justify-center">
          <RefreshCw className="w-4 h-4 text-primary-600 dark:text-primary-400 animate-spin" />
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            {t('realtime.enabled')}
          </span>
        </div>
      )}
    </div>
  );
};

export default RealtimeControl;