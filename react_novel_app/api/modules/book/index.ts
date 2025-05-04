import request from '@/api/request'
import { IBaseListType, IBaseType } from '@/api/modules/types'
import { ChapterItem, GetBookContentData, GetBookContentParams, GetBookDetailsData, GetBookDetailsParams } from './type'

/**
 * 获取书籍详情
 */
export const reqGetBookDetails = (data: GetBookDetailsParams) => {
    return request.post<IBaseType<GetBookDetailsData>>({ url: '/book/detail', data })
}

/**
 * 获取书籍目录
 */
export const reqGetBookChapters = (data: GetBookDetailsParams) => {
    return request.post<IBaseType<ChapterItem[]>>({ url: '/book/chapter', data })
}

/**
 * 获取正文
 */
export const reqGetBookContent = (data: GetBookContentParams) => {
    return request.post<IBaseType<GetBookContentData>>({ url: '/book/content', data })
}
