import {
    getBooksByCategoryController,
    getBookStoreCategorysController
} from '@/app/controllers/frontend/book-store.controller'
import Router from 'koa-router'
const router = new Router({ prefix: '/book-store' })

// 获取分类
router.post('/categorys', getBookStoreCategorysController)

// 根据分类获取书籍
router.post('/books-by-category', getBooksByCategoryController)

export default router
