import { getBooksByCategoryService, getBookStoreCategorysService } from '@/app/services/frontend/book-store.service'
import { GetBookParams } from '@/app/types/boo-store.type'
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
