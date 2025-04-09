import { getMainBookRecommendService } from '@/app/services/frontend/book-recommend.service'
import { DataSuccess } from '@/core/error-type'

// 获取站主推荐书籍
export async function getMainBookRecommendController() {
    const result = await getMainBookRecommendService()
    throw new DataSuccess(result)
}
