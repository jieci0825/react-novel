import { SearchBookParams } from '@/app/types/book-store.type'

export interface SearchBookItem {
    bookId: number | string
    title: string
    author: string
    description: string
    cover: string
    status: string
    wordCount: string
    _source: number
}

export interface ChapterItem {
    // 若存在正文链接，则表示可以通过该链接直接获取正文内容
    contentUrl?: string
    contentCount?: number
    chapterId: number | string
    chapterName: string
    _source: number
}

export interface BookDetailResult extends SearchBookItem {
    chapters: ChapterItem[]
    chapterCount: number
}

export interface BookSourceSearchResult {
    limit: number
    list: SearchBookItem[]
}

export type BookSourceImpl = {
    search: (data: SearchBookParams) => Promise<BookSourceSearchResult>
    detail: (bookId: SearchBookItem['bookId']) => Promise<BookDetailResult>
    chapter: (bookId: SearchBookItem['bookId']) => Promise<ChapterItem[]>
}
