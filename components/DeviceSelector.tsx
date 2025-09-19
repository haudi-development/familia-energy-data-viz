import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, CheckSquare, Square, ChevronDown, ChevronRight, Activity, Zap, Wind, Lightbulb, Shield, Users, MapPin, Layers } from 'lucide-react';
import { Device, DeviceType } from '../types';

interface DeviceSelectorProps {
  devices: Device[];
  selectedDevices: string[];
  onSelectionChange: (deviceIds: string[]) => void;
  compact?: boolean;
}

type GroupByMode = 'type' | 'area';

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ 
  devices, 
  selectedDevices, 
  onSelectionChange,
  compact = false
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['environmental', 'power']));
  const [groupByMode, setGroupByMode] = useState<GroupByMode>('type');

  const deviceIcons: Record<DeviceType, React.ReactNode> = {
    environmental: <Activity className="w-4 h-4" />,
    power: <Zap className="w-4 h-4" />,
    hvac: <Wind className="w-4 h-4" />,
    lighting: <Lightbulb className="w-4 h-4" />,
    security: <Shield className="w-4 h-4" />,
    occupancy: <Users className="w-4 h-4" />
  };

  const filteredDevices = useMemo(() => {
    return devices.filter(device => 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.zone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [devices, searchTerm]);

  const groupedDevices = useMemo(() => {
    if (groupByMode === 'type') {
      return filteredDevices.reduce((acc, device) => {
        if (!acc[device.type]) {
          acc[device.type] = [];
        }
        acc[device.type].push(device);
        return acc;
      }, {} as Record<string, Device[]>);
    } else {
      // Group by area
      return filteredDevices.reduce((acc, device) => {
        const key = `${device.location.floor}F - ${device.location.area}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(device);
        return acc;
      }, {} as Record<string, Device[]>);
    }
  }, [filteredDevices, groupByMode]);

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleDevice = (deviceId: string) => {
    if (selectedDevices.includes(deviceId)) {
      onSelectionChange(selectedDevices.filter(id => id !== deviceId));
    } else {
      onSelectionChange([...selectedDevices, deviceId]);
    }
  };

  const toggleGroupSelection = (group: string) => {
    const groupDeviceIds = groupedDevices[group]?.map(d => d.id) || [];
    const allSelected = groupDeviceIds.every(id => selectedDevices.includes(id));
    
    if (allSelected) {
      onSelectionChange(selectedDevices.filter(id => !groupDeviceIds.includes(id)));
    } else {
      const newSelection = new Set([...selectedDevices, ...groupDeviceIds]);
      onSelectionChange(Array.from(newSelection));
    }
  };

  const selectAll = () => {
    onSelectionChange(devices.map(d => d.id));
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  // Compact layout for drawer
  if (compact) {
    return (
      <div className="space-y-3">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('devices.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 
                rounded-md focus:ring-1 focus:ring-primary-500 focus:border-transparent
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Group By Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-md p-0.5">
            <button
              onClick={() => setGroupByMode('type')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                groupByMode === 'type'
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>タイプ</span>
            </button>
            <button
              onClick={() => setGroupByMode('area')}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                groupByMode === 'area'
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>エリア</span>
            </button>
          </div>

          {/* Quick Actions */}
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
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {selectedDevices.length}/{devices.length} 選択中
            </span>
          </div>
        </div>

        {/* Compact Device Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2">
          {Object.entries(groupedDevices).map(([groupKey, deviceList]) => (
            <div key={groupKey} className="space-y-1">
              {/* Group Header */}
              <div 
                className="flex items-center justify-between px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium cursor-pointer"
                onClick={() => toggleGroupSelection(groupKey)}
              >
                <div className="flex items-center space-x-1">
                  {groupByMode === 'type' ? deviceIcons[groupKey as DeviceType] : <MapPin className="w-3 h-3" />}
                  <span className="text-gray-700 dark:text-gray-300">
                    {groupByMode === 'type' ? t(`devices.groups.${groupKey}`) : groupKey}
                  </span>
                  <span className="text-gray-500">({deviceList.length})</span>
                </div>
                {deviceList.every(d => selectedDevices.includes(d.id)) ? (
                  <CheckSquare className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                ) : deviceList.some(d => selectedDevices.includes(d.id)) ? (
                  <div className="w-3 h-3 border border-primary-600 dark:border-primary-400 rounded-sm bg-primary-100 dark:bg-primary-900" />
                ) : (
                  <Square className="w-3 h-3 text-gray-400" />
                )}
              </div>
              
              {/* Device Items */}
              <div className="space-y-0.5">
                {deviceList.map(device => {
                  const isSelected = selectedDevices.includes(device.id);
                  return (
                    <div
                      key={device.id}
                      onClick={() => toggleDevice(device.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded cursor-pointer text-xs
                        ${isSelected 
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-600 dark:text-gray-400'}`}
                    >
                      {isSelected ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                      <span className="truncate flex-1">{device.name}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        device.status === 'online' ? 'bg-green-500' : 
                        device.status === 'offline' ? 'bg-gray-400' : 'bg-red-500'
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Original full layout
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('devices.title')}
        </h3>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {selectedDevices.length} {t('devices.selected')}
          </span>
        </div>
      </div>

      {/* Group By Toggle */}
      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setGroupByMode('type')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            groupByMode === 'type'
              ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>タイプ別</span>
        </button>
        <button
          onClick={() => setGroupByMode('area')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            groupByMode === 'area'
              ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>エリア別</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('devices.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
            rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Select/Deselect All Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={selectAll}
          className="px-3 py-1 text-sm font-medium rounded-lg
            bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800
            text-primary-700 dark:text-primary-300 transition-colors"
        >
          {t('devices.selectAll')}
        </button>
        <button
          onClick={deselectAll}
          className="px-3 py-1 text-sm font-medium rounded-lg
            bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
            text-gray-700 dark:text-gray-300 transition-colors"
        >
          {t('devices.deselectAll')}
        </button>
      </div>

      {/* Device Groups */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {Object.entries(groupedDevices).map(([groupKey, deviceList]) => {
          const isExpanded = expandedGroups.has(groupKey);
          const groupSelected = deviceList.every(d => selectedDevices.includes(d.id));
          const groupPartiallySelected = deviceList.some(d => selectedDevices.includes(d.id)) && !groupSelected;

          return (
            <div key={groupKey} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              {/* Group Header */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 
                hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => toggleGroup(groupKey)}
              >
                <div className="flex items-center space-x-2">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  {groupByMode === 'type' ? (
                    <>
                      {deviceIcons[groupKey as DeviceType]}
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {t(`devices.groups.${groupKey}`)}
                      </span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {groupKey}
                      </span>
                    </>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({deviceList.length})
                  </span>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroupSelection(groupKey);
                  }}
                  className="cursor-pointer"
                >
                  {groupSelected ? (
                    <CheckSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  ) : groupPartiallySelected ? (
                    <div className="w-5 h-5 border-2 border-primary-600 dark:border-primary-400 rounded bg-primary-100 dark:bg-primary-900" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Device List */}
              {isExpanded && (
                <div className="p-2 space-y-1">
                  {deviceList.map(device => {
                    const isSelected = selectedDevices.includes(device.id);
                    const statusColor = device.status === 'online' ? 'text-green-500' :
                                      device.status === 'offline' ? 'text-gray-400' : 'text-red-500';

                    return (
                      <div
                        key={device.id}
                        onClick={() => toggleDevice(device.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer
                          transition-colors ${isSelected 
                            ? 'bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {device.name}
                            </div>
                            {groupByMode === 'type' && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {device.location.floor}F - {device.location.area}
                                {device.location.zone && ` - ${device.location.zone}`}
                              </div>
                            )}
                            {groupByMode === 'area' && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {t(`devices.groups.${device.type}`)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {groupByMode === 'area' && deviceIcons[device.type]}
                          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceSelector;