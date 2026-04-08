export const READING_STATUSES = ['想读', '在读', '已读', '搁置', '弃读'] as const
export type ReadingStatus = (typeof READING_STATUSES)[number]

export const NOTE_TYPES = ['金句', '观点', '方法', '灵感'] as const
export type NoteType = (typeof NOTE_TYPES)[number]

export interface BookNote {
  id: string
  content: string
  page: number | null
  type: NoteType
  remark: string
}

export interface Book {
  id: string
  title: string
  subtitle: string
  author: string
  translator: string
  publisher: string
  publishYear: number | null
  isbn: string
  language: string
  pages: number | null
  category: string
  tags: string[]
  coverUrl: string
  status: ReadingStatus
  startedAt: string
  finishedAt: string
  progress: number | null
  progressUnit: '页数' | '百分比'
  rating: number | null
  shortReview: string
  longReview: string
  favorite: boolean
  recommended: boolean
  notes: BookNote[]
  createdAt: string
  updatedAt: string
}

export interface BookFilter {
  search: string
  status: string
  category: string
  tag: string
  language: string
  favorite: '全部' | '仅收藏'
  ratingMin: number
  ratingMax: number
}

export type SortOption =
  | 'recentAdded'
  | 'recentFinished'
  | 'ratingDesc'
  | 'titleAsc'
  | 'authorAsc'
  | 'publishYearDesc'

export interface BookFormData {
  title: string
  subtitle: string
  author: string
  translator: string
  publisher: string
  publishYear: string
  isbn: string
  language: string
  pages: string
  category: string
  tagsText: string
  coverUrl: string
  status: ReadingStatus
  startedAt: string
  finishedAt: string
  progress: string
  progressUnit: '页数' | '百分比'
  rating: string
  shortReview: string
  longReview: string
  favorite: boolean
  recommended: boolean
  notes: BookNote[]
}

export interface ImportSummary {
  mode: '覆盖' | '合并' | '跳过重复'
  added: number
  updated: number
  skipped: number
}
