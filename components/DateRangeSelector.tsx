import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from 'react-i18next';
import { CalendarIcon, Clock } from 'lucide-react';
import { addHours, addDays, addWeeks, addMonths, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from '../types';

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [showCustom, setShowCustom] = useState(false);

  // Ensure value has valid start and end dates - convert to Date objects
  const safeValue = {
    start: value?.start
      ? (value.start instanceof Date ? value.start : new Date(value.start))
      : new Date(Date.now() - 24 * 60 * 60 * 1000), // default to 1 day ago
    end: value?.end
      ? (value.end instanceof Date ? value.end : new Date(value.end))
      : new Date()
  };

  const presets = [
    { label: t('dateRange.3hours'), getValue: () => ({ start: addHours(new Date(), -3), end: new Date() }) },
    { label: t('dateRange.1day'), getValue: () => ({ start: addDays(new Date(), -1), end: new Date() }) },
    { label: t('dateRange.3days'), getValue: () => ({ start: addDays(new Date(), -3), end: new Date() }) },
    { label: t('dateRange.1week'), getValue: () => ({ start: addWeeks(new Date(), -1), end: new Date() }) },
    { label: t('dateRange.1month'), getValue: () => ({ start: addMonths(new Date(), -1), end: new Date() }) },
  ];

  const handlePresetClick = (getValue: () => DateRange) => {
    const range = getValue();
    onChange(range);
    setShowCustom(false);
  };

  const handleCustomRange = () => {
    setShowCustom(!showCustom);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('dateRange.label')}
        </h3>
        <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => handlePresetClick(preset.getValue)}
            className="px-4 py-2 text-sm font-medium rounded-lg 
              bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
              text-gray-700 dark:text-gray-300 transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Clock className="inline-block w-4 h-4 mr-1" />
            {preset.label}
          </button>
        ))}
        <button
          onClick={handleCustomRange}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary-500
            ${showCustom 
              ? 'bg-primary-600 hover:bg-primary-700 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
        >
          {t('dateRange.custom')}
        </button>
      </div>

      {/* Custom Date Range Picker */}
      {showCustom && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('dateRange.from')}
            </label>
            <DatePicker
              selected={safeValue.start}
              onChange={(date) => date && onChange({ ...safeValue, start: date })}
              selectsStart
              startDate={safeValue.start}
              endDate={safeValue.end}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy/MM/dd HH:mm"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              maxDate={safeValue.end}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('dateRange.to')}
            </label>
            <DatePicker
              selected={safeValue.end}
              onChange={(date) => date && onChange({ ...safeValue, end: date })}
              selectsEnd
              startDate={safeValue.start}
              endDate={safeValue.end}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy/MM/dd HH:mm"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              minDate={safeValue.start}
              maxDate={new Date()}
            />
          </div>
        </div>
      )}

      {/* Current Selection Display */}
      <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
        <span className="font-medium">{t('dateRange.label')}:</span>
        <span>{safeValue.start.toLocaleString()}</span>
        <span>→</span>
        <span>{safeValue.end.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default DateRangeSelector;