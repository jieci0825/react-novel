export interface BookShelfItem {
    bookId: number | string
    source: number
    cover: string
    author: string
    bookName: string
    lastReadChapter: number
    lastReadChapterProgress: number
    totalChapterCount: number
}
