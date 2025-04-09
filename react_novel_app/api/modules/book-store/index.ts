import request from '@/api/request'
import { IBaseType } from '@/api/modules/types'
import { BookCategoryItem, HotRankingItem } from './type'

/**
 * 获取书籍分类列表
 */
export function reqGetBookCategoryList() {
    return request.post<IBaseType<BookCategoryItem[]>>({
        url: '/book-store/categorys'
    })
}

/**
 * 获取本站书籍热榜
 */
export function reqGetBookHotList() {
    return request.post<IBaseType<HotRankingItem[]>>({
        url: '/book-store/hot'
    })
}
