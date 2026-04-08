import Navigation from '@/components/Navigation'
import BookTable from '@/components/BookTable'

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation
        currentPage="library"
        title="我的书架"
        subtitle="搜索、筛选、排序、详情浮窗、编辑删除与导入导出都在这里"
      />

      <div className="py-8">
        <BookTable />
      </div>
    </main>
  )
}
