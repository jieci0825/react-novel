import Router from 'koa-router'

const router = new Router({ prefix: '/bookshelf' })

// 获取书架的书籍
router.get('/')

export default router
