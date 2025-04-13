import 'tsconfig-paths/register'
import Koa from 'koa'
import dotenvFlow from 'dotenv-flow'
import { registerApp } from './core/create-app'

const app = new Koa()
dotenvFlow.config()

async function run() {
    await registerApp(app)

    // @ts-ignore
    app.listen(process.env.PORT, '0.0.0.0', () => {
        console.log(`server is running at http://localhost:${process.env.PORT}`)
    })
}
run()
