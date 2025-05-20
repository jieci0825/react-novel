import { initializeDB } from './database'

export async function runDB() {
    try {
        const dbName = 'novel.db'
        const db = await initializeDB(dbName)
        console.log(`sqlite 初始化 ${dbName} 成功`)
        return db
    } catch (error) {
        console.error('sqlite 初始化失败')
        throw error
    }
}
