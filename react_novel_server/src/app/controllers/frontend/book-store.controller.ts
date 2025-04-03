import { getBookStoreCategorysService } from '@/app/services/frontend/book-store.service'
import { DataSuccess } from '@/core/error-type'
import { Context } from 'koa'

export async function getBookStoreCategorysController(ctx: Context) {
    const result = await getBookStoreCategorysService()
    throw new DataSuccess(result)
}
