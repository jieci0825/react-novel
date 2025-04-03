interface ParamsJsonSchema {
    field: string
    dataType: 'number' | 'string' | 'boolean' | 'array' | 'object'
    type: 'header' | 'query' | 'body' | 'path'
    value: any
}

export interface HeaderJsonSchema {
    field: string
    value: string
}

export interface BookSourceDetails {
    paramsJsonSchema: Array<ParamsJsonSchema>
    headerJsonSchema: Array<HeaderJsonSchema>
}

export enum BookSourceEffect {
    /**
     * @name 搜索书籍
     */
    SEARCH_BOOK = 'searchBook',
    /**
     * @name 发现书籍
     */
    FIND_BOOK = 'findBook',
    /**
     * @name 获取书籍详情
     */
    GET_BOOK_DETAIL = 'getBookDetail',
    /**
     * @name 获取书籍目录
     */
    GET_BOOK_CATALOG = 'getBookCatalog',
    /**
     * @name 获取书籍章节内容
     */
    GET_BOOK_CHAPTER_CONTENT = 'getBookChapterContent'
}

export enum BookSourceStatus {
    ENABLE = 100,
    DISABLE = 200,
    UNDONE = 300
}

export interface AddBookSourceData {
    bookSourceName: string
    status: BookSourceStatus
}

export interface AddBookSourceRequest {
    bookSourceId: number
    method: 'get' | 'put' | 'post' | 'delete' | 'patch'
    url: string
    effect: BookSourceEffect
    details: BookSourceDetails
}
