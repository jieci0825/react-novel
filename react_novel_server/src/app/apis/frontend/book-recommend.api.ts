import { getMainBookRecommendController } from '@/app/controllers/frontend/book-recommend.controller'
import Router from 'koa-router'
const router = new Router({ prefix: '/book-recommend' })

// 获取站主推荐书籍
router.post('/list', getMainBookRecommendController)

export default router
