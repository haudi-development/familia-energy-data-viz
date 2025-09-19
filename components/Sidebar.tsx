import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, BarChart3, FileText, Settings, Activity, Zap, Users, Shield, Bell, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, collapsed = false, onToggleCollapse }) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: t('nav.dashboard') },
    { id: 'analysis', icon: BarChart3, label: t('nav.analysis') },
    { id: 'reports', icon: FileText, label: t('nav.reports') },
    { id: 'settings', icon: Settings, label: t('nav.settings') },
  ];

  const quickAccess = [
    { id: 'env', icon: Activity, label: '環境センサー', count: 45 },
    { id: 'power', icon: Zap, label: '電力メーター', count: 30 },
    { id: 'occupancy', icon: Users, label: '在室センサー', count: 15 },
    { id: 'security', icon: Shield, label: 'セキュリティ', count: 20 },
  ];

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} h-screen bg-gradient-to-b from-[#50A69F] to-[#3d7f7a] text-white flex flex-col transition-all duration-300 relative`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-white/20 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${collapsed ? 'hidden' : ''}`}>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Familia</h1>
              <p className="text-xs text-white/70">Energy Management</p>
            </div>
          </div>
          {collapsed && (
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto">
              <Activity className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-600" />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                    : 'hover:bg-white/10'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Quick Access Section */}
        {!collapsed && (
        <div className="mt-8">
          <h3 className="text-xs uppercase tracking-wider text-white/50 px-4 mb-3">Quick Access</h3>
          <div className="space-y-1">
            {quickAccess.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-white/70" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </nav>

      {/* Notification Section */}
      <div className="p-4 border-t border-white/20 flex-shrink-0">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between px-4'} py-3 bg-white/10 rounded-lg`}>
          {collapsed ? (
            <Bell className="w-5 h-5" />
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5" />
                <span className="text-sm">3 アラート</span>
              </div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;