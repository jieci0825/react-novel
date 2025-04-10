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
