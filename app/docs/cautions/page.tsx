'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, XCircle, Info, Shield, Database, Cpu, Lock, CheckCircle } from 'lucide-react';

export default function CautionsDoc() {
  const { language } = useLanguage();

  const content = {
    ja: {
      title: '重要な注意事項',
      subtitle: 'システム統合時の必須確認事項',
      description: 'Familia Energy Dashboardを安全かつ効率的に運用するための重要な注意事項と制限事項です。',
      sections: [
        {
          title: 'セキュリティ',
          icon: Shield,
          level: 'critical',
          items: [
            {
              title: 'API認証',
              description: '全てのAPIエンドポイントには適切な認証を実装してください。JWTトークンの有効期限は24時間以内に設定することを推奨します。',
              impact: '不正アクセスによるデータ漏洩のリスク'
            },
            {
              title: '環境変数',
              description: 'APIキーやデータベース接続情報は必ず環境変数で管理し、.env.localファイルはGitにコミットしないでください。',
              impact: '機密情報の漏洩'
            },
            {
              title: 'CORS設定',
              description: '本番環境では特定のドメインのみを許可し、ワイルドカード(*)は使用しないでください。',
              impact: 'クロスサイトリクエストフォージェリ攻撃の可能性'
            }
          ]
        },
        {
          title: 'パフォーマンス',
          icon: Cpu,
          level: 'warning',
          items: [
            {
              title: 'データポイント制限',
              description: '1つのグラフに表示するデータポイントは最大5000点までに制限してください。それ以上はデータを集約してください。',
              impact: 'ブラウザのフリーズやクラッシュ'
            },
            {
              title: 'リアルタイム更新頻度',
              description: 'WebSocketやSSEでのリアルタイム更新は最短でも1秒間隔に制限してください。',
              impact: '過度なネットワーク負荷とバッテリー消費'
            },
            {
              title: 'メモリ使用量',
              description: '長時間稼働する場合、定期的にメモリリークをチェックし、不要なデータは削除してください。',
              impact: 'メモリ不足によるシステムの不安定化'
            }
          ]
        },
        {
          title: 'データ管理',
          icon: Database,
          level: 'warning',
          items: [
            {
              title: 'データ保持期間',
              description: '詳細データは最大3ヶ月、集約データは1年を推奨。それ以上は外部ストレージに アーカイブしてください。',
              impact: 'データベースの肥大化による性能劣化'
            },
            {
              title: 'バックアップ',
              description: 'プリセットとユーザー設定は日次でバックアップを取得してください。',
              impact: 'データ損失のリスク'
            },
            {
              title: 'データ検証',
              description: 'センサーデータの異常値は必ずフィルタリングし、-100°C〜100°Cなど現実的な範囲内に制限してください。',
              impact: '誤ったデータによる誤判断'
            }
          ]
        },
        {
          title: 'ブラウザ互換性',
          icon: Info,
          level: 'info',
          items: [
            {
              title: 'サポートブラウザ',
              description: 'Chrome 90+、Firefox 88+、Safari 14+、Edge 90+をサポート。Internet Explorerは非対応です。',
              impact: '古いブラウザでは正常に動作しない可能性'
            },
            {
              title: 'モバイル対応',
              description: 'タッチ操作は基本機能のみ対応。複雑なグラフ操作はデスクトップ推奨です。',
              impact: 'モバイルでの操作性の制限'
            }
          ]
        },
        {
          title: 'エラー処理',
          icon: XCircle,
          level: 'critical',
          items: [
            {
              title: 'API タイムアウト',
              description: 'APIリクエストには30秒のタイムアウトを設定し、リトライ機能を実装してください。',
              impact: 'ユーザー体験の低下'
            },
            {
              title: 'エラーログ',
              description: '全てのエラーをログに記録し、Sentryなどのエラートラッキングツールの使用を推奨します。',
              impact: '問題の早期発見と解決の遅延'
            }
          ]
        }
      ],
      bestPractices: {
        title: 'ベストプラクティス',
        items: [
          '定期的なパッケージアップデート（セキュリティパッチ）',
          'コードレビューとセキュリティ監査の実施',
          'ロードテストの実施（同時接続数100以上）',
          'ユーザーフィードバックの収集と改善',
          'ドキュメントの定期的な更新'
        ]
      }
    },
    vi: {
      title: 'Lưu ý Quan trọng',
      subtitle: 'Các mục cần xác nhận khi tích hợp hệ thống',
      description: 'Các lưu ý quan trọng và hạn chế để vận hành Familia Energy Dashboard một cách an toàn và hiệu quả.',
      sections: [
        {
          title: 'Bảo mật',
          icon: Shield,
          level: 'critical',
          items: [
            {
              title: 'Xác thực API',
              description: 'Triển khai xác thực phù hợp cho tất cả API endpoint. Khuyến nghị đặt thời hạn JWT token trong vòng 24 giờ.',
              impact: 'Nguy cơ rò rỉ dữ liệu do truy cập trái phép'
            },
            {
              title: 'Biến môi trường',
              description: 'Quản lý API key và thông tin kết nối database bằng biến môi trường, không commit file .env.local lên Git.',
              impact: 'Rò rỉ thông tin bí mật'
            },
            {
              title: 'Cài đặt CORS',
              description: 'Trong môi trường production, chỉ cho phép domain cụ thể, không sử dụng wildcard (*).',
              impact: 'Khả năng bị tấn công CSRF'
            }
          ]
        },
        {
          title: 'Hiệu suất',
          icon: Cpu,
          level: 'warning',
          items: [
            {
              title: 'Giới hạn data point',
              description: 'Giới hạn tối đa 5000 điểm dữ liệu cho một biểu đồ. Tổng hợp dữ liệu nếu vượt quá.',
              impact: 'Trình duyệt bị đơ hoặc crash'
            },
            {
              title: 'Tần suất cập nhật realtime',
              description: 'Giới hạn cập nhật realtime qua WebSocket/SSE tối thiểu 1 giây một lần.',
              impact: 'Tải mạng và tiêu thụ pin quá mức'
            },
            {
              title: 'Sử dụng bộ nhớ',
              description: 'Kiểm tra memory leak định kỳ khi chạy lâu dài, xóa dữ liệu không cần thiết.',
              impact: 'Hệ thống không ổn định do thiếu bộ nhớ'
            }
          ]
        },
        {
          title: 'Quản lý Dữ liệu',
          icon: Database,
          level: 'warning',
          items: [
            {
              title: 'Thời gian lưu trữ',
              description: 'Khuyến nghị lưu dữ liệu chi tiết tối đa 3 tháng, dữ liệu tổng hợp 1 năm. Lưu trữ lâu hơn vào kho lưu trữ bên ngoài.',
              impact: 'Hiệu suất giảm do database phình to'
            },
            {
              title: 'Sao lưu',
              description: 'Sao lưu preset và cài đặt người dùng hàng ngày.',
              impact: 'Nguy cơ mất dữ liệu'
            },
            {
              title: 'Kiểm tra dữ liệu',
              description: 'Lọc giá trị bất thường từ cảm biến, giới hạn trong phạm vi thực tế như -100°C〜100°C.',
              impact: 'Đánh giá sai do dữ liệu lỗi'
            }
          ]
        },
        {
          title: 'Tương thích Trình duyệt',
          icon: Info,
          level: 'info',
          items: [
            {
              title: 'Trình duyệt hỗ trợ',
              description: 'Hỗ trợ Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. Không hỗ trợ Internet Explorer.',
              impact: 'Có thể không hoạt động đúng trên trình duyệt cũ'
            },
            {
              title: 'Hỗ trợ Mobile',
              description: 'Chỉ hỗ trợ thao tác cảm ứng cơ bản. Khuyến nghị dùng desktop cho thao tác biểu đồ phức tạp.',
              impact: 'Hạn chế thao tác trên mobile'
            }
          ]
        },
        {
          title: 'Xử lý Lỗi',
          icon: XCircle,
          level: 'critical',
          items: [
            {
              title: 'API Timeout',
              description: 'Đặt timeout 30 giây cho API request và triển khai chức năng retry.',
              impact: 'Trải nghiệm người dùng kém'
            },
            {
              title: 'Log lỗi',
              description: 'Ghi lại tất cả lỗi, khuyến nghị sử dụng công cụ tracking lỗi như Sentry.',
              impact: 'Chậm phát hiện và giải quyết vấn đề'
            }
          ]
        }
      ],
      bestPractices: {
        title: 'Best Practices',
        items: [
          'Cập nhật package định kỳ (security patch)',
          'Thực hiện code review và kiểm tra bảo mật',
          'Test tải (100+ kết nối đồng thời)',
          'Thu thập và cải thiện theo phản hồi người dùng',
          'Cập nhật tài liệu định kỳ'
        ]
      }
    }
  };

  const t = content[language];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="max-w-5xl">

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

      {/* Caution Sections */}
      <div className="space-y-8">
        {t.sections.map((section, sIdx) => {
          const Icon = section.icon;
          return (
            <section key={sIdx} className={`rounded-lg border-2 ${getLevelColor(section.level)} p-6`}>
              <div className="flex items-center space-x-3 mb-4">
                <Icon className={`w-6 h-6 ${
                  section.level === 'critical' ? 'text-red-600' :
                  section.level === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {section.title}
                </h2>
                {section.level === 'critical' && (
                  <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                    CRITICAL
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                        影響: {item.impact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Best Practices */}
        <section className="bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t.bestPractices.title}
          </h2>
          <ul className="space-y-2">
            {t.bestPractices.items.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}