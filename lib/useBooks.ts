'use client'

import { useState, useEffect, useMemo } from 'react'
import { Book, BookFilter } from '@/types/book'

type RawBook = Record<string, unknown>

const normalizeBook = (raw: RawBook): Book => {
  const tags = (raw.tags ?? raw.Tags) as string[] | undefined

  return {
    title: String(raw.title ?? raw.Title ?? ''),
    author: String(raw.author ?? raw.Author ?? ''),
    language: String(raw.language ?? raw.Language ?? ''),
    goodreads: String(raw.goodreads ?? raw.Goodreads ?? ''),
    tags: Array.isArray(tags) ? tags.map(String) : [],
    rating:
      typeof raw.rating === 'number' && Number.isFinite(raw.rating)
        ? raw.rating
        : undefined,
    note: typeof raw.note === 'string' ? raw.note : undefined,
    featured: Boolean(raw.featured),
    status:
      raw.status === '想读' || raw.status === '在读' || raw.status === '已读'
        ? raw.status
        : undefined,
  }
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<BookFilter>({
    search: '',
    genre: '',
    language: '',
    status: '',
  })

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch('/user_bookshelf.json')
        if (!response.ok) throw new Error('加载书架数据失败')
        const data: RawBook[] = await response.json()
        setBooks(data.map(normalizeBook).filter((book) => book.title))
      } catch (err) {
        setError(err instanceof Error ? err.message : '发生未知错误')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>()
    books.forEach((book) => book.tags.forEach((tag) => genres.add(tag)))
    return Array.from(genres).sort((a, b) => a.localeCompare(b, 'zh-CN'))
  }, [books])

  const uniqueLanguages = useMemo(() => {
    const languages = new Set<string>()
    books.forEach((book) => languages.add(book.language))
    return Array.from(languages).sort((a, b) => a.localeCompare(b, 'zh-CN'))
  }, [books])

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>()
    books.forEach((book) => {
      if (book.status) statuses.add(book.status)
    })
    return Array.from(statuses)
  }, [books])

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const titleMatch = book.title.toLowerCase().includes(searchTerm)
        const authorMatch = book.author.toLowerCase().includes(searchTerm)
        const tagMatch = book.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm),
        )
        if (!titleMatch && !authorMatch && !tagMatch) return false
      }

      if (filters.genre && !book.tags.includes(filters.genre)) return false
      if (filters.language && book.language !== filters.language) return false
      if (filters.status && book.status !== filters.status) return false

      return true
    })
  }, [books, filters])

  const updateSearch = (search: string) =>
    setFilters((prev: BookFilter) => ({ ...prev, search }))
  const updateGenre = (genre: string) =>
    setFilters((prev: BookFilter) => ({ ...prev, genre }))
  const updateLanguage = (language: string) =>
    setFilters((prev: BookFilter) => ({ ...prev, language }))
  const updateStatus = (status: string) =>
    setFilters((prev: BookFilter) => ({ ...prev, status }))

  const clearFilters = () => {
    setFilters({ search: '', genre: '', language: '', status: '' })
  }

  return {
    books: filteredBooks,
    loading,
    error,
    filters,
    uniqueGenres,
    uniqueLanguages,
    uniqueStatuses,
    updateSearch,
    updateGenre,
    updateLanguage,
    updateStatus,
    clearFilters,
    totalBooks: books.length,
    filteredCount: filteredBooks.length,
    featuredCount: books.filter((book) => book.featured).length,
  }
}
