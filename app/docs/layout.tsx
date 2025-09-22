'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import {
  Book,
  Code2,
  Package,
  Puzzle,
  AlertCircle,
  Menu,
  X,
  Globe,
  FileJson,
  Layers,
  Sparkles
} from 'lucide-react';

function DocsLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();

  const navigation = {
    ja: [
      {
        name: '概要',
        href: '/docs',
        icon: Book,
      },
      {
        name: 'クイックスタート',
        href: '/docs/quickstart',
        icon: Code2,
      },
      {
        name: '機能一覧',
        href: '/docs/features',
        icon: Sparkles,
      },
      {
        name: 'APIリファレンス',
        icon: FileJson,
        children: [
          { name: 'データ型定義', href: '/docs/api/types' },
          { name: 'コンポーネントAPI', href: '/docs/api/components' },
          { name: 'ユーティリティ関数', href: '/docs/api/utils' },
        ]
      },
      {
        name: 'コンポーネント',
        icon: Package,
        children: [
          { name: 'DataChart', href: '/docs/components/datachart' },
          { name: 'DataChartAdvanced', href: '/docs/components/advanced' },
          { name: 'DataChartEnhanced', href: '/docs/components/enhanced' },
          { name: 'MetricSelector', href: '/docs/components/selector' },
          { name: 'DateRangeSelector', href: '/docs/components/daterange' },
        ]
      },
      {
        name: '統合ガイド',
        icon: Puzzle,
        children: [
          { name: 'Familia統合', href: '/docs/integration/familia' },
          { name: 'データソース接続', href: '/docs/integration/datasource' },
          { name: 'リアルタイム更新', href: '/docs/integration/realtime' },
        ]
      },
      {
        name: 'アーキテクチャ',
        icon: Layers,
        children: [
          { name: 'システム設計', href: '/docs/architecture/design' },
          { name: 'データフロー', href: '/docs/architecture/dataflow' },
          { name: 'パフォーマンス最適化', href: '/docs/architecture/performance' },
        ]
      },
      {
        name: '注意事項',
        href: '/docs/cautions',
        icon: AlertCircle,
      },
    ],
    vi: [
      {
        name: 'Tổng quan',
        href: '/docs',
        icon: Book,
      },
      {
        name: 'Bắt đầu nhanh',
        href: '/docs/quickstart',
        icon: Code2,
      },
      {
        name: 'Danh sách tính năng',
        href: '/docs/features',
        icon: Sparkles,
      },
      {
        name: 'Tham khảo API',
        icon: FileJson,
        children: [
          { name: 'Định nghĩa kiểu dữ liệu', href: '/docs/api/types' },
          { name: 'API Component', href: '/docs/api/components' },
          { name: 'Hàm tiện ích', href: '/docs/api/utils' },
        ]
      },
      {
        name: 'Component',
        icon: Package,
        children: [
          { name: 'DataChart', href: '/docs/components/datachart' },
          { name: 'DataChartAdvanced', href: '/docs/components/advanced' },
          { name: 'DataChartEnhanced', href: '/docs/components/enhanced' },
          { name: 'MetricSelector', href: '/docs/components/selector' },
          { name: 'DateRangeSelector', href: '/docs/components/daterange' },
        ]
      },
      {
        name: 'Hướng dẫn tích hợp',
        icon: Puzzle,
        children: [
          { name: 'Tích hợp Familia', href: '/docs/integration/familia' },
          { name: 'Kết nối nguồn dữ liệu', href: '/docs/integration/datasource' },
          { name: 'Cập nhật thời gian thực', href: '/docs/integration/realtime' },
        ]
      },
      {
        name: 'Kiến trúc',
        icon: Layers,
        children: [
          { name: 'Thiết kế hệ thống', href: '/docs/architecture/design' },
          { name: 'Luồng dữ liệu', href: '/docs/architecture/dataflow' },
          { name: 'Tối ưu hiệu suất', href: '/docs/architecture/performance' },
        ]
      },
      {
        name: 'Lưu ý',
        href: '/docs/cautions',
        icon: AlertCircle,
      },
    ]
  };

  const currentNav = navigation[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/docs" className="flex items-center space-x-2">
              <Layers className="w-6 h-6 text-primary-600" />
              <span className="text-xl font-bold">Familia Energy Docs</span>
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'ja' | 'vi')}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg
                bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="ja">日本語</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-14 left-0 z-40 w-64 h-[calc(100vh-3.5rem)]
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-transform duration-300 overflow-y-auto`}>
          <nav className="p-4 space-y-1">
            {currentNav.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <details className="group" open>
                    <summary className="flex items-center space-x-2 px-3 py-2 rounded-lg
                      cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700
                      text-gray-700 dark:text-gray-300">
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span className="font-medium">{item.name}</span>
                    </summary>
                    <div className="ml-7 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-3 py-1.5 rounded-md text-sm
                            ${pathname === child.href
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg
                      ${pathname === item.href
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-6 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <DocsLayoutContent>{children}</DocsLayoutContent>
    </LanguageProvider>
  );
}