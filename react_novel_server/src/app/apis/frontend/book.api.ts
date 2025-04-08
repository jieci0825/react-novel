import { viewBookDetailController, viewBookChapterController } from '@/app/controllers/frontend/book.controller'
import Router from 'koa-router'
const router = new Router({ prefix: '/book' })

// 获取书籍详情
router.post('/detail', viewBookDetailController)

// 获取小说章节列表
router.post('/chapter', viewBookChapterController)

export default router
