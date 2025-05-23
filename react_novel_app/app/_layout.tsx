import { ThemeProvider, useTheme } from '@/hooks/useTheme'
import '@/global.css'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Stack } from 'expo-router/stack'
import JcToast from '@/components/jc-toast/jc-toast'
import { Suspense, useEffect } from 'react'
import { LocalCache } from '@/utils'
import { CURRENT_SOURCE } from '@/constants'
import { ActivityIndicator, Platform, Text, View, StatusBar as RNStatusBar } from 'react-native'
import { SQLiteProvider } from 'expo-sqlite'
import migrations from '@/drizzle/migrations'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { initDB } from '@/db/db'
import { StatusBar } from 'expo-status-bar'

function InnerLayout() {
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
    useEffect(() => {}, [success])

    if (error) {
        console.log('error', error.message)
        return (
            <View>
                <Text>Migration error: {error.message}</Text>
            </View>
        )
    }

    const { theme, isDarkMode } = useTheme()

    const statusBarHeight = Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : 0

    return (
        <GluestackUIProvider mode='light'>
            <Suspense fallback={<ActivityIndicator size='large' />}>
                {/* enableChangeListener 数据库更新更新UI */}
                <SQLiteProvider
                    databaseName={DATABASE_NAME}
                    options={{ enableChangeListener: true }}
                    useSuspense
                >
                    <View style={{ flex: 1, paddingTop: statusBarHeight, backgroundColor: theme.bgColor }}>
                        <StatusBar
                            style={isDarkMode ? 'light' : 'dark'}
                            translucent={true}
                        />
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
                    </View>
                    <JcToast />
                </SQLiteProvider>
            </Suspense>
        </GluestackUIProvider>
    )
}

export default function Layout() {
    return (
        <ThemeProvider>
            <InnerLayout />
        </ThemeProvider>
    )
}
