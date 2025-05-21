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
import { drizzle } from 'drizzle-orm/expo-sqlite'
import migrations from '@/drizzle/migrations'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { addDummyData } from '@/db/add-dummy-data'
// 可视化插件
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'

export const DATABASE_NAME = 'novel.db'

export default function Layout() {
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

    const expoDb = openDatabaseSync(DATABASE_NAME)
    // 终端按下 shift + m 进入，可视化工具，浏览器查看
    useDrizzleStudio(expoDb)

    // * 这些部分在你数据迁移的时候可能会很有用
    const db = drizzle(expoDb)

    const { success, error } = useMigrations(db, migrations)

    if (error) {
        return (
            <View>
                <Text>Migration error: {error.message}</Text>
            </View>
        )
    }

    // 当成功之后，添加一些测试数据
    useEffect(() => {
        console.log('success', success)
        if (success) {
            // 迁移数据库完成之后，添加一些测试数据
            addDummyData(db)
        }
    }, [success])

    return (
        <GluestackUIProvider mode='light'>
            <Suspense fallback={<ActivityIndicator size='large' />}>
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
