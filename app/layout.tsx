import '../styles/globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: '天气预报 - Next.js 示例',
  description: '基于 OpenWeatherMap 的中文天气应用，支持定位与 5 天预报',
}

export const viewport: Viewport = {
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:bg-gray-900/60">
          <div className="container flex items-center justify-between py-4">
            <h1 className="text-lg font-semibold">天气预报</h1>
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              数据源：OpenWeatherMap
            </a>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="container py-8 text-center text-sm text-gray-500">
          仅供演示使用
        </footer>
      </body>
    </html>
  )
}
