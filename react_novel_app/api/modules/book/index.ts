import request from '@/api/request'
import { IBaseType } from '@/api/modules/types'
import { GetBookDetailsData, GetBookDetailsParams } from './type'

/**
 * 获取书籍详情
 */
export const reqGetBookDetails = (data: GetBookDetailsParams) => {
    return request.post<IBaseType<GetBookDetailsData>>({ url: '/book/detail', data })
}
