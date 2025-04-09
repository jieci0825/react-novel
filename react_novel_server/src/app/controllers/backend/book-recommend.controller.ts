import { addMainBookRecommendService } from '@/app/services/backend/book-recommend.service'
import { AddBookRecommendParams } from '@/app/types/backend/book-recommend.type'
import { Success } from '@/core/error-type'
import { Context } from 'koa'

// 添加站主推荐书籍
export async function addMainBookRecommendController(ctx: Context) {
    const data: AddBookRecommendParams = ctx.request.body
    await addMainBookRecommendService(data)
    throw new Success('添加成功')
}
