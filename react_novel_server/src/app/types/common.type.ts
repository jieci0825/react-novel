export interface Page {
    page: number
    pageSize: number
}

export interface BookBase {
    bookId: string | string
    bookName: string
    bookAuthor: string
    bookCover: string
}

export enum BookRecommendType {
    POST = 'post',
    POST_COMMENT = 'post_comment',
    MAIN = 'main'
}

export const REMOVE_ATTRIBUTES = ['createdAt', 'updatedAt', 'deletedAt']
