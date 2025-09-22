import Link from 'next/link';
import { Zap, FileText, BarChart3, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <Zap className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Familia Energy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            リアルタイムエネルギー監視と分析のための包括的なダッシュボード
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              ダッシュボード
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              エネルギー消費データをリアルタイムで可視化・分析
            </p>
          </Link>

          <Link
            href="/docs"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              技術ドキュメント
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              統合ガイド・APIリファレンス・注意事項
            </p>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>🇯🇵 日本語</span>
            <span>•</span>
            <span>🇻🇳 Tiếng Việt</span>
            <span>•</span>
            <span>Next.js 15.5.3</span>
            <span>•</span>
            <span>TypeScript</span>
          </div>
        </div>
      </div>
    </div>
  );
}