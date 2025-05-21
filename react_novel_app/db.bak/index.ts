import { initializeDB } from './database'

export * as booksBooksDB from './tables/books.table'

export function runDB() {
    try {
        const dbName = 'novel.db'
        const db = initializeDB(dbName)
        console.log(`sqlite 初始化 ${dbName} 成功`)
        return db
    } catch (error) {
        console.error('sqlite 初始化失败')
        throw error
    }
}
