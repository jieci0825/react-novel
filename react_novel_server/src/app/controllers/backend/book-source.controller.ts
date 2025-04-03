import { addBookSourceService } from '@/app/services/backend/book-source.service'
import { AddBookSourceData } from '@/app/types/book-source.type'
import { DataSuccess } from '@/core/error-type'
import { Context } from 'koa'

// 添加书源
export async function addBookSourceController(ctx: Context) {
    const data: AddBookSourceData = ctx.request.body
    await addBookSourceService(data)
    throw new DataSuccess('添加成功')
}
