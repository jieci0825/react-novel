import { addMainBookRecommendController } from '@/app/controllers/backend/book-recommend.controller'
import Router from 'koa-router'
const router = new Router({ prefix: '/book-recommend' })

// 添加站主推荐书籍
router.post('/add', addMainBookRecommendController)

export default router
