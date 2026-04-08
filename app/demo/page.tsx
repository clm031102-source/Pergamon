import Navigation from '@/components/Navigation'
import BookTable from '@/components/BookTable'

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation
        currentPage="library"
        title="我的书架"
        subtitle="一份可搜索、可筛选、可分享的阅读清单"
      />

      <div className="py-8">
        <BookTable />
      </div>
    </main>
  )
}
