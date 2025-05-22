import { ThemeProvider } from '@/hooks/useTheme'
import '@/global.css'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Stack } from 'expo-router/stack'
import JcToast from '@/components/jc-toast/jc-toast'
import { Suspense, useEffect } from 'react'
import { LocalCache } from '@/utils'
import { CURRENT_SOURCE } from '@/constants'
import { ActivityIndicator, Text, View } from 'react-native'
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite'
import migrations from '@/drizzle/migrations'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { addDummyData } from '@/db/add-dummy-data'
import { initDB } from '@/db/db'
import { drizzle } from 'drizzle-orm/expo-sqlite'
// 可视化插件
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'

const DATABASE_NAME = 'novel.db'

export default function Layout() {
    const { db, DATABASE_NAME } = initDB()

    // * 这些部分在你数据迁移的时候可能会很有用
    const { success, error } = useMigrations(db, migrations)

    async function init() {
        const s = await LocalCache.getData(CURRENT_SOURCE)
        if (!s) {
            await LocalCache.storeData(CURRENT_SOURCE, 1)
        }
    }

    // 检测当前是本地是否存在书源记录，如果不存在则默认使用书源1
    useEffect(() => {
        init()
    }, [])

    // 当成功之后，添加一些测试数据
    useEffect(() => {
        console.log('success', success)
    }, [success])

    if (error) {
        console.log('error', error.message)
        return (
            <View>
                <Text>Migration error: {error.message}</Text>
            </View>
        )
    }

    return (
        <GluestackUIProvider mode='light'>
            <Suspense fallback={<ActivityIndicator size='large' />}>
                {/* enableChangeListener 数据库更新更新UI */}
                <SQLiteProvider
                    databaseName={DATABASE_NAME}
                    options={{ enableChangeListener: true }}
                    useSuspense
                >
                    <ThemeProvider>
                        <Stack>
                            <Stack.Screen
                                name='(tabs)'
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name='search'
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name='details'
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name='read'
                                options={{ headerShown: false }}
                            />
                        </Stack>
                        <JcToast />
                    </ThemeProvider>
                </SQLiteProvider>
            </Suspense>
        </GluestackUIProvider>
    )
}
