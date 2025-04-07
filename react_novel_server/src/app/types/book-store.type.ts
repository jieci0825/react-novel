import { Page } from './common.type'

export interface GetBookParams extends Page {
    categoryId: number
}

export interface SearchBookParams extends Page {
    keyword: string
    source: number
}

export interface SearchBookItem {
    bookId: number
    title: string
    author: string
    description: string
    cover: string
    status: string
    wordCount: number
    _source: number
}

export interface SearchBookResult {
    total: number
    list: SearchBookItem[]
}
