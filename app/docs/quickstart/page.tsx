'use client';

import { useState } from 'react';
import { Globe, Terminal, Copy, Check, Play, Download } from 'lucide-react';

export default function QuickStartDoc() {
  const [language, setLanguage] = useState<'ja' | 'vi'>('ja');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const content = {
    ja: {
      title: 'クイックスタート',
      subtitle: '5分で始めるFamilia Energy Dashboard',
      description: '最小限の設定でFamilia Energy Dashboardを起動し、サンプルデータで動作を確認できます。',
      steps: [
        {
          number: 1,
          title: 'リポジトリのクローン',
          description: 'GitHubからプロジェクトをクローンします',
          code: `git clone https://github.com/haudi-development/familia-energy-data-viz.git
cd familia-energy-data-viz`,
          language: 'bash'
        },
        {
          number: 2,
          title: '依存関係のインストール',
          description: 'npm または yarn を使用してパッケージをインストール',
          code: `npm install
# または
yarn install`,
          language: 'bash'
        },
        {
          number: 3,
          title: '環境変数の設定',
          description: '.env.local ファイルを作成し、必要な設定を追加',
          code: `# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001`,
          language: 'bash'
        },
        {
          number: 4,
          title: '開発サーバーの起動',
          description: 'ローカル環境でアプリケーションを起動',
          code: `npm run dev
# または
yarn dev`,
          language: 'bash'
        },
        {
          number: 5,
          title: 'ブラウザでアクセス',
          description: 'ブラウザを開いて以下のURLにアクセス',
          code: `http://localhost:3000`,
          language: 'text'
        }
      ],
      sampleData: {
        title: 'サンプルデータの使用',
        description: 'モックデータジェネレータを使用してテストデータを生成できます',
        code: `// utils/mockDataGenerator.ts
import { generateMockData } from \'@/utils/mockData\';

// 24時間分のサンプルデータを生成
const mockData = generateMockData({
  deviceCount: 5,
  hoursBack: 24,
  interval: 15 // 15分間隔
});

// ダッシュボードに適用
setData(mockData);`
      },
      verification: {
        title: '動作確認',
        items: [
          'ダッシュボードページ（/dashboard）が表示される',
          'グラフが正しくレンダリングされる',
          'メトリクスセレクタが機能する',
          '日付範囲の選択が機能する',
          'プリセットの保存/読み込みが機能する'
        ]
      },
      nextSteps: {
        title: '次のステップ',
        items: [
          { title: 'APIリファレンス', href: '/docs/api/types', description: 'データ型とAPI仕様を確認' },
          { title: 'Familia統合', href: '/docs/integration/familia', description: '本番環境への統合方法' },
          { title: 'コンポーネント', href: '/docs/components/datachart', description: 'カスタマイズ方法を学ぶ' }
        ]
      }
    },
    vi: {
      title: 'Bắt đầu nhanh',
      subtitle: 'Khởi động Familia Energy Dashboard trong 5 phút',
      description: 'Có thể khởi động Familia Energy Dashboard với cấu hình tối thiểu và kiểm tra hoạt động với dữ liệu mẫu.',
      steps: [
        {
          number: 1,
          title: 'Clone repository',
          description: 'Clone project từ GitHub',
          code: `git clone https://github.com/haudi-development/familia-energy-data-viz.git
cd familia-energy-data-viz`,
          language: 'bash'
        },
        {
          number: 2,
          title: 'Cài đặt dependencies',
          description: 'Cài đặt packages sử dụng npm hoặc yarn',
          code: `npm install
# hoặc
yarn install`,
          language: 'bash'
        },
        {
          number: 3,
          title: 'Cấu hình biến môi trường',
          description: 'Tạo file .env.local và thêm cấu hình cần thiết',
          code: `# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001`,
          language: 'bash'
        },
        {
          number: 4,
          title: 'Khởi động development server',
          description: 'Chạy ứng dụng trong môi trường local',
          code: `npm run dev
# hoặc
yarn dev`,
          language: 'bash'
        },
        {
          number: 5,
          title: 'Truy cập bằng trình duyệt',
          description: 'Mở trình duyệt và truy cập URL sau',
          code: `http://localhost:3000`,
          language: 'text'
        }
      ],
      sampleData: {
        title: 'Sử dụng dữ liệu mẫu',
        description: 'Có thể tạo dữ liệu test sử dụng mock data generator',
        code: `// utils/mockDataGenerator.ts
import { generateMockData } from \'@/utils/mockData\';

// Tạo dữ liệu mẫu 24 giờ
const mockData = generateMockData({
  deviceCount: 5,
  hoursBack: 24,
  interval: 15 // Mỗi 15 phút
});

// Áp dụng vào dashboard
setData(mockData);`
      },
      verification: {
        title: 'Kiểm tra hoạt động',
        items: [
          'Trang dashboard (/dashboard) hiển thị được',
          'Biểu đồ render đúng',
          'Metric selector hoạt động',
          'Chọn phạm vi ngày hoạt động',
          'Lưu/tải preset hoạt động'
        ]
      },
      nextSteps: {
        title: 'Bước tiếp theo',
        items: [
          { title: 'Tham khảo API', href: '/docs/api/types', description: 'Xem kiểu dữ liệu và spec API' },
          { title: 'Tích hợp Familia', href: '/docs/integration/familia', description: 'Cách tích hợp vào môi trường production' },
          { title: 'Components', href: '/docs/components/datachart', description: 'Học cách customize' }
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

      {/* Steps */}
      <div className="space-y-6">
        {t.steps.map((step, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {step.number}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {step.description}
                </p>
                <div className="relative">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code className={`language-${step.language} text-gray-800 dark:text-gray-200`}>
                        {step.code}
                      </code>
                    </pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(step.code, `step-${idx}`)}
                    className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                  >
                    {copiedCode === `step-${idx}` ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sample Data */}
      <section className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t.sampleData.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t.sampleData.description}
        </p>
        <div className="relative">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm">
              <code className="language-typescript text-gray-800 dark:text-gray-200">
                {t.sampleData.code}
              </code>
            </pre>
          </div>
          <button
            onClick={() => copyToClipboard(t.sampleData.code, 'sample-data')}
            className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            {copiedCode === 'sample-data' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-300" />
            )}
          </button>
        </div>
      </section>

      {/* Verification */}
      <section className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t.verification.title}
        </h2>
        <ul className="space-y-2">
          {t.verification.items.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Next Steps */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t.nextSteps.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.nextSteps.items.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4
                hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}