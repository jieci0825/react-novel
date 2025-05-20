import { ThemeProvider } from '@/hooks/useTheme'
import '@/global.css'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Stack } from 'expo-router/stack'
import JcToast from '@/components/jc-toast/jc-toast'
import { useEffect } from 'react'
import { LocalCache } from '@/utils'
import { CURRENT_SOURCE } from '@/constants'
import { runDB } from '@/db'

export default function Layout() {
    async function init() {
        await runDB()

        const s = await LocalCache.getData(CURRENT_SOURCE)
        if (!s) {
            await LocalCache.storeData(CURRENT_SOURCE, 1)
        }
    }

    // 检测当前是本地是否存在书源记录，如果不存在则默认使用书源1
    useEffect(() => {
        init()
    }, [])

    return (
        <GluestackUIProvider mode='light'>
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
        </GluestackUIProvider>
    )
}
