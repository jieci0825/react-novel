import { addBookSourceService, addRequestByBookSourceService } from '@/app/services/backend/book-source.service'
import { DataSuccess } from '@/core/error-type'
import { Context } from 'koa'
import type { AddBookSourceData, AddBookSourceRequest } from '@/app/types/book-source.type'

export async function addBookSourceController(ctx: Context) {
    const data: AddBookSourceData = ctx.request.body
    await addBookSourceService(data)
    throw new DataSuccess('添加成功')
}

export async function addRequestByBookSourceController(ctx: Context) {
    const data: AddBookSourceRequest = ctx.request.body
    await addRequestByBookSourceService(data)
    throw new DataSuccess('添加成功')
}
