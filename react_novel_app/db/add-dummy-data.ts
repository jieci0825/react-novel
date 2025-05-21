import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'

import AsyncStorage from 'expo-sqlite/kv-store'
import { lists, tasks } from './schema'

export async function addDummyData(db: ExpoSQLiteDatabase) {
    const value = AsyncStorage.getItemSync('dbInitialized')
    if (value) return console.log('--假数据已初始化')

    console.log('开始添加假数据')
    await db.insert(lists).values([{ name: '张三' }, { name: '李四' }, { name: '王五' }])

    await db.insert(tasks).values([
        { name: '吃饭-张三', list_id: 1 },
        { name: '睡觉-张三', list_id: 1 },
        { name: '打豆豆-张三', list_id: 1 }
    ])

    await db.insert(tasks).values([
        { name: '吃饭-李四', list_id: 2 },
        { name: '睡觉-李四', list_id: 2 },
        { name: '打豆豆-李四', list_id: 2 }
    ])

    await db.insert(tasks).values([
        { name: '吃饭-王五', list_id: 3 },
        { name: '睡觉-王五', list_id: 3 },
        { name: '打豆豆-王五', list_id: 3 }
    ])

    AsyncStorage.setItemSync('dbInitialized', 'true')
}
