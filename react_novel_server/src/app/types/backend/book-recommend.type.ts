import { BookBase } from '../common.type'

export interface AddBookRecommendParams extends BookBase {
    _source: number
    order: number
}
