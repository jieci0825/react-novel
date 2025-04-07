import { SearchBookParams } from '@/app/types/book-store.type'

export interface BookDetailResult {
    resourceId: number
    cover: string
    title: string
    author: string
    description: string
    _source: number
}

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

export interface BookSourceSearchResult {
    limit: number
    list: SearchBookItem[]
}

export type BookSourceImpl = {
    search: (data: SearchBookParams) => Promise<BookSourceSearchResult>
}
