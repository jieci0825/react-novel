import {
    getBooksByCategoryController,
    getBookStoreCategorysController,
    searchBooksController
} from '@/app/controllers/frontend/book-store.controller'
import Router from 'koa-router'
const router = new Router({ prefix: '/book-store' })

// 获取分类
router.post('/categorys', getBookStoreCategorysController)

// 根据分类获取书籍
router.post('/books-by-category', getBooksByCategoryController)

// 搜索小说
router.post('/search', searchBooksController)

export default router
