import request from '@/api/request'
import { IBaseType } from '@/api/modules/types'
import { BookRecommendItem } from './type'

/**
 * 获取站主推荐书籍
 */
export function reqGetMainBookRecommendList() {
    return request.post<IBaseType<BookRecommendItem[]>>({
        url: '/book-recommend/list'
    })
}
