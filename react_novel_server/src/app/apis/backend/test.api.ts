import Router from 'koa-router'

const router = new Router()

// 获取书架的书籍
router.get('/book-shelf', async ctx => {
    ctx.body = {
        code: 200,
        data: 100
    }
})

export default router
