'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Book,
  BookFilter,
  BookFormData,
  BookNote,
  ImportSummary,
  READING_STATUSES,
  ReadingStatus,
  SortOption,
} from '@/types/book'

const STORAGE_KEY = 'pergamon-bookshelf-v3'

const DEFAULT_FILTERS: BookFilter = {
  search: '',
  status: '',
  category: '',
  tag: '',
  language: '',
  favorite: '全部',
  ratingMin: 0,
  ratingMax: 5,
}

export const emptyNote = (): BookNote => ({
  id: crypto.randomUUID(),
  content: '',
  page: null,
  type: '金句',
  remark: '',
})

export const createEmptyForm = (): BookFormData => ({
  title: '',
  subtitle: '',
  author: '',
  translator: '',
  publisher: '',
  publishYear: '',
  isbn: '',
  language: '中文',
  pages: '',
  category: '',
  tags: [],
  bookUrl: '',
  status: '想读',
  startedAt: '',
  finishedAt: '',
  progress: '',
  progressUnit: '百分比',
  rating: '',
  shortReview: '',
  longReview: '',
  favorite: false,
  recommended: false,
  notes: [],
})

type RawBook = Record<string, unknown>

const normalizeStatus = (status: unknown): ReadingStatus => {
  if (typeof status === 'string' && READING_STATUSES.includes(status as ReadingStatus)) {
    return status as ReadingStatus
  }
  return '想读'
}

const normalizeBook = (raw: RawBook): Book => {
  const now = new Date().toISOString()
  const tags = Array.isArray(raw.tags) ? raw.tags.map(String) : Array.isArray(raw.Tags) ? (raw.Tags as string[]) : []
  const category = String(raw.category ?? '').trim() || tags[0] || '未分类'

  const notes = Array.isArray(raw.notes)
    ? raw.notes
        .map((note) => {
          if (!note || typeof note !== 'object') return null
          const n = note as Record<string, unknown>
          return {
            id: String(n.id ?? crypto.randomUUID()),
            content: String(n.content ?? '').trim(),
            page: typeof n.page === 'number' && Number.isFinite(n.page) ? n.page : null,
            type: n.type === '金句' || n.type === '观点' || n.type === '方法' || n.type === '灵感' ? n.type : '金句',
            remark: String(n.remark ?? ''),
          } as BookNote
        })
        .filter((note): note is BookNote => Boolean(note && note.content))
    : []

  return {
    id: String(raw.id ?? crypto.randomUUID()),
    title: String(raw.title ?? raw.Title ?? '').trim(),
    subtitle: String(raw.subtitle ?? ''),
    author: String(raw.author ?? raw.Author ?? '').trim(),
    translator: String(raw.translator ?? ''),
    publisher: String(raw.publisher ?? ''),
    publishYear: typeof raw.publishYear === 'number' ? raw.publishYear : null,
    isbn: String(raw.isbn ?? ''),
    language: String(raw.language ?? raw.Language ?? '中文'),
    pages: typeof raw.pages === 'number' ? raw.pages : null,
    category,
    tags,
    bookUrl: String(raw.bookUrl ?? raw.goodreads ?? ''),
    status: normalizeStatus(raw.status),
    startedAt: String(raw.startedAt ?? ''),
    finishedAt: String(raw.finishedAt ?? ''),
    progress: typeof raw.progress === 'number' ? raw.progress : null,
    progressUnit: raw.progressUnit === '页数' ? '页数' : '百分比',
    rating: typeof raw.rating === 'number' ? raw.rating : null,
    shortReview: String(raw.shortReview ?? raw.note ?? ''),
    longReview: String(raw.longReview ?? ''),
    favorite: Boolean(raw.favorite ?? raw.featured),
    recommended: Boolean(raw.recommended),
    notes,
    createdAt: String(raw.createdAt ?? now),
    updatedAt: String(raw.updatedAt ?? now),
  }
}

