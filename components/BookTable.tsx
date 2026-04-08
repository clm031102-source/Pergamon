'use client'

import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import { ExternalLink, Search, Filter, X, Star } from 'lucide-react'
import { Book } from '@/types/book'
import { useBooks } from '@/lib/useBooks'

export default function BookTable() {
  const {
    books,
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
    totalBooks,
    filteredCount,
    featuredCount,
  } = useBooks()

  const columns = useMemo<ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: 'title',
        header: '书名',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-gray-900">{row.original.title}</div>
            {row.original.note && (
              <div className="text-xs text-gray-500 mt-1 line-clamp-1">{row.original.note}</div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'author',
        header: '作者',
        cell: ({ row }) => <div className="text-gray-700">{row.original.author}</div>,
      },
      {
        accessorKey: 'tags',
        header: '标签',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
              >
                {tag}
              </span>
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: '阅读状态',
        cell: ({ row }) => <div className="text-gray-600">{row.original.status || '未标注'}</div>,
      },
      {
        accessorKey: 'rating',
        header: '评分',
        cell: ({ row }) => (
          <div className="text-gray-600">{row.original.rating ? `${row.original.rating} / 5` : '-'}</div>
        ),
      },
      {
        accessorKey: 'goodreads',
        header: '外部链接',
        cell: ({ row }) => (
          <a
            href={row.original.goodreads}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Goodreads
          </a>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: books,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold">书架加载失败</div>
        <div className="text-gray-600 mt-2">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">当前可见</p>
          <p className="text-2xl font-semibold text-gray-900">{filteredCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">总藏书</p>
          <p className="text-2xl font-semibold text-gray-900">{totalBooks}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">精选标记</p>
            <p className="text-2xl font-semibold text-gray-900">{featuredCount}</p>
          </div>
          <Star className="h-5 w-5 text-amber-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="按书名、作者或标签搜索"
              value={filters.search}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.genre}
            onChange={(e) => updateGenre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部标签</option>
            {uniqueGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <select
            value={filters.language}
            onChange={(e) => updateLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部语言</option>
            {uniqueLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部状态</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {(filters.search || filters.genre || filters.language || filters.status) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-1" />
              清空筛选
            </button>
          )}
        </div>
      </div>

      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        {books.map((book, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">{book.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{book.author}</p>
                {book.note && <p className="text-sm text-gray-500 mt-2">{book.note}</p>}
              </div>

              <div className="flex flex-wrap gap-1">
                {book.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{book.status || '未标注'} · {book.language}</span>
                <a
                  href={book.goodreads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  链接
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCount === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有匹配结果</h3>
          <p className="mt-1 text-sm text-gray-500">试试放宽关键词或清空筛选条件</p>
        </div>
      )}
    </div>
  )
}
