export interface BookshelfItem {
    bookId: number | string
    source: number
    cover: string
    author: string
    bookName: string
    lastReadChapter: number
    lastReadChapterProgress: number
    totalChapterCount: number
}

export interface CurrentReadChapterInfo {
    bID: number | string
    cSN: number
    source: number
    readProgress: number
}
