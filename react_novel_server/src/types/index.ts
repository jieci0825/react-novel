import { Context, Next } from 'koa'

export type Middleware = (ctx: Context, next: Next) => Promise<void>
