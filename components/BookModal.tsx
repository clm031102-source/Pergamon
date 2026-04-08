'use client'

import { ExternalLink } from 'lucide-react'
import { Book } from '@/types/book'
import Button from '@/components/ui/Button'

interface BookModalProps {
  book: Book | null
  onClose: () => void
  onEdit: (book: Book) => void
  onDelete: (book: Book) => void
}

export default function BookModal({ book, onClose, onEdit, onDelete }: BookModalProps) {
  if (!book) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="关闭浮窗" />
      <article className="relative w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl p-6 space-y-5">
        <header className="space-y-1">
          <h2 className="text-2xl font-semibold">{book.title}</h2>
          {book.subtitle && <p className="text-gray-600">{book.subtitle}</p>}
          <p className="text-sm text-gray-600">{book.author}{book.translator ? ` / 译者：${book.translator}` : ''}</p>
          <p className="text-sm text-gray-500">{book.publisher || '未填写出版社'} {book.publishYear ? `· ${book.publishYear}` : ''}</p>
          {book.bookUrl && (
            <a href={book.bookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800">
              访问书本链接 <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          )}
        </header>

        <section className="grid md:grid-cols-2 gap-4 text-sm">
          <Info label="ISBN" value={book.isbn || '未填写'} />
          <Info label="语言" value={book.language || '未填写'} />
          <Info label="页数" value={book.pages ? `${book.pages} 页` : '未填写'} />
          <Info label="分类" value={book.category || '未填写'} />
          <Info label="标签" value={book.tags.join('、') || '未填写'} />
          <Info label="阅读状态" value={book.status} />
          <Info label="开始阅读" value={book.startedAt || '未填写'} />
          <Info label="读完日期" value={book.finishedAt || '未填写'} />
          <Info label="当前进度" value={book.progress !== null ? `${book.progress}${book.progressUnit === '百分比' ? '%' : ' 页'}` : '未填写'} />
          <Info label="评分" value={book.rating !== null ? `${book.rating} / 5` : '未评分'} />
          <Info label="是否收藏" value={book.favorite ? '是' : '否'} />
          <Info label="是否推荐" value={book.recommended ? '是' : '否'} />
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold">一句话短评</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{book.shortReview || '暂无'}</p>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold">长评 / 读后总结</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{book.longReview || '暂无'}</p>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold">书摘 / 笔记</h3>
          <div className="space-y-3">
            {book.notes.length === 0 && <p className="text-sm text-gray-500">暂无书摘。</p>}
            {book.notes.map((note) => (
              <div key={note.id} className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-indigo-600">{note.type}{note.page ? ` · 第 ${note.page} 页` : ''}</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{note.content}</p>
                {note.remark && <p className="text-xs text-gray-500 mt-1">备注：{note.remark}</p>}
              </div>
            ))}
          </div>
        </section>

        <footer className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onEdit(book)}>编辑</Button>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => onDelete(book)}>删除</Button>
          <Button onClick={onClose}>关闭</Button>
        </footer>
      </article>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 mt-1">{value}</p>
    </div>
  )
}
