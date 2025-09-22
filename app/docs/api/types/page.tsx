'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function TypesAPIDoc() {
  const [language, setLanguage] = useState<'ja' | 'vi'>('ja');

  const content = {
    ja: {
      title: 'データ型定義',
      subtitle: 'TypeScript型定義リファレンス',
      description: 'Familia Energyデータ可視化システムで使用される全ての型定義の詳細な仕様です。',
      sections: [
        {
          title: 'メトリクス型',
          types: [
            {
              name: 'MetricType',
              description: '測定可能なメトリクスの種類を定義',
              code: `type MetricType =
  | 'temperature'    // 温度 (°C)
  | 'humidity'       // 湿度 (%)
  | 'co2'           // CO2濃度 (ppm)
  | 'power'         // 電力 (kW)
  | 'occupancy'     // 占有率 (人数)
  | 'illuminance'   // 照度 (lx)
  | 'noise'         // 騒音 (dB)
  | 'pressure'      // 気圧 (hPa)
  | 'hvacStatus'    // HVAC状態
  | 'setTemperature'; // 設定温度 (°C)`
            }
          ]
        },
        {
          title: 'デバイス関連',
          types: [
            {
              name: 'Device',
              description: 'IoTデバイスの基本情報',
              code: `interface Device {
  id: string;           // デバイスの一意識別子
  name: string;         // デバイス名
  type: string;         // デバイスタイプ
  location: string;     // 設置場所
  status: 'online' | 'offline' | 'warning';  // デバイスステータス
  lastUpdate: Date;     // 最終更新日時
}`
            }
          ]
        },
        {
          title: 'センサーデータ',
          types: [
            {
              name: 'DataPoint',
              description: '単一のデータポイント',
              code: `interface DataPoint {
  timestamp: Date;  // タイムスタンプ
  value: number;    // 測定値
}`
            },
            {
              name: 'SensorData',
              description: 'センサーからのデータストリーム',
              code: `interface SensorData {
  deviceId: string;      // デバイスID
  metric: MetricType;    // メトリクスタイプ
  data: DataPoint[];     // データポイントの配列
  unit?: string;         // 単位（オプション）
}`
            }
          ]
        },
        {
          title: 'チャート設定',
          types: [
            {
              name: 'ChartConfig',
              description: 'チャートの表示設定',
              code: `interface ChartConfig {
  type: 'line' | 'bar' | 'area';  // チャートタイプ
  showLegend: boolean;             // 凡例表示
  enableZoom: boolean;             // ズーム機能
  multiAxis: boolean;              // 複数軸表示
  showGrid: boolean;               // グリッド表示
  displayMode: 'standard' | 'normalized' | 'split' | 'dual-axis';
  animations?: boolean;            // アニメーション
  timeRange?: DateRange;           // 時間範囲
}`
            },
            {
              name: 'GraphConfigItem',
              description: '個別グラフの設定',
              code: `interface GraphConfigItem {
  id: string;                      // グラフID
  title: string;                   // タイトル
  selectedMetrics: MetricType[];   // 選択されたメトリクス
  selectedDevices: string[];       // 選択されたデバイスID
  chartConfig: ChartConfig;        // チャート設定
  gridPosition?: {                 // グリッド位置
    x: number;
    y: number;
    w: number;
    h: number;
  };
}`
            }
          ]
        },
        {
          title: 'プリセット',
          types: [
            {
              name: 'ChartPreset',
              description: 'グラフプリセット設定',
              code: `interface ChartPreset {
  id: string;                      // プリセットID
  name: string;                    // プリセット名
  description?: string;            // 説明
  dateRange: DateRange;            // 日付範囲
  graphs: GraphConfigItem[];       // グラフ設定の配列
  createdAt?: Date;                // 作成日時
  updatedAt?: Date;                // 更新日時
}`
            }
          ]
        },
        {
          title: 'ユーティリティ型',
          types: [
            {
              name: 'DateRange',
              description: '日付範囲の指定',
              code: `interface DateRange {
  start: Date;  // 開始日時
  end: Date;    // 終了日時
}`
            },
            {
              name: 'Alert',
              description: 'アラート情報',
              code: `interface Alert {
  id: string;                           // アラートID
  type: 'warning' | 'error' | 'info';  // アラートタイプ
  message: string;                      // メッセージ
  deviceId?: string;                    // 関連デバイスID
  timestamp: Date;                      // 発生時刻
  acknowledged: boolean;                // 確認済みフラグ
}`
            }
          ]
        }
      ]
    },
    vi: {
      title: 'Định nghĩa Kiểu dữ liệu',
      subtitle: 'Tham khảo định nghĩa kiểu TypeScript',
      description: 'Thông số kỹ thuật chi tiết của tất cả các định nghĩa kiểu được sử dụng trong hệ thống trực quan hóa dữ liệu Familia Energy.',
      sections: [
        {
          title: 'Kiểu Metric',
          types: [
            {
              name: 'MetricType',
              description: 'Định nghĩa các loại metric có thể đo lường',
              code: `type MetricType =
  | 'temperature'    // Nhiệt độ (°C)
  | 'humidity'       // Độ ẩm (%)
  | 'co2'           // Nồng độ CO2 (ppm)
  | 'power'         // Công suất (kW)
  | 'occupancy'     // Tỷ lệ lấp đầy (người)
  | 'illuminance'   // Độ chiếu sáng (lx)
  | 'noise'         // Tiếng ồn (dB)
  | 'pressure'      // Áp suất (hPa)
  | 'hvacStatus'    // Trạng thái HVAC
  | 'setTemperature'; // Nhiệt độ cài đặt (°C)`
            }
          ]
        },
        {
          title: 'Liên quan đến Thiết bị',
          types: [
            {
              name: 'Device',
              description: 'Thông tin cơ bản của thiết bị IoT',
              code: `interface Device {
  id: string;           // Mã định danh duy nhất của thiết bị
  name: string;         // Tên thiết bị
  type: string;         // Loại thiết bị
  location: string;     // Vị trí lắp đặt
  status: 'online' | 'offline' | 'warning';  // Trạng thái thiết bị
  lastUpdate: Date;     // Thời gian cập nhật cuối
}`
            }
          ]
        },
        {
          title: 'Dữ liệu Cảm biến',
          types: [
            {
              name: 'DataPoint',
              description: 'Một điểm dữ liệu đơn',
              code: `interface DataPoint {
  timestamp: Date;  // Dấu thời gian
  value: number;    // Giá trị đo
}`
            },
            {
              name: 'SensorData',
              description: 'Luồng dữ liệu từ cảm biến',
              code: `interface SensorData {
  deviceId: string;      // ID thiết bị
  metric: MetricType;    // Loại metric
  data: DataPoint[];     // Mảng các điểm dữ liệu
  unit?: string;         // Đơn vị (tùy chọn)
}`
            }
          ]
        },
        {
          title: 'Cấu hình Biểu đồ',
          types: [
            {
              name: 'ChartConfig',
              description: 'Cấu hình hiển thị biểu đồ',
              code: `interface ChartConfig {
  type: 'line' | 'bar' | 'area';  // Loại biểu đồ
  showLegend: boolean;             // Hiển thị chú thích
  enableZoom: boolean;             // Chức năng zoom
  multiAxis: boolean;              // Hiển thị nhiều trục
  showGrid: boolean;               // Hiển thị lưới
  displayMode: 'standard' | 'normalized' | 'split' | 'dual-axis';
  animations?: boolean;            // Hoạt ảnh
  timeRange?: DateRange;           // Phạm vi thời gian
}`
            },
            {
              name: 'GraphConfigItem',
              description: 'Cấu hình đồ thị riêng lẻ',
              code: `interface GraphConfigItem {
  id: string;                      // ID đồ thị
  title: string;                   // Tiêu đề
  selectedMetrics: MetricType[];   // Các metric đã chọn
  selectedDevices: string[];       // ID thiết bị đã chọn
  chartConfig: ChartConfig;        // Cấu hình biểu đồ
  gridPosition?: {                 // Vị trí lưới
    x: number;
    y: number;
    w: number;
    h: number;
  };
}`
            }
          ]
        },
        {
          title: 'Preset',
          types: [
            {
              name: 'ChartPreset',
              description: 'Cấu hình preset đồ thị',
              code: `interface ChartPreset {
  id: string;                      // ID preset
  name: string;                    // Tên preset
  description?: string;            // Mô tả
  dateRange: DateRange;            // Phạm vi ngày
  graphs: GraphConfigItem[];       // Mảng cấu hình đồ thị
  createdAt?: Date;                // Ngày tạo
  updatedAt?: Date;                // Ngày cập nhật
}`
            }
          ]
        },
        {
          title: 'Kiểu Tiện ích',
          types: [
            {
              name: 'DateRange',
              description: 'Chỉ định phạm vi ngày',
              code: `interface DateRange {
  start: Date;  // Ngày giờ bắt đầu
  end: Date;    // Ngày giờ kết thúc
}`
            },
            {
              name: 'Alert',
              description: 'Thông tin cảnh báo',
              code: `interface Alert {
  id: string;                           // ID cảnh báo
  type: 'warning' | 'error' | 'info';  // Loại cảnh báo
  message: string;                      // Thông điệp
  deviceId?: string;                    // ID thiết bị liên quan
  timestamp: Date;                      // Thời gian xảy ra
  acknowledged: boolean;                // Cờ đã xác nhận
}`
            }
          ]
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

      {/* Type Definitions */}
      <div className="space-y-12">
        {t.sections.map((section, sIdx) => (
          <section key={sIdx}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              {section.title}
            </h2>
            <div className="space-y-8">
              {section.types.map((type, tIdx) => (
                <div key={tIdx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-mono font-semibold text-primary-600 dark:text-primary-400">
                        {type.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {type.description}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm">
                        <code className="language-typescript text-gray-800 dark:text-gray-200">
                          {type.code}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}