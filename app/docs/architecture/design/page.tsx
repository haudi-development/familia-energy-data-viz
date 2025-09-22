'use client';

import { useState } from 'react';
import { Globe, Layers, Server, Database, Cloud, Shield, Cpu, Network } from 'lucide-react';

export default function ArchitectureDesignDoc() {
  const [language, setLanguage] = useState<'ja' | 'vi'>('ja');

  const content = {
    ja: {
      title: 'システムアーキテクチャ設計',
      subtitle: 'Familia Energy Dashboardの技術設計と構成',
      description: 'スケーラブルでメンテナブルなシステム設計の詳細仕様です。マイクロサービス、イベント駆動型アーキテクチャ、リアルタイムデータ処理を組み合わせています。',
      layers: {
        title: 'レイヤーアーキテクチャ',
        items: [
          {
            icon: Layers,
            name: 'プレゼンテーション層',
            tech: 'Next.js 15 + React 19',
            description: 'ユーザーインターフェース、レスポンシブデザイン、リアルタイムデータ表示',
            details: [
              'Server Components による高速レンダリング',
              'Turbopack による開発環境の高速化',
              'Tailwind CSS によるスタイリング',
              'Recharts による データ可視化'
            ]
          },
          {
            icon: Server,
            name: 'アプリケーション層',
            tech: 'Next.js API Routes + Edge Functions',
            description: 'ビジネスロジック、データ処理、API管理',
            details: [
              'RESTful API エンドポイント',
              'WebSocket によるリアルタイム通信',
              'JWT による認証処理',
              'データ集約とフィルタリング'
            ]
          },
          {
            icon: Database,
            name: 'データ層',
            tech: 'PostgreSQL + Redis + TimescaleDB',
            description: 'データ永続化、キャッシング、時系列データ管理',
            details: [
              'PostgreSQL: メタデータとユーザー情報',
              'TimescaleDB: 時系列センサーデータ',
              'Redis: セッション管理とキャッシュ',
              'データレプリケーション'
            ]
          },
          {
            icon: Cloud,
            name: 'インフラ層',
            tech: 'Vercel + AWS + Docker',
            description: 'ホスティング、スケーリング、CI/CD',
            details: [
              'Vercel Edge Network によるCDN',
              'AWS Lambda によるサーバーレス処理',
              'Docker コンテナ化',
              'GitHub Actions による自動デプロイ'
            ]
          }
        ]
      },
      dataFlow: {
        title: 'データフローアーキテクチャ',
        steps: [
          {
            number: 1,
            title: 'データ収集',
            description: 'IoTセンサーからのデータ受信',
            tech: 'MQTT, CoAP, HTTP'
          },
          {
            number: 2,
            title: 'データ処理',
            description: 'データの検証、変換、集約',
            tech: 'Node.js Stream, Apache Kafka'
          },
          {
            number: 3,
            title: 'データ保存',
            description: '時系列データベースへの永続化',
            tech: 'TimescaleDB, InfluxDB'
          },
          {
            number: 4,
            title: 'データ配信',
            description: 'クライアントへのリアルタイム配信',
            tech: 'WebSocket, Server-Sent Events'
          }
        ]
      },
      security: {
        title: 'セキュリティアーキテクチャ',
        items: [
          {
            icon: Shield,
            title: '認証・認可',
            description: 'JWT + OAuth 2.0 + RBAC',
            details: 'マルチファクタ認証、ロールベースアクセス制御、APIキー管理'
          },
          {
            icon: Network,
            title: 'ネットワークセキュリティ',
            description: 'TLS 1.3 + WAF + DDoS保護',
            details: 'エンドツーエンド暗号化、Webアプリケーションファイアウォール'
          },
          {
            icon: Database,
            title: 'データセキュリティ',
            description: 'AES-256暗号化 + バックアップ',
            details: '保存時暗号化、定期バックアップ、監査ログ'
          }
        ]
      },
      scalability: {
        title: 'スケーラビリティ',
        strategies: [
          '水平スケーリング: Kubernetes によるコンテナオーケストレーション',
          '垂直スケーリング: オートスケーリンググループ',
          'キャッシング戦略: Redis による多層キャッシュ',
          'CDN活用: 静的アセットのエッジ配信',
          'データベースシャーディング: 地域別データ分散'
        ]
      }
    },
    vi: {
      title: 'Thiết kế Kiến trúc Hệ thống',
      subtitle: 'Thiết kế kỹ thuật và cấu hình của Familia Energy Dashboard',
      description: 'Thông số kỹ thuật chi tiết về thiết kế hệ thống có thể mở rộng và bảo trì. Kết hợp microservices, kiến trúc hướng sự kiện và xử lý dữ liệu thời gian thực.',
      layers: {
        title: 'Kiến trúc phân lớp',
        items: [
          {
            icon: Layers,
            name: 'Lớp Presentation',
            tech: 'Next.js 15 + React 19',
            description: 'Giao diện người dùng, thiết kế responsive, hiển thị dữ liệu thời gian thực',
            details: [
              'Render nhanh với Server Components',
              'Tăng tốc môi trường phát triển với Turbopack',
              'Styling với Tailwind CSS',
              'Trực quan hóa dữ liệu với Recharts'
            ]
          },
          {
            icon: Server,
            name: 'Lớp Application',
            tech: 'Next.js API Routes + Edge Functions',
            description: 'Business logic, xử lý dữ liệu, quản lý API',
            details: [
              'RESTful API endpoints',
              'Giao tiếp realtime qua WebSocket',
              'Xác thực với JWT',
              'Tổng hợp và lọc dữ liệu'
            ]
          },
          {
            icon: Database,
            name: 'Lớp Data',
            tech: 'PostgreSQL + Redis + TimescaleDB',
            description: 'Lưu trữ dữ liệu, caching, quản lý dữ liệu chuỗi thời gian',
            details: [
              'PostgreSQL: Metadata và thông tin người dùng',
              'TimescaleDB: Dữ liệu cảm biến theo thời gian',
              'Redis: Quản lý session và cache',
              'Data replication'
            ]
          },
          {
            icon: Cloud,
            name: 'Lớp Infrastructure',
            tech: 'Vercel + AWS + Docker',
            description: 'Hosting, scaling, CI/CD',
            details: [
              'CDN với Vercel Edge Network',
              'Xử lý serverless với AWS Lambda',
              'Container hóa với Docker',
              'Auto deploy với GitHub Actions'
            ]
          }
        ]
      },
      dataFlow: {
        title: 'Kiến trúc Luồng dữ liệu',
        steps: [
          {
            number: 1,
            title: 'Thu thập dữ liệu',
            description: 'Nhận dữ liệu từ cảm biến IoT',
            tech: 'MQTT, CoAP, HTTP'
          },
          {
            number: 2,
            title: 'Xử lý dữ liệu',
            description: 'Kiểm tra, chuyển đổi, tổng hợp dữ liệu',
            tech: 'Node.js Stream, Apache Kafka'
          },
          {
            number: 3,
            title: 'Lưu trữ dữ liệu',
            description: 'Lưu vào database chuỗi thời gian',
            tech: 'TimescaleDB, InfluxDB'
          },
          {
            number: 4,
            title: 'Phân phối dữ liệu',
            description: 'Gửi realtime đến client',
            tech: 'WebSocket, Server-Sent Events'
          }
        ]
      },
      security: {
        title: 'Kiến trúc Bảo mật',
        items: [
          {
            icon: Shield,
            title: 'Xác thực & Phân quyền',
            description: 'JWT + OAuth 2.0 + RBAC',
            details: 'Xác thực đa yếu tố, kiểm soát truy cập theo vai trò, quản lý API key'
          },
          {
            icon: Network,
            title: 'Bảo mật Mạng',
            description: 'TLS 1.3 + WAF + Chống DDoS',
            details: 'Mã hóa end-to-end, Web application firewall'
          },
          {
            icon: Database,
            title: 'Bảo mật Dữ liệu',
            description: 'Mã hóa AES-256 + Backup',
            details: 'Mã hóa lưu trữ, backup định kỳ, audit log'
          }
        ]
      },
      scalability: {
        title: 'Khả năng mở rộng',
        strategies: [
          'Mở rộng ngang: Container orchestration với Kubernetes',
          'Mở rộng dọc: Auto-scaling groups',
          'Chiến lược cache: Multi-layer cache với Redis',
          'Tận dụng CDN: Edge delivery cho static assets',
          'Database sharding: Phân tán dữ liệu theo khu vực'
        ]
      }
    }
  };

  const t = content[language];

  return (
    <div className="max-w-5xl">
      {/* Language Selector */}
      <div className="mb-6 flex items-center space-x-2">
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t.subtitle}
        </p>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          {t.description}
        </p>
      </div>

      {/* Layer Architecture */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {t.layers.title}
        </h2>
        <div className="space-y-6">
          {t.layers.items.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {layer.name}
                    </h3>
                    <p className="text-sm font-mono text-primary-600 dark:text-primary-400 mt-1">
                      {layer.tech}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {layer.description}
                    </p>
                    <ul className="mt-3 space-y-1">
                      {layer.details.map((detail, dIdx) => (
                        <li key={dIdx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-primary-500 mr-2">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Flow */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {t.dataFlow.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.dataFlow.steps.map((step, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {step.number}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {step.description}
              </p>
              <p className="text-xs font-mono text-primary-600 dark:text-primary-400">
                {step.tech}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {t.security.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.security.items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm font-mono text-primary-600 dark:text-primary-400 mb-2">
                  {item.description}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {item.details}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scalability */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {t.scalability.title}
        </h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
          <ul className="space-y-3">
            {t.scalability.strategies.map((strategy, idx) => (
              <li key={idx} className="flex items-start">
                <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{strategy}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}