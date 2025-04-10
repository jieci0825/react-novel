import {
    getBooksByCategoryController,
    getBookStoreCategorysController,
    searchBooksController,
    getBooksByHotController,
    getBookStoreFaqController
} from '@/app/controllers/frontend/book-store.controller'
import { verifyBookSource } from '@/middlewares/verifyBookSource'
import Router from 'koa-router'
const router = new Router({ prefix: '/book-store' })

// 获取分类
router.post('/categorys', getBookStoreCategorysController)

// 根据分类获取书籍
router.post('/books-by-category', getBooksByCategoryController)

// 搜索小说
router.post('/search', verifyBookSource(), searchBooksController)

// 获取热度榜
router.post('/hot', getBooksByHotController)

// 获取常见问题
router.post('/faq', getBookStoreFaqController)

export default router
