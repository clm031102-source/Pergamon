import Link from 'next/link'
import { BookOpen, ArrowRight, Heart, Sparkles, Bookmark } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="font-semibold text-lg">纸间漫游</span>
          </div>
          <Link href="/demo" className="text-sm text-stone-600 hover:text-stone-900">
            进入书架 →
          </Link>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-5 items-end">
            <div className="md:col-span-3 space-y-6">
              <p className="text-sm tracking-wide uppercase text-stone-500">
                我的私人阅读空间
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-stone-900">
                纸间漫游
                <span className="block text-2xl md:text-3xl text-stone-500 mt-3 font-medium">
                  把读过的、想读的、反复回看的书，安静地放在一起。
                </span>
              </h1>
              <p className="text-lg text-stone-600 max-w-2xl leading-relaxed">
                这里不是打卡榜单，也不是速读清单，而是一间慢慢长出来的书房。欢迎你来翻翻，看看我最近在想什么。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button size="lg" className="px-8 py-4 text-base">
                    去看我的完整书架
                  </Button>
                </Link>
                <Link href="/stats">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-base">
                    看看阅读统计
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-500">本月阅读心情</span>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-xl font-semibold">在人文与科技之间来回穿梭</p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  白天读产品与设计，晚上读小说与随笔。最近尤其迷恋“城市、记忆、身份”的主题。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <article className="md:col-span-2 rounded-2xl bg-white border border-stone-200 p-8">
              <h2 className="text-2xl font-semibold mb-4">关于这个书架</h2>
              <p className="text-stone-600 leading-relaxed">
                我一直觉得，书架是一个人的“长期记忆”。它不会像社交媒体那样不断刷新，而是把你在不同阶段的关注、焦虑和热爱都留了下来。这个站点用最轻量的方式保存我的阅读轨迹：纯静态、可搜索、易分享。
              </p>
            </article>
            <article className="rounded-2xl bg-white border border-stone-200 p-8">
              <h2 className="text-xl font-semibold mb-4">我的阅读偏好</h2>
              <ul className="space-y-3 text-sm text-stone-600">
                <li className="flex gap-2"><Heart className="h-4 w-4 mt-0.5 text-rose-500" />社会科学与叙事非虚构</li>
                <li className="flex gap-2"><Heart className="h-4 w-4 mt-0.5 text-rose-500" />当代中文小说与散文</li>
                <li className="flex gap-2"><Heart className="h-4 w-4 mt-0.5 text-rose-500" />产品、设计、创作方法论</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-2xl border border-stone-200 bg-white p-8">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Bookmark className="h-5 w-5" />
              <h2 className="text-2xl font-semibold text-stone-900">精选书单 / 本月推荐</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-stone-50">
                <p className="font-medium">《置身事内》</p>
                <p className="text-stone-500 mt-2">理解现实运行逻辑的一把钥匙，读完会更清醒。</p>
              </div>
              <div className="p-4 rounded-xl bg-stone-50">
                <p className="font-medium">《变量》</p>
                <p className="text-stone-500 mt-2">从年份切片看社会变化，适合做长期观察训练。</p>
              </div>
              <div className="p-4 rounded-xl bg-stone-50">
                <p className="font-medium">《你当像鸟飞往你的山》</p>
                <p className="text-stone-500 mt-2">关于教育、自我与重建，后劲很大。</p>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/demo" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                立即浏览完整书架 <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
        纸间漫游 · 一个持续更新的私人书架（Next.js + 静态 JSON）
      </footer>
    </div>
  )
}
