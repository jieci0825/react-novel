import { viewBookDetailService, viewBookChapterService } from '@/app/services/frontend/book.service'
import { ViewBookDetailParams } from '@/app/types/book.type'
import BookSourceMap from '@/book-source'
import { DataSuccess } from '@/core/error-type'
import { Context } from 'koa'

export async function viewBookDetailController(ctx: Context) {
    const data: ViewBookDetailParams = ctx.request.body
    const result = await BookSourceMap[data._source].detail(data.bookId)
    throw new DataSuccess(result)
}

export async function viewBookChapterController(ctx: Context) {
    const data: ViewBookDetailParams = ctx.request.body
    const result = await BookSourceMap[data._source].chapter(data.bookId)
    throw new DataSuccess(result)
}
