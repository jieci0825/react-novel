import Koa from 'koa'
import koaBody from 'koa-body'
import path from 'node:path'
import fs from 'node:fs'
import { DEVELOPMENT } from '@/constants'
import Router from 'koa-router'
import { handleError } from './handle-error'

// 解析参数
function applyBodyParse(app: Koa) {
    app.use(koaBody())
}

// 处理 cors
function applyCors(app: Koa) {
    app.use(async (ctx, next) => {
        // 开发环境允许所有源，生产环境允许指定源
        const allowedOrigin = process.env.NODE_ENV === DEVELOPMENT ? '*' : process.env.ALLOWED_ORIGIN

        ctx.set('Access-Control-Allow-Origin', allowedOrigin!)
        ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT')
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

        // options 请求直接返回
        if (ctx.method === 'OPTIONS') {
            ctx.status = 204
            return
        }

        await next()
    })
}

// 处理 router
async function applyRouter(app: Koa) {
    const prefixs = ['frontend', 'backend'] as const

    for (const prefix of prefixs) {
        await loadRouter(prefix)
    }

    async function loadRouter(prefix: (typeof prefixs)[number]) {
        const apiRouter = new Router({ prefix: `/api/${prefix}` })

        const routerPath = path.resolve(process.cwd(), `src/app/apis/${prefix}`)
        const files = fs.readdirSync(routerPath)

        for (const file of files) {
            if (file.endsWith('.api.ts')) {
                const { default: router } = await import(path.join(routerPath, file))
                apiRouter.use(router.routes(), router.allowedMethods())
            }
        }

        app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
    }
}

async function createTableModels() {
    const { db } = require('@/core/db')

    const modelsPath = path.resolve(process.cwd(), 'src/app/models')
    const files = fs.readdirSync(modelsPath)

    for (const file of files) {
        if (file.endsWith('.model.ts')) {
            const { default: model } = await import(path.join(modelsPath, file))
            db[model.name] = model
        }
    }

    db.sync({ alter: true })
        .then(() => console.log('同步完成'))
        .catch(console.error)
}

export async function registerApp(app: Koa) {
    app.use(handleError)
    createTableModels()
    applyCors(app)
    await applyRouter(app)
    applyBodyParse(app)
}
