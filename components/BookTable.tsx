'use client'

import { useMemo, useState } from 'react'
import { Search, X, Upload, Download } from 'lucide-react'
import { mapBookToForm, useBooks } from '@/lib/useBooks'
import { Book, ImportSummary } from '@/types/book'
import BookModal from '@/components/BookModal'
import BookForm from '@/components/BookForm'
import Button from '@/components/ui/Button'

const sortOptions = [
  { value: 'recentAdded', label: '最近添加' },
  { value: 'recentFinished', label: '最近读完' },
  { value: 'ratingDesc', label: '评分最高' },
  { value: 'titleAsc', label: '标题 A-Z' },
  { value: 'authorAsc', label: '作者 A-Z' },
  { value: 'publishYearDesc', label: '出版年份' },
] as const

const importModes: ImportSummary['mode'][] = ['合并', '跳过重复', '覆盖']

export default function BookTable() {
  const {
    books,
    loading,
    error,
    filters,
    sortBy,
    uniqueCategories,
    uniqueLanguages,
    uniqueTags,
    setSortBy,
    setFilters,
    clearFilters,
    totalBooks,
    filteredCount,
    favoriteCount,
    updateBook,
    deleteBook,
    exportJson,
    exportCsv,
    importBooks,
  } = useBooks()

  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [feedback, setFeedback] = useState('')
  const [importMode, setImportMode] = useState<ImportSummary['mode']>('合并')

  const handleExport = (type: 'json' | 'csv') => {
    const content = type === 'json' ? exportJson() : exportCsv()
    const blob = new Blob([content], { type: type === 'json' ? 'application/json' : 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `书架备份-${new Date().toISOString().slice(0, 10)}.${type}`
    a.click()
    URL.revokeObjectURL(url)
    setFeedback(type === 'json' ? 'JSON 导出成功。' : 'CSV 导出成功。')
  }

  const handleImportFile = async (file?: File) => {
    if (!file) return
    try {
      const text = await file.text()
      const result = importBooks(text, importMode)
      setFeedback(`导入成功：新增 ${result.added} 本，更新 ${result.updated} 本，跳过 ${result.skipped} 本。`)
    } catch (e) {
      setFeedback(`导入失败：${e instanceof Error ? e.message : '文件格式错误'}`)
    }
  }

  const bookCards = useMemo(
    () =>
      books.map((book) => (
        <button
          key={book.id}
          className="text-left bg-white rounded-xl border border-gray-200 p-4 space-y-3 hover:shadow-md transition-shadow"
          onClick={() => setSelectedBook(book)}
        >
          <div className="flex justify-between gap-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{book.author}</p>
            </div>
            <span className="text-xs rounded-full bg-indigo-50 text-indigo-700 px-2 py-1 h-fit">{book.status}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {book.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">#{tag}</span>
            ))}
          </div>
          <p className="text-sm text-gray-500">评分：{book.rating !== null ? `${book.rating}/5` : '暂无'} {book.favorite ? '· 已收藏' : ''}</p>
        </button>
      )),
    [books],
  )

  if (loading) return <div className="text-center py-20 text-gray-600">书架加载中...</div>
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Stat label="总书数" value={totalBooks} />
        <Stat label="筛选后" value={filteredCount} />
        <Stat label="收藏数" value={favoriteCount} />
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="grid md:grid-cols-4 gap-3">
          <label className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="搜索书名 / 作者 / 标签"
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2"
            />
          </label>
          <select className="border border-gray-300 rounded-md px-3 py-2" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">全部状态</option><option>想读</option><option>在读</option><option>已读</option><option>搁置</option><option>弃读</option>
          </select>
          <select className="border border-gray-300 rounded-md px-3 py-2" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">全部分类</option>{uniqueCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="border border-gray-300 rounded-md px-3 py-2" value={filters.tag} onChange={(e) => setFilters({ ...filters, tag: e.target.value })}>
            <option value="">全部标签</option>{uniqueTags.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="border border-gray-300 rounded-md px-3 py-2" value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })}>
            <option value="">全部语言</option>{uniqueLanguages.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="border border-gray-300 rounded-md px-3 py-2" value={filters.favorite} onChange={(e) => setFilters({ ...filters, favorite: e.target.value as typeof filters.favorite })}>
            <option value="全部">全部收藏状态</option><option value="仅收藏">仅收藏</option>
          </select>
          <select className="border border-gray-300 rounded-md px-3 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
            {sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min={0} max={5} step={0.1} value={filters.ratingMin} onChange={(e) => setFilters({ ...filters, ratingMin: Number(e.target.value) || 0 })} className="border border-gray-300 rounded-md px-3 py-2" placeholder="最低评分" />
            <input type="number" min={0} max={5} step={0.1} value={filters.ratingMax} onChange={(e) => setFilters({ ...filters, ratingMax: Number(e.target.value) || 5 })} className="border border-gray-300 rounded-md px-3 py-2" placeholder="最高评分" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="outline" onClick={clearFilters}><X className="w-4 h-4 mr-1" />清空筛选</Button>
          <Button variant="outline" onClick={() => handleExport('json')}><Download className="w-4 h-4 mr-1" />导出 JSON</Button>
          <Button variant="outline" onClick={() => handleExport('csv')}><Download className="w-4 h-4 mr-1" />导出 CSV</Button>
          <select value={importMode} onChange={(e) => setImportMode(e.target.value as ImportSummary['mode'])} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            {importModes.map((mode) => <option key={mode} value={mode}>导入模式：{mode}</option>)}
          </select>
          <label className="inline-flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md cursor-pointer text-sm">
            <Upload className="w-4 h-4" />导入 JSON
            <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => handleImportFile(e.target.files?.[0])} />
          </label>
        </div>

        {feedback && <p className="text-sm text-green-700">{feedback}</p>}
      </section>

      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{bookCards}</section>

      {bookCards.length === 0 && <p className="text-center text-gray-500 py-10">没有匹配结果，请调整筛选条件。</p>}

      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onEdit={(book) => {
          setEditingBook(book)
          setSelectedBook(null)
        }}
        onDelete={(book) => {
          if (!window.confirm(`确认删除《${book.title}》吗？此操作不可撤销。`)) return
          deleteBook(book.id)
          setSelectedBook(null)
          setFeedback('删除成功。')
        }}
      />

      {editingBook && (
        <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl p-5">
            <h3 className="text-xl font-semibold mb-4">编辑书籍</h3>
            <BookForm
              initialData={mapBookToForm(editingBook)}
              submitText="保存编辑"
              onSubmit={(form) => {
                updateBook(editingBook.id, form)
                setEditingBook(null)
                setFeedback('编辑成功。')
              }}
              onCancel={() => setEditingBook(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}
