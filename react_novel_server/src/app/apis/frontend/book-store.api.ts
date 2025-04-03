import { getBookStoreCategorysController } from '@/app/controllers/frontend/book-store.controller'
import Router from 'koa-router'
const router = new Router({ prefix: '/book-store' })

// 获取分类
router.post('/categorys', getBookStoreCategorysController)

export default router
