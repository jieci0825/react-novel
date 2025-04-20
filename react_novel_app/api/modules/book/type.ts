export interface GetBookDetailsParams {
    bookId: string | number
    _source: number
}

export interface ChapterItem {
    contentUrl: string
    chapterName: number | null
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
