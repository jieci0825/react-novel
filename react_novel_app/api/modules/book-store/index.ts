import request from '@/api/request'
import { IBaseType } from '@/api/modules/types'
import { BookCategoryItem, FAQItem, HotRankingItem, SearchBookData, SearchByKeywordParams } from './type'

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

/**
 * 获取书籍常见问题
 */
export function reqGetBookFAQ() {
    return request.post<IBaseType<FAQItem[]>>({
        url: '/book-store/faq'
    })
}

/**
 * 根据关键词搜索书籍
 */
export function reqSearchBookByKeyword(data: SearchByKeywordParams) {
    return request.post<IBaseType<SearchBookData>>({
        url: '/book-store/search',
        data
    })
}
