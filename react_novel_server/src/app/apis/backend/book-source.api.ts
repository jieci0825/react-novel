import { addBookSourceController } from '@/app/controllers/backend/book-source.controller'
import Router from 'koa-router'

const router = new Router({ prefix: '/book-source' })

// 添加书源
router.post('/add', addBookSourceController)

export default router
