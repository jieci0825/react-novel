import { openDatabaseSync } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as schema from './schema'
// 可视化插件
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'

const DATABASE_NAME = 'novel.db'

const expoDb = openDatabaseSync(DATABASE_NAME)
const drizzleDB = drizzle(expoDb, { schema })

export type DrizzleDB = typeof drizzleDB

export function initDB() {
    // 终端按下 shift + m 进入，可视化工具，浏览器查看
    useDrizzleStudio(expoDb)
    return { expoDb, db: drizzleDB, DATABASE_NAME }
}
