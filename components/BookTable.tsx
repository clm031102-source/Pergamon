'use client'

import { useMemo, useState } from 'react'
import { Search, X, Upload, Download, FolderArchive, Star, ExternalLink, SlidersHorizontal } from 'lucide-react'
import { mapBookToForm, useBooks } from '@/lib/useBooks'
import { Book, ImportSummary } from '@/types/book'
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
    books, loading, error, filters, sortBy, uniqueCategories, uniqueLanguages, uniqueTags,
    setSortBy, setFilters, clearFilters, totalBooks, filteredCount, favoriteCount,
    updateBook, deleteBook, exportJson, exportCsv, importBooks,
  } = useBooks()

  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [feedback, setFeedback] = useState('')
  const [importMode, setImportMode] = useState<ImportSummary['mode']>('合并')
  const [showTools, setShowTools] = useState(false)

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

  const bookCards = useMemo(() => books.map((book) => (
    <button key={book.id} className="text-left bg-white rounded-2xl border border-gray-200 p-4 space-y-3 hover:shadow-md transition-shadow" onClick={() => setEditingBook(book)}>
      <div className="flex justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{book.author}</p>
        </div>
        <span className="text-xs rounded-full bg-indigo-50 text-indigo-700 px-2 py-1 h-fit">{book.status}</span>
      </div>
      <div className="flex flex-wrap gap-2">{book.tags.slice(0, 4).map((tag) => <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">#{tag}</span>)}</div>
      <div className="flex items-center justify-between">
        <StarView rating={book.rating} />
        {book.bookUrl ? (
          <a
            href={book.bookUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800"
          >
            访问链接 <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        ) : (
          <span className="text-xs text-gray-400">未设置链接</span>
        )}
      </div>
    </button>
  )), [books])

  if (loading) return <div className="text-center py-20 text-gray-600">书架加载中...</div>
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="grid md:grid-cols-3 gap-4"><Stat label="总书数" value={totalBooks} /><Stat label="筛选后" value={filteredCount} /><Stat label="收藏数" value={favoriteCount} /></div>

      <section className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <button className="inline-flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm" onClick={() => setShowTools(!showTools)}>
          <SlidersHorizontal className="w-4 h-4" />
          筛选与工具{showTools ? '（收起）' : '（展开）'}
        </button>

        {showTools && (
          <div className="space-y-5 mt-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">按分类快速筛选</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setFilters({ ...filters, category: '' })} className={`px-3 py-1 rounded-full text-sm border ${filters.category === '' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-300 text-gray-600'}`}>全部分类</button>
                {uniqueCategories.map((category) => <button type="button" key={category} onClick={() => setFilters({ ...filters, category })} className={`px-3 py-1 rounded-full text-sm border ${filters.category === category ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-300 text-gray-600'}`}>{category}</button>)}
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-3">
              <label className="md:col-span-2 relative"><Search className="w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" /><input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="搜索书名 / 作者 / 标签" className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2" /></label>
              <select className="border border-gray-300 rounded-md px-3 py-2" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">全部状态</option><option>想读</option><option>在读</option><option>已读</option><option>搁置</option><option>弃读</option></select>
              <select className="border border-gray-300 rounded-md px-3 py-2" value={filters.tag} onChange={(e) => setFilters({ ...filters, tag: e.target.value })}><option value="">全部标签</option>{uniqueTags.map((item) => <option key={item}>{item}</option>)}</select>
              <select className="border border-gray-300 rounded-md px-3 py-2" value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })}><option value="">全部语言</option>{uniqueLanguages.map((item) => <option key={item}>{item}</option>)}</select>
              <select className="border border-gray-300 rounded-md px-3 py-2" value={filters.favorite} onChange={(e) => setFilters({ ...filters, favorite: e.target.value as typeof filters.favorite })}><option value="全部">全部收藏状态</option><option value="仅收藏">仅收藏</option></select>
              <select className="border border-gray-300 rounded-md px-3 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>{sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
              <div className="grid grid-cols-2 gap-2"><input type="number" min={0} max={5} step={0.5} value={filters.ratingMin} onChange={(e) => setFilters({ ...filters, ratingMin: Number(e.target.value) || 0 })} className="border border-gray-300 rounded-md px-3 py-2" placeholder="最低评分" /><input type="number" min={0} max={5} step={0.5} value={filters.ratingMax} onChange={(e) => setFilters({ ...filters, ratingMax: Number(e.target.value) || 5 })} className="border border-gray-300 rounded-md px-3 py-2" placeholder="最高评分" /></div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Button variant="outline" onClick={clearFilters}><X className="w-4 h-4 mr-1" />清空筛选</Button>
              <span className="mx-2 text-gray-300">|</span>
              <div className="flex items-center gap-2 text-gray-700 font-medium"><FolderArchive className="h-4 w-4" />导入导出</div>
              <Button variant="outline" onClick={() => handleExport('json')}><Download className="w-4 h-4 mr-1" />导出 JSON</Button>
              <Button variant="outline" onClick={() => handleExport('csv')}><Download className="w-4 h-4 mr-1" />导出 CSV</Button>
              <select value={importMode} onChange={(e) => setImportMode(e.target.value as ImportSummary['mode'])} className="border border-gray-300 rounded-md px-3 py-2 text-sm">{importModes.map((mode) => <option key={mode} value={mode}>导入模式：{mode}</option>)}</select>
              <label className="inline-flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md cursor-pointer text-sm"><Upload className="w-4 h-4" />导入 JSON<input type="file" accept="application/json,.json" className="hidden" onChange={(e) => handleImportFile(e.target.files?.[0])} /></label>
            </div>
          </div>
        )}
      </section>

      {feedback && <p className="text-sm text-green-700">{feedback}</p>}

      <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{bookCards}</section>
      {bookCards.length === 0 && <p className="text-center text-gray-500 py-10">没有匹配结果，请调整筛选条件。</p>}

      {editingBook && (
        <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto p-4">
          <button
            type="button"
            onClick={() => setEditingBook(null)}
            className="fixed top-6 right-6 z-[60] rounded-full bg-white border border-gray-300 w-10 h-10 text-xl leading-none"
            aria-label="关闭"
          >
            ×
          </button>
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-5 shadow-xl border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">《{editingBook.title}》</h3>
            <BookForm
              initialData={mapBookToForm(editingBook)}
              submitText="保存修改"
              onSubmit={(form) => { updateBook(editingBook.id, form); setEditingBook(null); setFeedback('编辑成功。') }}
              onDelete={() => {
                if (!window.confirm(`确认删除《${editingBook.title}》吗？此操作不可撤销。`)) return
                deleteBook(editingBook.id)
                setEditingBook(null)
                setFeedback('删除成功。')
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function StarView({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-sm text-gray-400">未评分</span>
  const stars = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => {
        const full = rating >= s
        const half = rating === s - 0.5
        return (
          <span key={s} className="relative w-4 h-4 inline-block">
            <Star className={`w-4 h-4 ${full ? 'fill-amber-400 text-amber-400' : half ? 'text-amber-400' : 'text-gray-300'}`} />
            {half && <span className="absolute inset-0 w-1/2 overflow-hidden"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /></span>}
          </span>
        )
      })}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-semibold">{value}</p></div>
}
