import { Theme, ThemeProvider, useTheme } from '@/hooks/useTheme'
import '@/global.css'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Stack } from 'expo-router/stack'
import JcToast from '@/components/jc-toast/jc-toast'
import { Suspense, useEffect } from 'react'
import { LocalCache } from '@/utils'
import { CURRENT_SOURCE, READER_SETTING, USER_SETTING } from '@/constants'
import { ActivityIndicator, Platform, Text, View, StatusBar as RNStatusBar } from 'react-native'
import { SQLiteProvider } from 'expo-sqlite'
import migrations from '@/drizzle/migrations'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { initDB } from '@/db/db'
import { StatusBar } from 'expo-status-bar'
import { ReaderSetting, UserSetting } from '@/types'

// 初始化用户设置
async function initUserSetting() {
    const userSetting = await LocalCache.getData(USER_SETTING)
    if (userSetting) return

    const data: UserSetting = {
        systemTheme: 'light'
    }
    await LocalCache.storeData(USER_SETTING, data)
}

// 初始化阅读器设置参数
async function initReaderSetting(theme: Theme) {
    const readerSetting = await LocalCache.getData(READER_SETTING)
    // 存在则不在设置
    if (readerSetting) return

    const data: ReaderSetting = {
        fontSize: 18, // 基础字体大小
        lineHeight: 24, // 行高
        letterSpacing: 1, // 字间距
        paragraphSpacing: 14, // 段间距
        fontFamily: 'Arial', // 字体
        paddingHorizontal: 16, // 左右边距
        paddingVertical: 10, // 上下边距
        backgroundColor: theme.bgColor,
        textColor: theme.textSecondaryColor,
        indent: 2 // 文字缩进
    }

    await LocalCache.storeData(READER_SETTING, data)
}

// 初始化书源
async function initSource() {
    const s = await LocalCache.getData(CURRENT_SOURCE)
    if (s) return
    await LocalCache.storeData(CURRENT_SOURCE, 1)
}

function InnerLayout() {
    const { db, DATABASE_NAME } = initDB()
    const { theme, isDarkMode } = useTheme()

    // * 这些部分在你数据迁移的时候可能会很有用
    const { success, error } = useMigrations(db, migrations)

    async function init() {
        await initSource()
        await initReaderSetting(theme)
        await initUserSetting()
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

    const statusBarHeight = Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 0 : 0

    return (
        <GluestackUIProvider mode='light'>
            <Suspense fallback={<ActivityIndicator size='large' />}>
                {/* enableChangeListener 数据库更新则更新UI */}
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
