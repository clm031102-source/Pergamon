'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import BookForm from '@/components/BookForm'
import { useBooks } from '@/lib/useBooks'

export default function UploadPage() {
  const { addBook } = useBooks()
  const [message, setMessage] = useState('')

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation
        currentPage="upload"
        title="新增书籍"
        subtitle="手动录入一本新书，补全你的私人书架"
      />

      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <BookForm
            submitText="新增到书架"
            onSubmit={(form) => {
              addBook(form)
              setMessage(`《${form.title}》已成功加入书架。`)
            }}
          />
          {message && <p className="text-sm text-green-700">{message}</p>}
        </div>
      </div>
    </main>
  )
}
