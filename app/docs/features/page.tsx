'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import {
  BarChart3,
  Activity,
  Layers,
  Edit2,
  Download,
  RotateCcw,
  TrendingUp,
  Settings,
  Sliders,
  Grid3x3,
  Camera,
  Palette,
  Bookmark,
  Save,
  RefreshCw,
  Trash2
} from 'lucide-react';

export default function FeaturesDoc() {
  const { language } = useLanguage();

  const content = {
    ja: {
      title: '実装済み機能一覧',
      subtitle: 'DataChartコンポーネントのUI順に整理した機能リファレンス',
      description: '実際に動作するDataChart/DataChartAdvancedコンポーネントの機能を、UIの配置順に記載しています。',

      sections: [
        {
          title: 'プリセット管理機能',
          description: 'ダッシュボード上部のプリセット管理システム',
          features: [
            {
              name: 'プリセットセレクター',
              icon: Bookmark,
              location: 'ダッシュボード上部左側',
              description: 'プリセットの選択・管理ボタン',
              implementation: [
                '「プリセット」ボタンクリックでドロワー展開',
                '保存済みプリセット数を表示（例：「3 件」）',
                'プリセット未保存時は「未保存」と表示',
                '現在選択中のプリセット名を表示'
              ]
            },
            {
              name: '初回ロード動作',
              icon: Activity,
              location: '自動処理',
              description: 'ページ読み込み時の動作',
              implementation: [
                'LocalStorageから保存済みプリセットを読み込み',
                '最初のプリセット（最も古いもの）を自動適用',
                'プリセットがない場合はデフォルト値（過去24時間）を設定',
                'プリセットの日付範囲と全グラフ設定を復元'
              ]
            },
            {
              name: 'プリセット切り替え',
              icon: RefreshCw,
              location: 'プリセットドロワー内',
              description: 'プリセット選択時の動作',
              implementation: [
                'プリセット選択で即座に日付範囲を変更',
                'グラフ設定（デバイス、メトリクス）を復元',
                'カスタムカラー設定も復元',
                '注意：プリセット切り替え直後はデータ取得前のため「データがありません」表示',
                '日付範囲選択後にデータが取得・表示される'
              ]
            },
            {
              name: 'プリセット保存',
              icon: Save,
              location: 'プリセットドロワー内「新規保存」ボタン',
              description: '現在の設定をプリセットとして保存',
              implementation: [
                'クリックで保存フォーム表示',
                'プリセット名を入力（必須）',
                '以下の要素を保存：',
                '- 日付範囲（start, end）',
                '- 全グラフの設定（複数グラフ対応）',
                '- 各グラフのデバイス選択',
                '- 各グラフのメトリクス選択',
                '- グラフタイプ（line/bar/area）',
                '- カスタムカラー設定',
                'LocalStorageに保存（永続化）'
              ]
            },
            {
              name: 'プリセット更新',
              icon: Edit2,
              location: 'プリセットドロワー内「現在の設定で更新」ボタン',
              description: '既存プリセットの上書き更新',
              implementation: [
                '現在選択中のプリセットを更新',
                '現在の全設定で上書き',
                '更新日時を記録',
                'アラートで更新完了を通知'
              ]
            },
            {
              name: 'プリセット名編集',
              icon: Edit2,
              location: '各プリセット右側の編集アイコン',
              description: 'プリセット名の変更',
              implementation: [
                '編集アイコンクリックでインライン編集',
                'Enter で保存、Escape でキャンセル',
                '名前のみ変更（設定内容は保持）'
              ]
            },
            {
              name: 'プリセット削除',
              icon: Trash2,
              location: '各プリセット右側のゴミ箱アイコン',
              description: 'プリセットの削除',
              implementation: [
                'クリックで即座に削除',
                'LocalStorageから永久削除',
                '確認ダイアログなし（注意）'
              ]
            }
          ]
        },
        {
          title: 'チャートヘッダー部',
          description: 'グラフ上部のコントロール（左から右の順）',
          features: [
            {
              name: 'グラフタイトル編集',
              icon: Edit2,
              location: 'ヘッダー左側',
              description: 'クリックして編集可能なタイトル',
              implementation: [
                'タイトルにマウスホバーで編集アイコン表示',
                'クリックでインライン編集モード',
                'Enter で保存、Escape でキャンセル',
                'リアルタイムで他のコンポーネントと同期'
              ]
            },
            {
              name: 'チャートタイプ一括切り替え',
              icon: BarChart3,
              location: '各グラフヘッダー右側（3つのアイコン）',
              description: '全シリーズの表示タイプを一括変更',
              implementation: [
                'Line Chart（折れ線グラフ）',
                'Bar Chart（棒グラフ）',
                'Area Chart（エリアチャート）',
                '注意：全シリーズが同じタイプに統一される',
                '個別のシリーズタイプ設定はできない'
              ]
            },
            {
              name: '正規化表示トグル',
              icon: Sliders,
              location: 'チャートタイプの右',
              description: '0-100%にスケーリングして表示',
              implementation: [
                '「正規化 OFF」→「正規化 ON」のトグル',
                '異なる単位のデータを比較可能に',
                'ツールチップに元の値も表示',
                'メトリックごとの範囲設定済み'
              ]
            },
            {
              name: 'ズームリセット',
              icon: RotateCcw,
              location: 'アクションボタン群の左端',
              description: 'ズーム状態を初期化',
              implementation: [
                'Brushコンポーネントのリセット',
                '全データ範囲を表示'
              ]
            },
            {
              name: 'CSVエクスポート',
              icon: Download,
              location: 'リセットボタンの右',
              description: 'データをCSV形式でダウンロード',
              implementation: [
                'タイムスタンプ付きCSV生成',
                '表示中のシリーズのみエクスポート',
                'ファイル名に現在時刻を付与'
              ]
            },
            {
              name: '凡例表示',
              icon: Settings,
              location: 'CSVエクスポートの右',
              description: '凡例の表示/非表示',
              implementation: [
                'ON/OFF トグル',
                'チャート下部に凡例表示'
              ]
            }
          ]
        },
        {
          title: 'グラフ表示エリア',
          description: 'メインのグラフ表示部分',
          features: [
            {
              name: 'インタラクティブツールチップ',
              icon: Activity,
              location: 'グラフ上でマウスホバー',
              description: 'データポイントの詳細表示',
              implementation: [
                'マウス位置の値を表示',
                'タイムスタンプ表示',
                '各シリーズの値と単位',
                '正規化時は元の値も表示'
              ]
            },
            {
              name: 'ブラシズーム',
              icon: Grid3x3,
              location: 'グラフ下部',
              description: 'ドラッグで期間を選択して拡大',
              implementation: [
                'Recharts Brushコンポーネント',
                'ドラッグで範囲選択',
                'リアルタイムでグラフ更新'
              ]
            }
          ]
        },
        {
          title: '凡例エリア',
          description: 'グラフ下部の凡例（showLegend=true時）',
          features: [
            {
              name: 'シリーズトグル',
              icon: Layers,
              location: '各凡例項目',
              description: 'クリックで表示/非表示切り替え',
              implementation: [
                'クリックでシリーズの表示ON/OFF',
                '非表示時は薄い色で表示',
                '複数シリーズの同時制御可能'
              ]
            },
            {
              name: 'カラーピッカー',
              icon: Palette,
              location: '各凡例の色インジケーター',
              description: 'シリーズの色をカスタマイズ',
              implementation: [
                '色インジケータークリックでピッカー表示',
                '40色のプリセット（8系統×5段階グラデーション）',
                '赤/オレンジ/黄/緑/青緑/青/紫/ピンクの系統',
                '各系統は薄い→濃い5段階',
                'カスタムカラーピッカーも併用可能',
                '選択した色は保持される',
                'リアルタイムでグラフに反映'
              ]
            }
          ]
        },
        {
          title: 'DataChartAdvanced追加機能',
          description: 'Advanced版のみの高度な機能',
          features: [
            {
              name: 'グラフ高さ調整',
              icon: Sliders,
              location: '設定パネル内',
              description: 'グラフの高さをピクセル単位で調整',
              implementation: [
                'デフォルト340px',
                '100px～800pxの範囲で調整可能',
                'リアルタイムプレビュー'
              ]
            },
            {
              name: 'グリッド表示制御',
              icon: Grid3x3,
              location: '設定パネル内',
              description: 'グリッドラインの表示/非表示',
              implementation: [
                'CartesianGridコンポーネントの制御',
                'strokeDasharray設定済み'
              ]
            },
            {
              name: '画像エクスポート',
              icon: Camera,
              location: 'エクスポートボタン群',
              description: 'PNG形式でグラフを保存',
              implementation: [
                'html2canvasライブラリ使用',
                'ファイル名に時刻付与',
                '高解像度出力対応'
              ]
            },
            {
              name: '軸設定パネル',
              icon: Settings,
              location: '設定ボタンから展開',
              description: '各軸の詳細設定',
              implementation: [
                'Y軸の最小値/最大値設定',
                '目盛り数の調整',
                'メトリックごとの個別設定',
                '共通設定の一括適用'
              ]
            }
          ]
        }
      ],

      dataStructure: {
        title: 'データ構造',
        description: '必要なPropsとその型定義',
        items: [
          {
            name: 'data: SensorData[]',
            description: 'センサーデータの配列',
            example: `[{
  deviceId: "sensor-001",
  metric: "temperature",
  data: [
    { timestamp: Date, value: 23.5, unit: "°C" }
  ]
}]`
          },
          {
            name: 'config: ChartConfig',
            description: 'グラフ設定オブジェクト',
            example: `{
  type: "line" | "bar" | "area",
  showLegend: boolean,
  multiAxis: boolean,
  showGrid?: boolean,
  normalizeData?: boolean,
  hiddenSeries?: string[]
}`
          },
          {
            name: 'onConfigChange',
            description: '設定変更時のコールバック',
            example: '(config: ChartConfig) => void'
          }
        ]
      }
    },
    vi: {
      title: 'Danh sách Tính năng Đã Triển khai',
      subtitle: 'Tham khảo tính năng theo thứ tự UI của component DataChart',
      description: 'Liệt kê các tính năng thực tế đang hoạt động của DataChart/DataChartAdvanced theo thứ tự bố trí trên UI.',

      sections: [
        {
          title: 'Tính năng Quản lý Preset',
          description: 'Hệ thống quản lý preset ở phía trên dashboard',
          features: [
            {
              name: 'Preset Selector',
              icon: Bookmark,
              location: 'Phía trên bên trái dashboard',
              description: 'Nút chọn và quản lý preset',
              implementation: [
                'Click nút "Preset" để mở drawer',
                'Hiển thị số preset đã lưu (ví dụ: "3 件")',
                'Khi chưa lưu preset hiển thị "未保存"',
                'Hiển thị tên preset đang chọn'
              ]
            },
            {
              name: 'Hành vi Load lần đầu',
              icon: Activity,
              location: 'Xử lý tự động',
              description: 'Hành vi khi tải trang',
              implementation: [
                'Đọc preset đã lưu từ LocalStorage',
                'Tự động áp dụng preset đầu tiên (cũ nhất)',
                'Nếu không có preset, đặt giá trị mặc định (24 giờ qua)',
                'Khôi phục phạm vi ngày và toàn bộ cài đặt biểu đồ'
              ]
            },
            {
              name: 'Chuyển đổi Preset',
              icon: RefreshCw,
              location: 'Trong preset drawer',
              description: 'Hành vi khi chọn preset',
              implementation: [
                'Chọn preset để thay đổi phạm vi ngày ngay lập tức',
                'Khôi phục cài đặt biểu đồ (thiết bị, metrics)',
                'Khôi phục cả cài đặt màu tùy chỉnh',
                'Lưu ý: Ngay sau khi chuyển preset hiển thị "Không có dữ liệu"',
                'Dữ liệu được tải và hiển thị sau khi chọn phạm vi ngày'
              ]
            },
            {
              name: 'Lưu Preset',
              icon: Save,
              location: 'Nút "Lưu mới" trong preset drawer',
              description: 'Lưu cài đặt hiện tại thành preset',
              implementation: [
                'Click để hiển thị form lưu',
                'Nhập tên preset (bắt buộc)',
                'Các yếu tố được lưu:',
                '- Phạm vi ngày (start, end)',
                '- Cài đặt toàn bộ biểu đồ (hỗ trợ nhiều biểu đồ)',
                '- Lựa chọn thiết bị của mỗi biểu đồ',
                '- Lựa chọn metrics của mỗi biểu đồ',
                '- Loại biểu đồ (line/bar/area)',
                '- Cài đặt màu tùy chỉnh',
                'Lưu vào LocalStorage (vĩnh viễn)'
              ]
            },
            {
              name: 'Cập nhật Preset',
              icon: Edit2,
              location: 'Nút "Cập nhật với cài đặt hiện tại" trong preset drawer',
              description: 'Ghi đè preset hiện có',
              implementation: [
                'Cập nhật preset đang chọn',
                'Ghi đè với toàn bộ cài đặt hiện tại',
                'Ghi lại thời gian cập nhật',
                'Thông báo hoàn thành bằng alert'
              ]
            },
            {
              name: 'Sửa tên Preset',
              icon: Edit2,
              location: 'Icon edit bên phải mỗi preset',
              description: 'Thay đổi tên preset',
              implementation: [
                'Click icon edit để chỉnh sửa inline',
                'Enter để lưu, Escape để hủy',
                'Chỉ thay đổi tên (giữ nguyên cài đặt)'
              ]
            },
            {
              name: 'Xóa Preset',
              icon: Trash2,
              location: 'Icon thùng rác bên phải mỗi preset',
              description: 'Xóa preset',
              implementation: [
                'Click để xóa ngay lập tức',
                'Xóa vĩnh viễn khỏi LocalStorage',
                'Không có dialog xác nhận (cẩn thận)'
              ]
            }
          ]
        },
        {
          title: 'Phần Header Biểu đồ',
          description: 'Các điều khiển ở phía trên biểu đồ (từ trái sang phải)',
          features: [
            {
              name: 'Chỉnh sửa tiêu đề',
              icon: Edit2,
              location: 'Bên trái header',
              description: 'Tiêu đề có thể chỉnh sửa khi click',
              implementation: [
                'Hiện icon edit khi hover vào tiêu đề',
                'Click để vào chế độ chỉnh sửa inline',
                'Enter để lưu, Escape để hủy',
                'Đồng bộ realtime với component khác'
              ]
            },
            {
              name: 'Chuyển đổi loại biểu đồ hàng loạt',
              icon: BarChart3,
              location: 'Bên phải header mỗi biểu đồ (3 icon)',
              description: 'Thay đổi loại hiển thị cho tất cả series',
              implementation: [
                'Line Chart (Biểu đồ đường)',
                'Bar Chart (Biểu đồ cột)',
                'Area Chart (Biểu đồ vùng)',
                'Lưu ý: Tất cả series sẽ cùng loại',
                'Không thể cài đặt loại riêng cho từng series'
              ]
            },
            {
              name: 'Toggle chuẩn hóa',
              icon: Sliders,
              location: 'Bên phải chart type',
              description: 'Điều chỉnh tỷ lệ về 0-100%',
              implementation: [
                'Toggle "Chuẩn hóa OFF" → "Chuẩn hóa ON"',
                'So sánh được dữ liệu có đơn vị khác nhau',
                'Tooltip vẫn hiển thị giá trị gốc',
                'Đã cấu hình phạm vi cho từng metric'
              ]
            },
            {
              name: 'Reset Zoom',
              icon: RotateCcw,
              location: 'Nút đầu tiên trong nhóm action',
              description: 'Khôi phục trạng thái zoom',
              implementation: [
                'Reset Brush component',
                'Hiển thị toàn bộ phạm vi dữ liệu'
              ]
            },
            {
              name: 'Xuất CSV',
              icon: Download,
              location: 'Bên phải nút reset',
              description: 'Tải dữ liệu dạng CSV',
              implementation: [
                'Tạo CSV có timestamp',
                'Chỉ xuất series đang hiển thị',
                'Tên file có thời gian hiện tại'
              ]
            },
            {
              name: 'Multi-Axis (Nhiều trục) ※',
              icon: TrendingUp,
              location: 'Bên phải nút export',
              description: '【Chú ý: Chưa triển khai】 Trục độc lập cho mỗi metric',
              implementation: [
                'Nút toggle tồn tại nhưng không hoạt động',
                'Dự định: Hiển thị metric khác nhau với trục Y riêng',
                'Dự định: Tự động điều chỉnh phạm vi mỗi trục',
                'Hiện tại: Chỉ có trục Y đơn'
              ]
            },
            {
              name: 'Hiển thị chú thích',
              icon: Settings,
              location: 'Bên phải Multi-Axis',
              description: 'Hiện/ẩn chú thích',
              implementation: [
                'Toggle ON/OFF',
                'Hiển thị chú thích dưới biểu đồ'
              ]
            }
          ]
        },
        {
          title: 'Vùng Hiển thị Biểu đồ',
          description: 'Phần hiển thị biểu đồ chính',
          features: [
            {
              name: 'Tooltip tương tác',
              icon: Activity,
              location: 'Hover chuột trên biểu đồ',
              description: 'Hiển thị chi tiết điểm dữ liệu',
              implementation: [
                'Hiển thị giá trị tại vị trí chuột',
                'Hiển thị timestamp',
                'Giá trị và đơn vị mỗi series',
                'Hiển thị giá trị gốc khi chuẩn hóa'
              ]
            },
            {
              name: 'Brush Zoom',
              icon: Grid3x3,
              location: 'Phía dưới biểu đồ',
              description: 'Kéo để chọn và phóng to khoảng thời gian',
              implementation: [
                'Recharts Brush component',
                'Kéo để chọn phạm vi',
                'Cập nhật biểu đồ realtime'
              ]
            }
          ]
        },
        {
          title: 'Vùng Chú thích',
          description: 'Chú thích phía dưới biểu đồ (khi showLegend=true)',
          features: [
            {
              name: 'Toggle Series',
              icon: Layers,
              location: 'Mỗi mục chú thích',
              description: 'Click để hiện/ẩn',
              implementation: [
                'Click để bật/tắt hiển thị series',
                'Màu nhạt khi ẩn',
                'Điều khiển nhiều series đồng thời'
              ]
            },
            {
              name: 'Color Picker',
              icon: Palette,
              location: 'Indicator màu của mỗi chú thích',
              description: 'Tùy chỉnh màu series',
              implementation: [
                'Click vào indicator màu để mở picker',
                '40 màu preset (8 nhóm × 5 cấp gradient)',
                'Nhóm: đỏ/cam/vàng/xanh lá/xanh dương nhạt/xanh/tím/hồng',
                'Mỗi nhóm có 5 cấp từ nhạt → đậm',
                'Có thể dùng custom color picker',
                'Màu được lưu lại',
                'Cập nhật biểu đồ realtime'
              ]
            }
          ]
        },
        {
          title: 'Tính năng DataChartAdvanced',
          description: 'Tính năng nâng cao chỉ có ở bản Advanced',
          features: [
            {
              name: 'Điều chỉnh chiều cao',
              icon: Sliders,
              location: 'Trong panel cài đặt',
              description: 'Điều chỉnh chiều cao biểu đồ theo pixel',
              implementation: [
                'Mặc định 340px',
                'Điều chỉnh từ 100px đến 800px',
                'Preview realtime'
              ]
            },
            {
              name: 'Điều khiển Grid',
              icon: Grid3x3,
              location: 'Trong panel cài đặt',
              description: 'Hiện/ẩn đường lưới',
              implementation: [
                'Điều khiển CartesianGrid component',
                'Đã cài đặt strokeDasharray'
              ]
            },
            {
              name: 'Xuất hình ảnh',
              icon: Camera,
              location: 'Nhóm nút export',
              description: 'Lưu biểu đồ dạng PNG',
              implementation: [
                'Sử dụng thư viện html2canvas',
                'Tên file có thời gian',
                'Hỗ trợ xuất độ phân giải cao'
              ]
            },
            {
              name: 'Panel cài đặt trục',
              icon: Settings,
              location: 'Mở rộng từ nút cài đặt',
              description: 'Cài đặt chi tiết cho mỗi trục',
              implementation: [
                'Cài đặt min/max cho trục Y',
                'Điều chỉnh số vạch chia',
                'Cài đặt riêng cho từng metric',
                'Áp dụng cài đặt chung'
              ]
            }
          ]
        }
      ],

      dataStructure: {
        title: 'Cấu trúc Dữ liệu',
        description: 'Props cần thiết và định nghĩa kiểu',
        items: [
          {
            name: 'data: SensorData[]',
            description: 'Mảng dữ liệu cảm biến',
            example: `[{
  deviceId: "sensor-001",
  metric: "temperature",
  data: [
    { timestamp: Date, value: 23.5, unit: "°C" }
  ]
}]`
          },
          {
            name: 'config: ChartConfig',
            description: 'Object cấu hình biểu đồ',
            example: `{
  type: "line" | "bar" | "area",
  showLegend: boolean,
  multiAxis: boolean,
  showGrid?: boolean,
  normalizeData?: boolean,
  hiddenSeries?: string[]
}`
          },
          {
            name: 'onConfigChange',
            description: 'Callback khi thay đổi cấu hình',
            example: '(config: ChartConfig) => void'
          }
        ]
      }
    }
  };

  const t = content[language];

  return (
    <div className="max-w-6xl">
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

      {/* Feature Sections */}
      <div className="space-y-8">
        {t.sections.map((section, sIdx) => (
          <section key={sIdx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {section.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {section.description}
            </p>

            <div className="space-y-4">
              {section.features.map((feature, fIdx) => {
                const Icon = feature.icon;
                return (
                  <div key={fIdx} className="border-l-4 border-primary-500 pl-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 bg-primary-100 dark:bg-primary-900/30 rounded">
                        <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {feature.name}
                          </h3>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                            {feature.location}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {feature.description}
                        </p>
                        <ul className="space-y-1">
                          {feature.implementation.map((impl, iIdx) => (
                            <li key={iIdx} className="text-sm text-gray-500 dark:text-gray-500 flex items-start">
                              <span className="text-primary-400 mr-2">•</span>
                              {impl}
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
        ))}

        {/* Data Structure Section */}
        <section className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t.dataStructure.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t.dataStructure.description}
          </p>

          <div className="space-y-4">
            {t.dataStructure.items.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-mono font-semibold text-primary-600 dark:text-primary-400 mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.description}
                </p>
                <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                  <code className="text-gray-700 dark:text-gray-300">
                    {item.example}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}