const mapFormToBook = (form: BookFormData, existingId?: string, createdAt?: string): Book => {
  const now = new Date().toISOString()
  const publishYear = Number(form.publishYear)
  const pages = Number(form.pages)
  const progress = Number(form.progress)
  const rating = Number(form.rating)

  return {
    id: existingId ?? crypto.randomUUID(),
    title: form.title.trim(),
    subtitle: form.subtitle.trim(),
    author: form.author.trim(),
    translator: form.translator.trim(),
    publisher: form.publisher.trim(),
    publishYear: Number.isFinite(publishYear) && publishYear > 0 ? publishYear : null,
    isbn: form.isbn.trim(),
    language: form.language.trim() || '中文',
    pages: Number.isFinite(pages) && pages > 0 ? pages : null,
    category: form.category.trim() || form.tags[0] || '未分类',
    tags: form.tags,
    bookUrl: form.bookUrl.trim(),
    status: form.status,
    startedAt: form.startedAt,
    finishedAt: form.finishedAt,
    progress: Number.isFinite(progress) && progress >= 0 ? progress : null,
    progressUnit: form.progressUnit,
    rating: Number.isFinite(rating) && rating >= 0 && rating <= 5 ? rating : null,
    shortReview: form.shortReview.trim(),
    longReview: form.longReview.trim(),
    favorite: form.favorite,
    recommended: form.recommended,
    notes: form.notes.filter((note) => note.content.trim()),
    createdAt: createdAt ?? now,
    updatedAt: now,
  }
}

export const mapBookToForm = (book: Book): BookFormData => ({
  title: book.title,
  subtitle: book.subtitle,
  author: book.author,
  translator: book.translator,
  publisher: book.publisher,
  publishYear: book.publishYear ? String(book.publishYear) : '',
  isbn: book.isbn,
  language: book.language,
  pages: book.pages ? String(book.pages) : '',
  category: book.category,
  tags: book.tags,
  bookUrl: book.bookUrl,
  status: book.status,
  startedAt: book.startedAt,
  finishedAt: book.finishedAt,
  progress: book.progress !== null ? String(book.progress) : '',
  progressUnit: book.progressUnit,
  rating: book.rating !== null ? String(book.rating) : '',
  shortReview: book.shortReview,
  longReview: book.longReview,
  favorite: book.favorite,
  recommended: book.recommended,
  notes: book.notes,
})

