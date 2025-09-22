'use client';

import { useState } from 'react';
import {
  Zap,
  TrendingUp,
  Package2,
  GitBranch,
  CheckCircle,
  ArrowRight,
  Code2,
  Database,
  Globe
} from 'lucide-react';

export default function DocsHome() {
  const [language, setLanguage] = useState<'ja' | 'vi'>('ja');

  const content = {
    ja: {
      title: 'Familia Energy データ可視化システム',
      subtitle: 'リアルタイムエネルギー監視と分析のための包括的なダッシュボード',
      description: 'Familia Energyデータ可視化システムは、建物のエネルギー消費、環境データ、占有状況をリアルタイムで監視・分析するための高性能なダッシュボードシステムです。',
      features: {
        title: '主な機能',
        items: [
          {
            icon: TrendingUp,
            title: 'リアルタイムデータ可視化',
            description: '温度、湿度、CO2、電力消費などの多様なメトリクスをリアルタイムで表示'
          },
          {
            icon: Package2,
            title: 'モジュラーコンポーネント',
            description: '再利用可能なReactコンポーネントで簡単にカスタマイズ可能'
          },
          {
            icon: GitBranch,
            title: '柔軟なデータ統合',
            description: '様々なデータソースとの統合が容易なアーキテクチャ'
          },
          {
            icon: Zap,
            title: '高性能',
            description: 'Next.js 15とTurbopackによる最適化された描画性能'
          }
        ]
      },
      techStack: {
        title: '技術スタック',
        description: '最新のWeb技術を活用した堅牢なシステム',
        items: [
          { name: 'Next.js 15.5.3', description: 'Reactフレームワーク' },
          { name: 'TypeScript', description: '型安全な開発' },
          { name: 'Recharts', description: 'データ可視化ライブラリ' },
          { name: 'Tailwind CSS', description: 'ユーティリティファーストCSS' },
          { name: 'i18next', description: '国際化対応' },
        ]
      },
      metrics: {
        title: 'サポートされるメトリクス',
        items: [
          { name: '温度', unit: '°C', color: 'text-red-500' },
          { name: '湿度', unit: '%', color: 'text-blue-500' },
          { name: 'CO2濃度', unit: 'ppm', color: 'text-green-500' },
          { name: '電力', unit: 'kW', color: 'text-yellow-500' },
          { name: '占有率', unit: '人', color: 'text-purple-500' },
          { name: '照度', unit: 'lx', color: 'text-orange-500' },
        ]
      },
      quickLinks: {
        title: 'クイックリンク',
        items: [
          { title: 'クイックスタート', href: '/docs/quickstart', description: '5分で始める' },
          { title: 'APIリファレンス', href: '/docs/api/types', description: '詳細なAPI仕様' },
          { title: '統合ガイド', href: '/docs/integration/familia', description: 'Familiaとの統合方法' },
          { title: '注意事項', href: '/docs/cautions', description: '重要な注意点' },
        ]
      }
    },
    vi: {
      title: 'Hệ thống Trực quan hóa Dữ liệu Familia Energy',
      subtitle: 'Bảng điều khiển toàn diện để giám sát và phân tích năng lượng thời gian thực',
      description: 'Hệ thống Trực quan hóa Dữ liệu Familia Energy là một hệ thống bảng điều khiển hiệu suất cao để giám sát và phân tích mức tiêu thụ năng lượng, dữ liệu môi trường và tỷ lệ lấp đầy của tòa nhà trong thời gian thực.',
      features: {
        title: 'Tính năng chính',
        items: [
          {
            icon: TrendingUp,
            title: 'Trực quan hóa dữ liệu thời gian thực',
            description: 'Hiển thị các chỉ số đa dạng như nhiệt độ, độ ẩm, CO2, tiêu thụ điện năng trong thời gian thực'
          },
          {
            icon: Package2,
            title: 'Component mô-đun',
            description: 'Dễ dàng tùy chỉnh với các component React có thể tái sử dụng'
          },
          {
            icon: GitBranch,
            title: 'Tích hợp dữ liệu linh hoạt',
            description: 'Kiến trúc dễ dàng tích hợp với nhiều nguồn dữ liệu khác nhau'
          },
          {
            icon: Zap,
            title: 'Hiệu suất cao',
            description: 'Hiệu suất rendering được tối ưu hóa với Next.js 15 và Turbopack'
          }
        ]
      },
      techStack: {
        title: 'Công nghệ sử dụng',
        description: 'Hệ thống vững chắc sử dụng công nghệ web mới nhất',
        items: [
          { name: 'Next.js 15.5.3', description: 'Framework React' },
          { name: 'TypeScript', description: 'Phát triển type-safe' },
          { name: 'Recharts', description: 'Thư viện trực quan hóa dữ liệu' },
          { name: 'Tailwind CSS', description: 'Utility-first CSS' },
          { name: 'i18next', description: 'Hỗ trợ đa ngôn ngữ' },
        ]
      },
      metrics: {
        title: 'Các chỉ số được hỗ trợ',
        items: [
          { name: 'Nhiệt độ', unit: '°C', color: 'text-red-500' },
          { name: 'Độ ẩm', unit: '%', color: 'text-blue-500' },
          { name: 'Nồng độ CO2', unit: 'ppm', color: 'text-green-500' },
          { name: 'Điện năng', unit: 'kW', color: 'text-yellow-500' },
          { name: 'Tỷ lệ lấp đầy', unit: 'người', color: 'text-purple-500' },
          { name: 'Độ chiếu sáng', unit: 'lx', color: 'text-orange-500' },
        ]
      },
      quickLinks: {
        title: 'Liên kết nhanh',
        items: [
          { title: 'Bắt đầu nhanh', href: '/docs/quickstart', description: 'Bắt đầu trong 5 phút' },
          { title: 'Tham khảo API', href: '/docs/api/types', description: 'Thông số API chi tiết' },
          { title: 'Hướng dẫn tích hợp', href: '/docs/integration/familia', description: 'Cách tích hợp với Familia' },
          { title: 'Lưu ý', href: '/docs/cautions', description: 'Những điểm quan trọng cần lưu ý' },
        ]
      }
    }
  };

  const t = content[language];

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      {/* Language Selector for mobile */}
      <div className="lg:hidden mb-6 flex items-center space-x-2">
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

      {/* Hero Section */}
      <div className="not-prose mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          {t.subtitle}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          {t.description}
        </p>
      </div>

      {/* Features */}
      <section className="not-prose mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t.features.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.features.items.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="not-prose mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t.techStack.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t.techStack.description}
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {t.techStack.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Code2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Metrics */}
      <section className="not-prose mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t.metrics.title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {t.metrics.items.map((metric, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${metric.color}`}>
                  {metric.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {metric.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="not-prose">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t.quickLinks.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.quickLinks.items.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="group bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700
                hover:border-primary-300 dark:hover:border-primary-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {link.title}
                </h3>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400
                  transform group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {link.description}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}