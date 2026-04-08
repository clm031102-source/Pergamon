export type ReadingStatus = '想读' | '在读' | '已读'

/**
 * 书架中的单本图书
 */
export interface Book {
  title: string
  author: string
  language: string
  goodreads: string
  tags: string[]
  rating?: number
  note?: string
  featured?: boolean
  status?: ReadingStatus
}

/**
 * 书架筛选条件
 */
export interface BookFilter {
  search?: string
  genre?: string
  language?: string
  status?: string
}
