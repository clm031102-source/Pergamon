'use client'

import { FormEvent, useMemo, useState } from 'react'
import { BookFormData, NOTE_TYPES, PRESET_TAGS, READING_STATUSES } from '@/types/book'
import { createEmptyForm, emptyNote } from '@/lib/useBooks'
import Button from '@/components/ui/Button'

interface BookFormProps {
  initialData?: BookFormData
  submitText: string
  onSubmit: (form: BookFormData) => void
  onCancel?: () => void
}

export default function BookForm({ initialData, submitText, onSubmit, onCancel }: BookFormProps) {
  const [form, setForm] = useState<BookFormData>(initialData ?? createEmptyForm())
  const [customTag, setCustomTag] = useState('')
  const [error, setError] = useState('')

  const requiredMissing = useMemo(() => !form.title.trim() || !form.author.trim() || !form.category.trim(), [form])

  const toggleTag = (tag: string) => {
    if (form.tags.includes(tag)) {
      setForm({ ...form, tags: form.tags.filter((item) => item !== tag) })
      return
    }
    setForm({ ...form, tags: [...form.tags, tag] })
  }

  const addCustomTag = () => {
    const value = customTag.trim()
    if (!value || form.tags.includes(value)) return
    setForm({ ...form, tags: [...form.tags, value] })
    setCustomTag('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (requiredMissing) return setError('请至少填写必填项：书名、作者、分类。')
    if (form.publishYear && (!Number.isFinite(Number(form.publishYear)) || Number(form.publishYear) < 0)) return setError('出版年份必须是合法数字。')
    if (form.pages && (!Number.isFinite(Number(form.pages)) || Number(form.pages) <= 0)) return setError('页数必须大于 0。')
    if (form.rating && (!Number.isFinite(Number(form.rating)) || Number(form.rating) < 0 || Number(form.rating) > 5)) return setError('评分必须在 0 到 5 之间。')
    if (form.progress && (!Number.isFinite(Number(form.progress)) || Number(form.progress) < 0)) return setError('阅读进度不能小于 0。')
    setError('')
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-semibold text-lg">基础信息</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="书名" required value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
          <Input label="副标题" value={form.subtitle} onChange={(value) => setForm({ ...form, subtitle: value })} />
          <Input label="作者" required value={form.author} onChange={(value) => setForm({ ...form, author: value })} />
          <Input label="译者" value={form.translator} onChange={(value) => setForm({ ...form, translator: value })} />
          <Input label="出版社" value={form.publisher} onChange={(value) => setForm({ ...form, publisher: value })} />
          <Input label="出版年份" type="number" value={form.publishYear} onChange={(value) => setForm({ ...form, publishYear: value })} />
          <Input label="ISBN" value={form.isbn} onChange={(value) => setForm({ ...form, isbn: value })} />
          <Input label="语言" value={form.language} onChange={(value) => setForm({ ...form, language: value })} />
          <Input label="页数" type="number" value={form.pages} onChange={(value) => setForm({ ...form, pages: value })} />
          <Input label="分类" required value={form.category} onChange={(value) => setForm({ ...form, category: value })} />
          <Input label="书本链接（可跳转）" value={form.bookUrl} onChange={(value) => setForm({ ...form, bookUrl: value })} />
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-700">标签（可多选）</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border ${form.tags.includes(tag) ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-300 text-gray-600'}`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="自定义标签"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
            <Button type="button" variant="outline" onClick={addCustomTag}>新增标签</Button>
          </div>

          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <button key={tag} type="button" className="px-2 py-1 rounded-md bg-gray-100 text-sm" onClick={() => toggleTag(tag)}>
                  {tag} ×
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-semibold text-lg">阅读记录</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="text-sm text-gray-700 space-y-1 block">阅读状态
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BookFormData['status'] })} className="w-full border border-gray-300 rounded-md px-3 py-2">
              {READING_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <Input label="开始阅读日期" type="date" value={form.startedAt} onChange={(value) => setForm({ ...form, startedAt: value })} />
          <Input label="读完日期" type="date" value={form.finishedAt} onChange={(value) => setForm({ ...form, finishedAt: value })} />
          <div className="grid grid-cols-2 gap-2">
            <Input label="当前进度" type="number" value={form.progress} onChange={(value) => setForm({ ...form, progress: value })} />
            <label className="text-sm text-gray-700 space-y-1 block">进度单位
              <select value={form.progressUnit} onChange={(e) => setForm({ ...form, progressUnit: e.target.value as BookFormData['progressUnit'] })} className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="百分比">百分比</option><option value="页数">页数</option>
              </select>
            </label>
          </div>
          <Input label="评分（0-5）" type="number" value={form.rating} onChange={(value) => setForm({ ...form, rating: value })} />
        </div>
        <Textarea label="一句话短评" value={form.shortReview} onChange={(value) => setForm({ ...form, shortReview: value })} rows={2} />
        <Textarea label="长评 / 读后总结" value={form.longReview} onChange={(value) => setForm({ ...form, longReview: value })} rows={4} />
        <div className="flex gap-6 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.favorite} onChange={(e) => setForm({ ...form, favorite: e.target.checked })} />是否收藏</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.recommended} onChange={(e) => setForm({ ...form, recommended: e.target.checked })} />是否推荐</label>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-semibold text-lg">书摘与笔记</h3><Button type="button" variant="outline" onClick={() => setForm({ ...form, notes: [...form.notes, emptyNote()] })}>新增一条书摘</Button></div>
        <div className="space-y-4">
          {form.notes.length === 0 && <p className="text-sm text-gray-500">还没有书摘，先从一句金句开始吧。</p>}
          {form.notes.map((note, idx) => (
            <div key={note.id} className="border border-gray-200 rounded-lg p-3 space-y-3">
              <div className="grid md:grid-cols-3 gap-3">
                <label className="text-sm text-gray-700">类型
                  <select value={note.type} onChange={(e) => { const notes = [...form.notes]; notes[idx] = { ...note, type: e.target.value as (typeof NOTE_TYPES)[number] }; setForm({ ...form, notes }) }} className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1">
                    {NOTE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </label>
                <Input label="页码" type="number" value={note.page ? String(note.page) : ''} onChange={(value) => { const notes = [...form.notes]; notes[idx] = { ...note, page: value ? Number(value) : null }; setForm({ ...form, notes }) }} />
                <div className="flex items-end"><Button type="button" variant="outline" className="w-full" onClick={() => setForm({ ...form, notes: form.notes.filter((item) => item.id !== note.id) })}>删除该条</Button></div>
              </div>
              <Textarea label="摘录内容" value={note.content} onChange={(value) => { const notes = [...form.notes]; notes[idx] = { ...note, content: value }; setForm({ ...form, notes }) }} rows={2} />
              <Textarea label="备注" value={note.remark} onChange={(value) => { const notes = [...form.notes]; notes[idx] = { ...note, remark: value }; setForm({ ...form, notes }) }} rows={2} />
            </div>
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3"><Button type="submit" disabled={requiredMissing}>{submitText}</Button>{onCancel && <Button type="button" variant="outline" onClick={onCancel}>取消</Button>}</div>
    </form>
  )
}

function Input({ label, required = false, value, onChange, type = 'text' }: { label: string; required?: boolean; value: string; type?: string; onChange: (value: string) => void }) {
  return <label className="text-sm text-gray-700 space-y-1 block">{label}{required && <span className="text-red-500 ml-1">*</span>}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" /></label>
}

function Textarea({ label, value, onChange, rows = 3 }: { label: string; value: string; rows?: number; onChange: (value: string) => void }) {
  return <label className="text-sm text-gray-700 space-y-1 block">{label}<textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" /></label>
}
