export interface BookCategoryItem {
    id: number
    categoryName: string
}

export interface HotRankingItem {
    id: number
    bookName: string
    bookAuthor: string
    accessCount: number
}

export interface FAQItem {
    id: number
    sn: number
    question: string
    answer: string
}

export interface SearchByKeywordParams {
    keyword: string
    _source: number
    page: number
}

export interface SearchBookItem {
    bookId: number | string
    title: string
    author: string
    cover: string
    wordCount: string
    status: string
    description: string
    _source: number
}

export interface SearchBookData {
    limit: number
    list: SearchBookItem[]
}
