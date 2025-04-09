export interface ViewBookDetailParams {
    bookId: number | string
    _source: number
}

export interface GetContentParams extends ViewBookDetailParams {
    chapterId: number | string
}
