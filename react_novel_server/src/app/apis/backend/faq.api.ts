import { addFaqController } from '@/app/controllers/backend/faq.controller'
import Router from 'koa-router'

const router = new Router({ prefix: '/faq' })

// 添加问题
router.post('/add', addFaqController)

export default router