export function useBooks() {
  const [allBooks, setAllBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<BookFilter>(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState<SortOption>('recentAdded')

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const localData = localStorage.getItem(STORAGE_KEY)
        if (localData) {
          const parsed = JSON.parse(localData) as RawBook[]
          setAllBooks(parsed.map(normalizeBook).filter((book) => book.title))
          return
        }

        setAllBooks([])
      } catch (err) {
        setError(err instanceof Error ? err.message : '发生未知错误')
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  const persist = useCallback((next: Book[]) => {
    setAllBooks(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addBook = useCallback((form: BookFormData) => {
    const book = mapFormToBook(form)
    persist([book, ...allBooks])
  }, [allBooks, persist])

  const updateBook = useCallback((bookId: string, form: BookFormData) => {
    const target = allBooks.find((book) => book.id === bookId)
    if (!target) return
    const updated = mapFormToBook(form, target.id, target.createdAt)
    persist(allBooks.map((book) => (book.id === bookId ? updated : book)))
  }, [allBooks, persist])

  const deleteBook = useCallback((bookId: string) => {
    persist(allBooks.filter((book) => book.id !== bookId))
  }, [allBooks, persist])

  const filteredBooks = useMemo(() => {
    const filtered = allBooks.filter((book) => {
      if (filters.search) {
        const term = filters.search.toLowerCase()
        const matched = book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term) || book.tags.some((tag) => tag.toLowerCase().includes(term))
        if (!matched) return false
      }

      if (filters.status && book.status !== filters.status) return false
      if (filters.category && book.category !== filters.category) return false
      if (filters.tag && !book.tags.includes(filters.tag)) return false
      if (filters.language && book.language !== filters.language) return false
      if (filters.favorite === '仅收藏' && !book.favorite) return false

      const score = book.rating ?? 0
      if (score < filters.ratingMin || score > filters.ratingMax) return false
      return true
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'recentAdded') return +new Date(b.createdAt) - +new Date(a.createdAt)
      if (sortBy === 'recentFinished') return +new Date(b.finishedAt || 0) - +new Date(a.finishedAt || 0)
      if (sortBy === 'ratingDesc') return (b.rating ?? 0) - (a.rating ?? 0)
      if (sortBy === 'titleAsc') return a.title.localeCompare(b.title, 'zh-CN')
      if (sortBy === 'authorAsc') return a.author.localeCompare(b.author, 'zh-CN')
      return (b.publishYear ?? 0) - (a.publishYear ?? 0)
    })
  }, [allBooks, filters, sortBy])

  const uniqueCategories = useMemo(() => Array.from(new Set(allBooks.map((book) => book.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN')), [allBooks])
  const uniqueLanguages = useMemo(() => Array.from(new Set(allBooks.map((book) => book.language).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN')), [allBooks])
  const uniqueTags = useMemo(() => Array.from(new Set(allBooks.flatMap((book) => book.tags).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN')), [allBooks])

  const stats = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()

    const byStatus = READING_STATUSES.reduce(
      (acc, status) => ({ ...acc, [status]: allBooks.filter((book) => book.status === status).length }),
      {} as Record<ReadingStatus, number>,
    )

    return {
      total: allBooks.length,
      favorite: allBooks.filter((book) => book.favorite).length,
      byStatus,
      monthAdded: allBooks.filter((book) => {
        const d = new Date(book.createdAt)
        return d.getFullYear() === y && d.getMonth() === m
      }).length,
      monthFinished: allBooks.filter((book) => {
        if (!book.finishedAt) return false
        const d = new Date(book.finishedAt)
        return d.getFullYear() === y && d.getMonth() === m
      }).length,
    }
  }, [allBooks])

  const noteItems = useMemo(
    () => allBooks.flatMap((book) => book.notes.map((note) => ({ ...note, bookId: book.id, bookTitle: book.title, author: book.author }))),
    [allBooks],
  )

  const exportJson = useCallback(() => JSON.stringify(allBooks, null, 2), [allBooks])

  const exportCsv = useCallback(() => {
    const header = ['书名', '作者', '状态', '分类', '标签', '评分', '是否收藏', '书本链接', '添加时间']
    const rows = allBooks.map((book) => [book.title, book.author, book.status, book.category, book.tags.join('|'), book.rating ?? '', book.favorite ? '是' : '否', book.bookUrl, book.createdAt])
    return [header, ...rows].map((row) => row.map((col) => `"${String(col).replace(/"/g, '""')}"`).join(',')).join('\n')
  }, [allBooks])

  const importBooks = useCallback((rawText: string, mode: ImportSummary['mode']): ImportSummary => {
    const raw = JSON.parse(rawText)
    if (!Array.isArray(raw)) throw new Error('导入文件必须是数组结构')
    const incoming = raw.map((item) => normalizeBook(item as RawBook)).filter((book) => book.title)

    if (mode === '覆盖') {
      persist(incoming)
      return { mode, added: incoming.length, updated: 0, skipped: 0 }
    }

    const existingMap = new Map(allBooks.map((book) => [book.id, book]))
    let added = 0
    let updated = 0
    let skipped = 0

    incoming.forEach((book) => {
      const duplicate = existingMap.get(book.id) ?? allBooks.find((b) => b.title === book.title && b.author === book.author)
      if (duplicate && mode === '跳过重复') {
        skipped += 1
        return
      }
      if (duplicate) {
        existingMap.set(duplicate.id, { ...book, id: duplicate.id, createdAt: duplicate.createdAt })
        updated += 1
        return
      }
      existingMap.set(book.id, book)
      added += 1
    })

    persist(Array.from(existingMap.values()))
    return { mode, added, updated, skipped }
  }, [allBooks, persist])

  return {
    allBooks,
    books: filteredBooks,
    loading,
    error,
    filters,
    sortBy,
    uniqueCategories,
    uniqueLanguages,
    uniqueTags,
    stats,
    noteItems,
    setSortBy,
    setFilters,
    clearFilters: () => setFilters(DEFAULT_FILTERS),
    addBook,
    updateBook,
    deleteBook,
    exportJson,
    exportCsv,
    importBooks,
    totalBooks: allBooks.length,
    filteredCount: filteredBooks.length,
    favoriteCount: allBooks.filter((book) => book.favorite).length,
  }
}
