import BookSourceMap, { BookSourceKeys } from '@/book-source'
import { NotFound, ParamsError } from '@/core/error-type'
import { BookSourceImplKey } from '@/types'
import { Context, Middleware } from 'koa'

/**
 * 验证书籍来源
 * @param needMethods 需要校验的方法
 */
export const verifyBookSource = (needMethods: BookSourceImplKey[] = []) => {
    const m: Middleware = async (ctx, next) => {
        const data = ctx.request.body

        // 检测 data 是否存在 _source 属性，不存在则返回错误信息
        if (!Object.prototype.hasOwnProperty.call(data, '_source')) {
            throw new ParamsError('缺少 _source 属性')
        }

        // 检测书源是否存在
        if (!BookSourceKeys.includes(data._source)) {
            throw new NotFound('不存在的书源')
        }

        // 检测当前需要是否具备此方法
        for (const m of needMethods) {
            const fn = BookSourceMap[data._source][m]
            if (!fn) {
                throw new NotFound(`书源${data._source}不存在方法 ${m}`)
            }
        }

        // 验证书籍来源
        await next()
    }

    return m
}
