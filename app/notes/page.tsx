'use client'

import { useMemo, useState } from 'react'
import Navigation from '@/components/Navigation'
import { useBooks } from '@/lib/useBooks'
import { NOTE_TYPES } from '@/types/book'

export default function NotesPage() {
  const { noteItems } = useBooks()
  const [bookFilter, setBookFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [keyword, setKeyword] = useState('')

  const bookTitles = Array.from(new Set(noteItems.map((item) => item.bookTitle)))

  const notes = useMemo(() => noteItems.filter((note) => {
    if (bookFilter && note.bookTitle !== bookFilter) return false
    if (typeFilter && note.type !== typeFilter) return false
    if (keyword && !note.content.toLowerCase().includes(keyword.toLowerCase())) return false
    return true
  }), [bookFilter, keyword, noteItems, typeFilter])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation currentPage="notes" title="书摘" subtitle="集中回看你记录过的所有金句与想法" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <section className="bg-white rounded-lg border border-gray-200 p-4 grid md:grid-cols-3 gap-3">
          <select className="border border-gray-300 rounded-md px-3 py-2" value={bookFilter} onChange={(e) => setBookFilter(e.target.value)}>
            <option value="">全部书名</option>{bookTitles.map((title) => <option key={title}>{title}</option>)}
          </select>
          <select className="border border-gray-300 rounded-md px-3 py-2" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">全部类型</option>{NOTE_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
          <input className="border border-gray-300 rounded-md px-3 py-2" placeholder="搜索摘录内容" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </section>

        <section className="space-y-3">
          {notes.length === 0 && <p className="text-center text-gray-500 py-12">没有匹配的书摘。</p>}
          {notes.map((note) => (
            <article key={note.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-indigo-600">{note.bookTitle} · {note.type}{note.page ? ` · 第 ${note.page} 页` : ''}</p>
              <p className="mt-2 text-sm whitespace-pre-wrap">{note.content}</p>
              {note.remark && <p className="text-xs text-gray-500 mt-2">备注：{note.remark}</p>}
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
