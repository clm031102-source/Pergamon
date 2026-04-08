'use client'

import Navigation from '@/components/Navigation'
import { useBooks } from '@/lib/useBooks'

export default function StatsPage() {
  const { allBooks, stats } = useBooks()

  const categoryStats = Object.entries(
    allBooks.reduce((acc, book) => {
      const key = book.category || '未分类'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  ).sort((a, b) => b[1] - a[1])

  const ratingStats = [5, 4, 3, 2, 1, 0].map((rating) => ({
    label: rating === 0 ? '未评分' : `${rating} 星`,
    count: allBooks.filter((book) => (rating === 0 ? book.rating === null : Math.floor(book.rating ?? 0) === rating)).length,
  }))

  const authorStats = Object.entries(
    allBooks.reduce((acc, book) => {
      acc[book.author] = (acc[book.author] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const recentFinished = [...allBooks].filter((b) => b.finishedAt).sort((a, b) => +new Date(b.finishedAt) - +new Date(a.finishedAt)).slice(0, 5)
  const recentAdded = [...allBooks].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5)

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation currentPage="statistics" title="阅读统计" subtitle="从书架数据看到你的长期阅读轨迹" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <Card label="总书数" value={stats.total} />
          <Card label="已读" value={stats.byStatus['已读']} />
          <Card label="在读" value={stats.byStatus['在读']} />
          <Card label="想读" value={stats.byStatus['想读']} />
          <Card label="搁置" value={stats.byStatus['搁置']} />
          <Card label="弃读" value={stats.byStatus['弃读']} />
          <Card label="本月新增" value={stats.monthAdded} />
          <Card label="本月读完" value={stats.monthFinished} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ListCard title="分类分布" items={categoryStats.map(([name, count]) => `${name}：${count} 本`)} />
          <ListCard title="评分分布" items={ratingStats.map((row) => `${row.label}：${row.count} 本`)} />
          <ListCard title="作者出现次数（Top 10）" items={authorStats.map(([name, count]) => `${name}：${count} 本`)} />
          <ListCard title="最近读完" items={recentFinished.map((book) => `${book.finishedAt} · ${book.title}`)} />
          <ListCard title="最近添加" items={recentAdded.map((book) => `${book.createdAt.slice(0, 10)} · ${book.title}`)} />
        </div>
      </div>
    </main>
  )
}

function Card({ label, value }: { label: string; value: number }) {
  return <div className="bg-white rounded-lg border border-gray-200 p-3"><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-semibold">{value}</p></div>
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="font-semibold mb-3">{title}</h2>
      <ul className="space-y-2 text-sm text-gray-700">
        {items.length === 0 && <li className="text-gray-400">暂无数据</li>}
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  )
}
