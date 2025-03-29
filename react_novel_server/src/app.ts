import 'tsconfig-paths/register'
import Koa from 'koa'
import dotenvFlow from 'dotenv-flow'
import { registerApp } from './core/create-app'

const app = new Koa()
dotenvFlow.config()

async function run() {
    await registerApp(app)

    app.listen(process.env.PORT, () => {
        console.log(`server is running at http://localhost:${process.env.PORT}`)
    })
}
run()
