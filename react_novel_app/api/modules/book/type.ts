export interface GetBookDetailsParams {
    bookId: string | number
    _source: number
}

export interface ChapterItem {
    contentUrl?: string
    chapterName: string
    chapterId: string | number
    _source: number
}

export interface GetBookDetailsData {
    title: string
    author: string
    description: string
    cover: string
    wordCount: string
    status: string
    _source: number
    chapterCount: number
    bookId: string | number
    chapters: ChapterItem[]
}

export interface GetBookContentParams {
    bookId: string | number
    chapterId: number | string
    _source: number
}
