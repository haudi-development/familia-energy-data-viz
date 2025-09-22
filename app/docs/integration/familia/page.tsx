'use client';

import { useState } from 'react';
import { Globe, CheckCircle, AlertTriangle, Copy, Check } from 'lucide-react';

export default function FamiliaIntegrationDoc() {
  const [language, setLanguage] = useState<'ja' | 'vi'>('ja');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const content = {
    ja: {
      title: 'Familia統合ガイド',
      subtitle: 'FamiliaシステムへのEnergy Dashboardの統合',
      description: 'このガイドでは、Familia Energy DashboardをFamiliaメインシステムに統合する詳細な手順を説明します。',
      sections: [
        {
          title: '前提条件',
          items: [
            { icon: CheckCircle, text: 'Node.js 18.17以上', type: 'success' },
            { icon: CheckCircle, text: 'Next.js 15.5.3互換環境', type: 'success' },
            { icon: CheckCircle, text: 'TypeScript 5.0以上', type: 'success' },
            { icon: AlertTriangle, text: 'FamiliaバックエンドAPIアクセス権限', type: 'warning' },
          ]
        },
        {
          title: 'ステップ1: パッケージインストール',
          description: '必要な依存関係をインストールします：',
          code: `# 必要なパッケージをインストール
npm install recharts date-fns react-datepicker
npm install @types/react-datepicker --save-dev
npm install lucide-react
npm install html2canvas`,
          language: 'bash'
        },
        {
          title: 'ステップ2: 型定義の統合',
          description: 'Familiaシステムに型定義を追加：',
          code: `// types/energy.ts
export interface EnergyDevice extends Device {
  energyMetrics?: {
    currentPower: number;
    dailyConsumption: number;
    monthlyConsumption: number;
    co2Emissions: number;
  };
}

export interface FamiliaEnergyData {
  deviceId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  metrics: SensorData[];
}`,
          language: 'typescript'
        },
        {
          title: 'ステップ3: APIエンドポイント設定',
          description: 'FamiliaバックエンドとのAPI接続：',
          code: `// api/energy.ts
const FAMILIA_API_BASE = process.env.NEXT_PUBLIC_FAMILIA_API_URL;

export async function fetchEnergyData(
  buildingId: string,
  dateRange: DateRange
): Promise<FamiliaEnergyData[]> {
  const response = await fetch(
    \`\${FAMILIA_API_BASE}/energy/data\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${getAuthToken()}\`
    },
    body: JSON.stringify({
      buildingId,
      startDate: dateRange.start.toISOString(),
      endDate: dateRange.end.toISOString()
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch energy data');
  }

  return response.json();
}`,
          language: 'typescript'
        },
        {
          title: 'ステップ4: ルーティング設定',
          description: 'Familiaのルーティングにエネルギーダッシュボードを追加：',
          code: `// app/familia/energy/page.tsx
import EnergyDashboard from '@/app/dashboard/page';

export default function FamiliaEnergyPage() {
  return (
    <FamiliaLayout>
      <EnergyDashboard />
    </FamiliaLayout>
  );
}`,
          language: 'typescript'
        },
        {
          title: 'ステップ5: 権限設定',
          description: 'ユーザー権限に基づくアクセス制御：',
          code: `// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('familia-auth');

  if (request.nextUrl.pathname.startsWith('/familia/energy')) {
    if (!token || !hasEnergyPermission(token)) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }
  }

  return NextResponse.next();
}`,
          language: 'typescript'
        },
        {
          title: 'ステップ6: リアルタイム更新',
          description: 'WebSocketまたはSSEでのリアルタイムデータ更新：',
          code: `// hooks/useRealtimeEnergy.ts
export function useRealtimeEnergy(deviceIds: string[]) {
  useEffect(() => {
    const eventSource = new EventSource(
      \`\${FAMILIA_API_BASE}/energy/stream?devices=\${deviceIds.join(',')}\`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateEnergyData(data);
    };

    return () => eventSource.close();
  }, [deviceIds]);
}`,
          language: 'typescript'
        }
      ],
      troubleshooting: {
        title: 'トラブルシューティング',
        issues: [
          {
            problem: 'CORS エラー',
            solution: 'FamiliaバックエンドでCORS設定を確認し、フロントエンドのドメインを許可リストに追加'
          },
          {
            problem: 'データが表示されない',
            solution: 'APIレスポンスの形式を確認し、型定義と一致することを確認'
          },
          {
            problem: 'パフォーマンスの問題',
            solution: 'データポイント数を制限し、必要に応じてデータを集約'
          }
        ]
      }
    },
    vi: {
      title: 'Hướng dẫn Tích hợp Familia',
      subtitle: 'Tích hợp Energy Dashboard vào hệ thống Familia',
      description: 'Hướng dẫn này mô tả các bước chi tiết để tích hợp Familia Energy Dashboard vào hệ thống Familia chính.',
      sections: [
        {
          title: 'Điều kiện tiên quyết',
          items: [
            { icon: CheckCircle, text: 'Node.js 18.17 trở lên', type: 'success' },
            { icon: CheckCircle, text: 'Môi trường tương thích Next.js 15.5.3', type: 'success' },
            { icon: CheckCircle, text: 'TypeScript 5.0 trở lên', type: 'success' },
            { icon: AlertTriangle, text: 'Quyền truy cập Familia Backend API', type: 'warning' },
          ]
        },
        {
          title: 'Bước 1: Cài đặt Package',
          description: 'Cài đặt các dependencies cần thiết:',
          code: `# Cài đặt các package cần thiết
npm install recharts date-fns react-datepicker
npm install @types/react-datepicker --save-dev
npm install lucide-react
npm install html2canvas`,
          language: 'bash'
        },
        {
          title: 'Bước 2: Tích hợp Type Definition',
          description: 'Thêm type definition vào hệ thống Familia:',
          code: `// types/energy.ts
export interface EnergyDevice extends Device {
  energyMetrics?: {
    currentPower: number;
    dailyConsumption: number;
    monthlyConsumption: number;
    co2Emissions: number;
  };
}

export interface FamiliaEnergyData {
  deviceId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  metrics: SensorData[];
}`,
          language: 'typescript'
        },
        {
          title: 'Bước 3: Cấu hình API Endpoint',
          description: 'Kết nối API với Familia backend:',
          code: `// api/energy.ts
const FAMILIA_API_BASE = process.env.NEXT_PUBLIC_FAMILIA_API_URL;

export async function fetchEnergyData(
  buildingId: string,
  dateRange: DateRange
): Promise<FamiliaEnergyData[]> {
  const response = await fetch(
    \`\${FAMILIA_API_BASE}/energy/data\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${getAuthToken()}\`
    },
    body: JSON.stringify({
      buildingId,
      startDate: dateRange.start.toISOString(),
      endDate: dateRange.end.toISOString()
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch energy data');
  }

  return response.json();
}`,
          language: 'typescript'
        },
        {
          title: 'Bước 4: Cấu hình Routing',
          description: 'Thêm energy dashboard vào routing của Familia:',
          code: `// app/familia/energy/page.tsx
import EnergyDashboard from '@/app/dashboard/page';

export default function FamiliaEnergyPage() {
  return (
    <FamiliaLayout>
      <EnergyDashboard />
    </FamiliaLayout>
  );
}`,
          language: 'typescript'
        },
        {
          title: 'Bước 5: Cấu hình Quyền',
          description: 'Kiểm soát truy cập dựa trên quyền người dùng:',
          code: `// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('familia-auth');

  if (request.nextUrl.pathname.startsWith('/familia/energy')) {
    if (!token || !hasEnergyPermission(token)) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      );
    }
  }

  return NextResponse.next();
}`,
          language: 'typescript'
        },
        {
          title: 'Bước 6: Cập nhật Realtime',
          description: 'Cập nhật dữ liệu realtime với WebSocket hoặc SSE:',
          code: `// hooks/useRealtimeEnergy.ts
export function useRealtimeEnergy(deviceIds: string[]) {
  useEffect(() => {
    const eventSource = new EventSource(
      \`\${FAMILIA_API_BASE}/energy/stream?devices=\${deviceIds.join(',')}\`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateEnergyData(data);
    };

    return () => eventSource.close();
  }, [deviceIds]);
}`,
          language: 'typescript'
        }
      ],
      troubleshooting: {
        title: 'Xử lý sự cố',
        issues: [
          {
            problem: 'Lỗi CORS',
            solution: 'Kiểm tra cấu hình CORS trên Familia backend và thêm domain frontend vào danh sách cho phép'
          },
          {
            problem: 'Dữ liệu không hiển thị',
            solution: 'Kiểm tra format response API và đảm bảo khớp với type definition'
          },
          {
            problem: 'Vấn đề hiệu suất',
            solution: 'Giới hạn số lượng data point và tổng hợp dữ liệu khi cần thiết'
          }
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

      {/* Integration Steps */}
      <div className="space-y-8">
        {t.sections.map((section, idx) => (
          <section key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {section.title}
            </h2>

            {section.items && (
              <div className="space-y-2 mb-4">
                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <div key={iIdx} className="flex items-center space-x-2">
                      <Icon className={`w-5 h-5 ${
                        item.type === 'success' ? 'text-green-500' : 'text-yellow-500'
                      }`} />
                      <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {section.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {section.description}
              </p>
            )}

            {section.code && (
              <div className="relative">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code className={`language-${section.language} text-gray-800 dark:text-gray-200`}>
                      {section.code}
                    </code>
                  </pre>
                </div>
                <button
                  onClick={() => copyToClipboard(section.code, `code-${idx}`)}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  {copiedCode === `code-${idx}` ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-300" />
                  )}
                </button>
              </div>
            )}
          </section>
        ))}

        {/* Troubleshooting */}
        <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t.troubleshooting.title}
          </h2>
          <div className="space-y-4">
            {t.troubleshooting.issues.map((issue, idx) => (
              <div key={idx} className="border-l-4 border-yellow-400 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {issue.problem}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {issue.solution}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}