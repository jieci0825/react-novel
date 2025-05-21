import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'

import AsyncStorage from 'expo-sqlite/kv-store'

export async function addDummyData(db: ExpoSQLiteDatabase) {
    return

    const value = AsyncStorage.getItemSync('dbInitialized')
    if (value) return console.log('--假数据已初始化')

    AsyncStorage.setItemSync('dbInitialized', 'true')
}
