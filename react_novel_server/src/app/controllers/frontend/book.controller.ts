import { viewBookDetailService, viewBookChapterService } from '@/app/services/frontend/book.service'
import { ViewBookDetailParams } from '@/app/types/book.type'
import { DataSuccess } from '@/core/error-type'
import { Context } from 'koa'

export async function viewBookDetailController(ctx: Context) {
    const data: ViewBookDetailParams = ctx.request.body
    const result = await viewBookDetailService(data)
    throw new DataSuccess(result)
}

export async function viewBookChapterController(ctx: Context) {
    const data: ViewBookDetailParams = ctx.request.body
    const result = await viewBookChapterService(data)
    throw new DataSuccess(result)
}
