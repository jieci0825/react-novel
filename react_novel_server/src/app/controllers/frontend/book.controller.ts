import { viewBookDetailService, viewBookChapterService } from '@/app/services/frontend/book.service'
import { GetContentParams, ViewBookDetailParams } from '@/app/types/book.type'
import BookSourceMap from '@/book-source'
import { DataSuccess } from '@/core/error-type'
import { Context } from 'koa'

// 获取小说详情
export async function viewBookDetailController(ctx: Context) {
    const data: ViewBookDetailParams = ctx.request.body
    const result = await BookSourceMap[data._source].detail(data.bookId)
    throw new DataSuccess(result)
}

// 获取小说章节
export async function viewBookChapterController(ctx: Context) {
    const data: ViewBookDetailParams = ctx.request.body
    const result = await BookSourceMap[data._source].chapter(data.bookId)
    throw new DataSuccess(result)
}

// 获取小说正文
export async function viewBookContentController(ctx: Context) {
    const data: GetContentParams = ctx.request.body
    console.log('🚢 ~ 当前打印的内容 ~ data:', data)
    const result = await BookSourceMap[data._source].content!(data.bookId, data.chapterId)
    throw new DataSuccess(result)
}
