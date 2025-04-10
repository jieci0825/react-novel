import FaqModel from '@/app/models/faq.model'
import { AddFaqParams } from '@/app/types/backend/faq.type'

// 添加问题
export async function addFaqService(data: AddFaqParams) {
    const insertData = {
        sn: data.sn,
        question: data.question,
        answer: data.answer
    }

    await FaqModel.create(insertData)
}
