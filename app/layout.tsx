import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '纸间漫游｜我的私人书架',
  description:
    '一个由静态 JSON 驱动的中文个人书架，记录我正在读、想读与反复回看的好书。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-stone-50 text-stone-900">{children}</body>
    </html>
  )
}
