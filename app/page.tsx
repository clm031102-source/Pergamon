'use client'

import Link from 'next/link'
import { BookOpen, ArrowRight, Heart } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useBooks } from '@/lib/useBooks'

export default function LandingPage() {
  const { allBooks, stats } = useBooks()

  const topPreferences = Object.entries(
    allBooks.reduce((acc, book) => {
      book.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="border-b border-stone-200 bg-white/90">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><BookOpen className="h-6 w-6 text-indigo-600" /><span className="font-semibold text-lg">纸间漫游</span></div>
          <Link href="/demo" className="text-sm text-stone-600 hover:text-stone-900">进入书架 →</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-10">
        <section className="grid md:grid-cols-5 gap-8 items-end">
          <div className="md:col-span-3 space-y-5">
            <p className="text-sm text-stone-500">我的私人阅读空间</p>
            <h1 className="text-4xl font-bold leading-tight">真正可持续的个人书架与阅读记录</h1>
            <p className="text-lg text-stone-600">手动录入、编辑、删除、筛选、统计、书摘管理、JSON 导入导出，一站完成你的长期阅读管理。</p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/demo"><Button size="lg">查看我的书架</Button></Link>
              <Link href="/upload"><Button variant="outline" size="lg">新增一本书</Button></Link>
            </div>
          </div>
          <div className="md:col-span-2 rounded-2xl border border-stone-200 bg-white p-6">
            <p className="text-sm text-stone-500">当前阅读快照</p>
            <p className="mt-2 text-stone-700">共 {stats.total} 本，已读 {stats.byStatus['已读']} 本，在读 {stats.byStatus['在读']} 本。</p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <article className="md:col-span-2 rounded-2xl bg-white border border-stone-200 p-8">
            <h2 className="text-2xl font-semibold mb-4">你可以做什么</h2>
            <ul className="space-y-3 text-stone-600">
              <li>• 管理状态：想读 / 在读 / 已读 / 搁置 / 弃读</li>
              <li>• 记录评分、短评、长评与多条书摘笔记</li>
              <li>• 通过搜索、筛选和排序快速定位书目</li>
              <li>• 导入导出 JSON（含合并、覆盖、跳过重复）与 CSV 导出</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-white border border-stone-200 p-8">
            <h2 className="text-xl font-semibold mb-4">我的阅读偏好（实时）</h2>
            <ul className="space-y-3 text-sm text-stone-600">
              {topPreferences.length === 0 && <li>先去新增几本书，偏好会自动生成。</li>}
              {topPreferences.map(([tag, count]) => (
                <li key={tag} className="flex gap-2"><Heart className="h-4 w-4 mt-0.5 text-rose-500" />{tag}（{count} 本）</li>
              ))}
            </ul>
          </article>
        </section>

        <div>
          <Link href="/demo" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">立即开始管理书架 <ArrowRight className="h-4 w-4 ml-1" /></Link>
        </div>
      </main>
    </div>
  )
}
