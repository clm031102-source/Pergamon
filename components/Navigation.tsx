'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface NavigationProps {
  currentPage: 'home' | 'library' | 'statistics' | 'upload' | 'notes'
  title?: string
  subtitle?: string
}

export default function Navigation({ currentPage, title, subtitle }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: '首页', page: 'home' as const },
    { href: '/demo', label: '我的书架', page: 'library' as const },
    { href: '/upload', label: '新增书籍', page: 'upload' as const },
    { href: '/notes', label: '书摘', page: 'notes' as const },
    { href: '/stats', label: '阅读统计', page: 'statistics' as const },
  ]

  const getLinkClasses = (page: string, isMobile = false) => {
    const baseClasses = isMobile
      ? 'block px-3 py-2 text-base font-medium rounded-md'
      : 'inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md'

    const activeClasses = isMobile ? 'text-indigo-700 bg-indigo-100' : 'border-transparent text-indigo-700 bg-indigo-100'
    const inactiveClasses = isMobile ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'

    return `${baseClasses} ${currentPage === page ? activeClasses : inactiveClasses}`
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title || '纸间漫游'}</h1>
            {subtitle && <p className="text-sm text-gray-600 truncate">{subtitle}</p>}
          </div>

          <nav className="hidden md:flex md:space-x-3">
            {navLinks.map((link) => <Link key={link.page} href={link.href} className={getLinkClasses(link.page)}>{link.label}</Link>)}
          </nav>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-3 space-y-1 border-t border-gray-200 pt-3">
            {navLinks.map((link) => (
              <Link key={link.page} href={link.href} className={getLinkClasses(link.page, true)} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
