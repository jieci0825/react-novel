import { getBooksByCategoryService, getBookStoreCategorysService } from '@/app/services/frontend/book-store.service'
import { GetBookParams, SearchBookParams } from '@/app/types/book-store.type'
import BookSourceMap from '@/book-source'
import { DataSuccess, NotFound } from '@/core/error-type'
import { Context } from 'koa'

// 获取分类
export async function getBookStoreCategorysController(ctx: Context) {
    const result = await getBookStoreCategorysService()
    throw new DataSuccess(result)
}

// 根据分类获取书籍
export async function getBooksByCategoryController(ctx: Context) {
    const data: GetBookParams = ctx.request.body
    const result = await getBooksByCategoryService(data)
    throw new DataSuccess(result)
}

// 根据关键词搜索书籍
export async function searchBooksController(ctx: Context) {
    const data: SearchBookParams = ctx.request.body
    if (!BookSourceMap[data._source]) {
        throw new NotFound('不存在的书源')
    }
    const result = await BookSourceMap[data._source].search(data)
    throw new DataSuccess(result)
}
