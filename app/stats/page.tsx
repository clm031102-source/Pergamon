'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Book } from '@/types/book'

export default function StatsPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/user_bookshelf.json')
        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error('读取书架数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const tagStats = Object.entries(
    books.reduce((acc, book) => {
      book.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>),
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  const statusStats = Object.entries(
    books.reduce((acc, book) => {
      const key = book.status || '未标注'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>),
  ).sort(([, a], [, b]) => b - a)

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">统计加载中...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation
        currentPage="statistics"
        title="阅读统计"
        subtitle="把书架里的偏好和变化看得更清楚"
      />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">总藏书</h3>
              <p className="text-3xl font-bold text-indigo-600">{books.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">标签数量</h3>
              <p className="text-3xl font-bold text-green-600">{tagStats.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">平均评分</h3>
              <p className="text-3xl font-bold text-amber-600">
                {(
                  books.reduce((sum, b) => sum + (b.rating || 0), 0) /
                  Math.max(books.filter((b) => b.rating).length, 1)
                ).toFixed(1)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">高频标签</h2>
              <div className="space-y-3">
                {tagStats.map(([tag, count]) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="text-gray-700">{tag}</span>
                    <span className="text-sm text-gray-500">{count} 本</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">阅读状态分布</h2>
              <div className="space-y-3">
                {statusStats.map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-gray-700">{status}</span>
                    <span className="text-sm text-gray-500">{count} 本</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
