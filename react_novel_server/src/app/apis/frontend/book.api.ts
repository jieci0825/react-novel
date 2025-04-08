import {
    viewBookDetailController,
    viewBookChapterController,
    viewBookContentController
} from '@/app/controllers/frontend/book.controller'
import { verifyBookSource } from '@/middlewares/verifyBookSource'
import Router from 'koa-router'
const router = new Router({ prefix: '/book' })

// 获取书籍详情
router.post('/detail', verifyBookSource(), viewBookDetailController)

// 获取小说章节列表
router.post('/chapter', verifyBookSource(), viewBookChapterController)

// 获取小说正文
router.post('/content', verifyBookSource(['content']), viewBookContentController)

export default router
