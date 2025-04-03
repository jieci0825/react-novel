import {
    getBooksByCategoryService,
    getBookStoreCategorysService,
    searchBooksService
} from '@/app/services/frontend/book-store.service'
import { GetBookParams, SearchBookParams } from '@/app/types/boo-store.type'
import { DataSuccess } from '@/core/error-type'
import { Context } from 'koa'

export async function getBookStoreCategorysController(ctx: Context) {
    const result = await getBookStoreCategorysService()
    throw new DataSuccess(result)
}

export async function getBooksByCategoryController(ctx: Context) {
    const data: GetBookParams = ctx.request.body
    const result = await getBooksByCategoryService(data)
    throw new DataSuccess(result)
}

export async function searchBooksController(ctx: Context) {
    const data: SearchBookParams = ctx.request.body
    const result = await searchBooksService(data)
    throw new DataSuccess(result)
}
