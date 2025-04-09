import BookRecommendModel from '@/app/models/book-recommend.model'
import { BookRecommendType, REMOVE_ATTRIBUTES } from '@/app/types/common.type'

// 获取站主推荐书籍
export async function getMainBookRecommendService() {
    const result = await BookRecommendModel.findAll({
        where: { recommend_type: BookRecommendType.MAIN },
        order: [['order', 'ASC']],
        attributes: {
            exclude: REMOVE_ATTRIBUTES
        }
    })
    return result
}
