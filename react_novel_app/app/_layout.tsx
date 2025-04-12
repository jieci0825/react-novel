import { ThemeProvider } from '@/hooks/useTheme'
import '@/global.css'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { Stack } from 'expo-router/stack'

export default function Layout() {
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
                </Stack>
            </ThemeProvider>
        </GluestackUIProvider>
    )
}
