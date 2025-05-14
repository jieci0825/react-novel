export interface BookshelfItem {
    bookId: number | string
    source: number
    cover: string
    author: string
    bookName: string
    lastReadChapter: number
    totalChapterCount: number
}

export interface CurrentReadChapterInfo {
    bID: number | string
    cSN: number // 章节列表索引
    source: number
    readProgress: number // 即分页之后的页码值
    author: string
    bookName: string
}
