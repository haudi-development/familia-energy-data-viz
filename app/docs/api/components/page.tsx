'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function ComponentsAPIDoc() {
  const [language, setLanguage] = useState<'ja' | 'vi'>('ja');

  const content = {
    ja: {
      title: 'コンポーネントAPI',
      subtitle: 'Reactコンポーネントのプロパティとメソッド',
      description: '各コンポーネントの詳細なAPIリファレンスです。',
      components: [
        {
          name: 'DataChart',
          description: '基本的なデータチャートコンポーネント',
          props: [
            { name: 'data', type: 'SensorData[]', required: true, description: '表示するセンサーデータの配列' },
            { name: 'config', type: 'ChartConfig', required: true, description: 'チャート設定オブジェクト' },
            { name: 'onConfigChange', type: '(config: ChartConfig) => void', required: false, description: '設定変更時のコールバック' },
            { name: 'height', type: 'number', required: false, description: 'チャートの高さ（デフォルト: 400）' },
            { name: 'showExport', type: 'boolean', required: false, description: 'エクスポートボタンの表示（デフォルト: true）' }
          ],
          example: `<DataChart
  data={sensorData}
  config={{
    type: 'line',
    showLegend: true,
    enableZoom: true,
    multiAxis: false,
    showGrid: true,
    displayMode: 'standard'
  }}
  onConfigChange={handleConfigChange}
  height={500}
/>`
        },
        {
          name: 'MetricSelector',
          description: 'メトリクスを選択するためのコンポーネント',
          props: [
            { name: 'selectedMetrics', type: 'MetricType[]', required: true, description: '選択されたメトリクスの配列' },
            { name: 'onSelectionChange', type: '(metrics: MetricType[]) => void', required: true, description: '選択変更時のコールバック' },
            { name: 'compact', type: 'boolean', required: false, description: 'コンパクト表示モード（デフォルト: false）' }
          ],
          example: `<MetricSelector
  selectedMetrics={['temperature', 'humidity']}
  onSelectionChange={setSelectedMetrics}
  compact={false}
/>`
        },
        {
          name: 'DateRangeSelector',
          description: '日付範囲を選択するコンポーネント',
          props: [
            { name: 'value', type: 'DateRange', required: true, description: '現在の日付範囲' },
            { name: 'onChange', type: '(range: DateRange) => void', required: true, description: '範囲変更時のコールバック' },
            { name: 'presets', type: 'DatePreset[]', required: false, description: 'プリセット期間の配列' }
          ],
          example: `<DateRangeSelector
  value={{
    start: new Date(Date.now() - 86400000),
    end: new Date()
  }}
  onChange={setDateRange}
/>`
        }
      ]
    },
    vi: {
      title: 'API Component',
      subtitle: 'Properties và methods của React components',
      description: 'Tham khảo API chi tiết cho từng component.',
      components: [
        {
          name: 'DataChart',
          description: 'Component biểu đồ dữ liệu cơ bản',
          props: [
            { name: 'data', type: 'SensorData[]', required: true, description: 'Mảng dữ liệu cảm biến để hiển thị' },
            { name: 'config', type: 'ChartConfig', required: true, description: 'Object cấu hình biểu đồ' },
            { name: 'onConfigChange', type: '(config: ChartConfig) => void', required: false, description: 'Callback khi thay đổi cấu hình' },
            { name: 'height', type: 'number', required: false, description: 'Chiều cao biểu đồ (mặc định: 400)' },
            { name: 'showExport', type: 'boolean', required: false, description: 'Hiển thị nút xuất (mặc định: true)' }
          ],
          example: `<DataChart
  data={sensorData}
  config={{
    type: 'line',
    showLegend: true,
    enableZoom: true,
    multiAxis: false,
    showGrid: true,
    displayMode: 'standard'
  }}
  onConfigChange={handleConfigChange}
  height={500}
/>`
        },
        {
          name: 'MetricSelector',
          description: 'Component để chọn metrics',
          props: [
            { name: 'selectedMetrics', type: 'MetricType[]', required: true, description: 'Mảng metrics đã chọn' },
            { name: 'onSelectionChange', type: '(metrics: MetricType[]) => void', required: true, description: 'Callback khi thay đổi lựa chọn' },
            { name: 'compact', type: 'boolean', required: false, description: 'Chế độ hiển thị compact (mặc định: false)' }
          ],
          example: `<MetricSelector
  selectedMetrics={['temperature', 'humidity']}
  onSelectionChange={setSelectedMetrics}
  compact={false}
/>`
        },
        {
          name: 'DateRangeSelector',
          description: 'Component chọn phạm vi ngày',
          props: [
            { name: 'value', type: 'DateRange', required: true, description: 'Phạm vi ngày hiện tại' },
            { name: 'onChange', type: '(range: DateRange) => void', required: true, description: 'Callback khi thay đổi phạm vi' },
            { name: 'presets', type: 'DatePreset[]', required: false, description: 'Mảng các khoảng thời gian preset' }
          ],
          example: `<DateRangeSelector
  value={{
    start: new Date(Date.now() - 86400000),
    end: new Date()
  }}
  onChange={setDateRange}
/>`
        }
      ]
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

      {/* Components */}
      <div className="space-y-12">
        {t.components.map((component, idx) => (
          <section key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-mono font-semibold text-primary-600 dark:text-primary-400 mb-2">
              {component.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {component.description}
            </p>

            {/* Props Table */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Props
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900">
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Prop
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Required
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {component.props.map((prop, pIdx) => (
                      <tr key={pIdx}>
                        <td className="px-4 py-2 font-mono text-sm text-primary-600 dark:text-primary-400">
                          {prop.name}
                        </td>
                        <td className="px-4 py-2 font-mono text-sm text-gray-700 dark:text-gray-300">
                          {prop.type}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {prop.required ? (
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                          {prop.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Example
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code className="language-jsx text-gray-800 dark:text-gray-200">
                    {component.example}
                  </code>
                </pre>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}