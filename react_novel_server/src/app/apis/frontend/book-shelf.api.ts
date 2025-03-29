import Router from 'koa-router'

const router = new Router()

// 获取书架的书籍
router.get('/book-shelf', async ctx => {
    ctx.body = {
        code: 200,
        data: [
            {
                id: 1,
                name: '斗破苍穹',
                author: '天蚕土豆',
                cover: 'https://img3.doubanio.com/view/subject/l/public/s33784597.jpg' // 封面图片
            },
            {
                id: 2,
                name: '书名2',
                author: '作者2',
                cover: 'https://img3.doubanio.com/view/subject/l/public/s33784597.jpg' // 封面图片
            }
        ]
    }
})

export default router
