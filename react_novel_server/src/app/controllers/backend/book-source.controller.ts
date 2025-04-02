import { DataSuccess } from '@/core/error-type'
import { Context } from 'koa'

/**
 * 添加书源
 */
export async function addBookSource(ctx: Context) {
    const data = ctx.request

    throw new DataSuccess('添加成功')
}
