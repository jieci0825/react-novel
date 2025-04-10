import { addFaqService } from '@/app/services/backend/faq.service'
import { AddFaqParams } from '@/app/types/backend/faq.type'
import { Success } from '@/core/error-type'
import { Context } from 'koa'

// 添加问题
export async function addFaqController(ctx: Context) {
    const data: AddFaqParams = ctx.request.body
    await addFaqService(data)
    throw new Success('添加成功')
}
