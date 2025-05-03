import { addBookAccessCountService } from '@/app/services/frontend/book-access.service'
import { GetContentParams, ViewBookDetailParams } from '@/app/types/backend/book.type'
import BookSourceMap from '@/book-source'
import { DataSuccess } from '@/core/error-type'
import { Context } from 'koa'

// 获取小说详情
export async function viewBookDetailController(ctx: Context) {
    const data: ViewBookDetailParams = ctx.request.body
    const result = await BookSourceMap[data._source].detail(data.bookId)
    // 需要增加访问量
    if (result.title && result.author) {
        await addBookAccessCountService({ bookName: result.title, bookAuthor: result.author })
    }
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
    const result = await BookSourceMap[data._source].content!({
        bookId: data.bookId,
        chapterId: data.chapterId
    })
    throw new DataSuccess(result)
}
