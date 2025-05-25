export interface BookshelfItem {
    bookId: number | string
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

export interface ReaderSetting {
    fontSize: number // 基础字体大小
    lineHeight: number // 行高
    letterSpacing: number // 字间距
    paragraphSpacing: number // 段间距
    fontFamily: string // 字体
    paddingHorizontal: number // 左右边距
    paddingVertical: number // 上下边距
    backgroundColor: string
    textColor: string
    indent: number
}

export interface UserSetting {
    systemTheme: 'light' | 'dark'
}
