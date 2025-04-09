import { Page } from '../common.type'

export interface GetBookParams extends Page {
    categoryId: number
}

export interface SearchBookParams extends Page {
    keyword: string
    _source: number
}
