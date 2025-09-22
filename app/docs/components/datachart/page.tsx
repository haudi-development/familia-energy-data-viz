'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, Settings, Download, Maximize2 } from 'lucide-react';

export default function DataChartDoc() {
  const { language } = useLanguage();

  const content = {
    ja: {
      title: 'DataChartコンポーネント',
      subtitle: '基本的なデータ可視化コンポーネント',
      description: 'DataChartは最もシンプルで使いやすいチャートコンポーネントです。リアルタイムデータの表示、ズーム機能、エクスポート機能を備えています。',
      features: {
        title: '主な機能',
        items: [
          { icon: BarChart3, title: '複数のグラフタイプ', description: 'ライン、バー、エリアチャートに対応' },
          { icon: Settings, title: 'カスタマイズ可能', description: '色、軸、凡例などを細かく設定可能' },
          { icon: Download, title: 'エクスポート機能', description: 'PNG/CSVファイルとしてダウンロード' },
          { icon: Maximize2, title: 'ズーム機能', description: '特定期間を拡大表示' }
        ]
      },
      usage: {
        title: '基本的な使い方',
        code: `import DataChart from '@/components/DataChart';

function Dashboard() {
  const [config, setConfig] = useState({
    type: 'line',
    showLegend: true,
    enableZoom: true,
    multiAxis: false,
    showGrid: true,
    displayMode: 'standard'
  });

  return (
    <DataChart
      data={sensorData}
      config={config}
      onConfigChange={setConfig}
      height={400}
    />
  );
}`
      },
      props: {
        title: 'Props詳細',
        items: [
          {
            name: 'data',
            type: 'SensorData[]',
            required: true,
            description: 'グラフに表示するセンサーデータの配列',
            example: `[{
  deviceId: "sensor-001",
  metric: "temperature",
  data: [
    { timestamp: new Date(), value: 23.5 },
    { timestamp: new Date(), value: 24.1 }
  ]
}]`
          },
          {
            name: 'config',
            type: 'ChartConfig',
            required: true,
            description: 'グラフの表示設定',
            example: `{
  type: 'line',
  showLegend: true,
  enableZoom: true,
  multiAxis: false,
  showGrid: true,
  displayMode: 'standard'
}`
          },
          {
            name: 'height',
            type: 'number',
            required: false,
            description: 'グラフの高さ（ピクセル）',
            example: '400'
          }
        ]
      },
      examples: {
        title: '使用例',
        items: [
          {
            title: '温度・湿度の比較表示',
            code: `<DataChart
  data={[
    {
      deviceId: "room-1",
      metric: "temperature",
      data: temperatureData
    },
    {
      deviceId: "room-1",
      metric: "humidity",
      data: humidityData
    }
  ]}
  config={{
    type: 'line',
    multiAxis: true,
    showLegend: true
  }}
/>`
          },
          {
            title: '電力消費量のバーチャート',
            code: `<DataChart
  data={powerData}
  config={{
    type: 'bar',
    displayMode: 'standard',
    showGrid: true
  }}
/>`
          }
        ]
      }
    },
    vi: {
      title: 'Component DataChart',
      subtitle: 'Component trực quan hóa dữ liệu cơ bản',
      description: 'DataChart là component biểu đồ đơn giản và dễ sử dụng nhất. Có chức năng hiển thị dữ liệu realtime, zoom và xuất dữ liệu.',
      features: {
        title: 'Tính năng chính',
        items: [
          { icon: BarChart3, title: 'Nhiều loại biểu đồ', description: 'Hỗ trợ line, bar, area chart' },
          { icon: Settings, title: 'Có thể tùy chỉnh', description: 'Cài đặt chi tiết màu sắc, trục, chú thích' },
          { icon: Download, title: 'Chức năng xuất', description: 'Tải về dạng PNG/CSV' },
          { icon: Maximize2, title: 'Chức năng zoom', description: 'Phóng to khoảng thời gian cụ thể' }
        ]
      },
      usage: {
        title: 'Cách sử dụng cơ bản',
        code: `import DataChart from '@/components/DataChart';

function Dashboard() {
  const [config, setConfig] = useState({
    type: 'line',
    showLegend: true,
    enableZoom: true,
    multiAxis: false,
    showGrid: true,
    displayMode: 'standard'
  });

  return (
    <DataChart
      data={sensorData}
      config={config}
      onConfigChange={setConfig}
      height={400}
    />
  );
}`
      },
      props: {
        title: 'Chi tiết Props',
        items: [
          {
            name: 'data',
            type: 'SensorData[]',
            required: true,
            description: 'Mảng dữ liệu cảm biến để hiển thị trên biểu đồ',
            example: `[{
  deviceId: "sensor-001",
  metric: "temperature",
  data: [
    { timestamp: new Date(), value: 23.5 },
    { timestamp: new Date(), value: 24.1 }
  ]
}]`
          },
          {
            name: 'config',
            type: 'ChartConfig',
            required: true,
            description: 'Cài đặt hiển thị biểu đồ',
            example: `{
  type: 'line',
  showLegend: true,
  enableZoom: true,
  multiAxis: false,
  showGrid: true,
  displayMode: 'standard'
}`
          },
          {
            name: 'height',
            type: 'number',
            required: false,
            description: 'Chiều cao biểu đồ (pixel)',
            example: '400'
          }
        ]
      },
      examples: {
        title: 'Ví dụ sử dụng',
        items: [
          {
            title: 'So sánh nhiệt độ và độ ẩm',
            code: `<DataChart
  data={[
    {
      deviceId: "room-1",
      metric: "temperature",
      data: temperatureData
    },
    {
      deviceId: "room-1",
      metric: "humidity",
      data: humidityData
    }
  ]}
  config={{
    type: 'line',
    multiAxis: true,
    showLegend: true
  }}
/>`
          },
          {
            title: 'Biểu đồ cột tiêu thụ điện',
            code: `<DataChart
  data={powerData}
  config={{
    type: 'bar',
    displayMode: 'standard',
    showGrid: true
  }}
/>`
          }
        ]
      }
    }
  };

  const t = content[language];

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

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {t.features.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.features.items.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Basic Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t.usage.title}
        </h2>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm">
            <code className="language-typescript text-gray-800 dark:text-gray-200">
              {t.usage.code}
            </code>
          </pre>
        </div>
      </section>

      {/* Props */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {t.props.title}
        </h2>
        <div className="space-y-4">
          {t.props.items.map((prop, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-mono text-lg text-primary-600 dark:text-primary-400">
                    {prop.name}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                    {prop.type}
                  </span>
                  {prop.required && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {prop.description}
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 overflow-x-auto">
                  <pre className="text-sm">
                    <code className="text-gray-700 dark:text-gray-300">
                      {prop.example}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {t.examples.title}
        </h2>
        <div className="space-y-6">
          {t.examples.items.map((example, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {example.title}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code className="language-jsx text-gray-800 dark:text-gray-200">
                    {example.code}
                  </code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}