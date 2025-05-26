import { USER_SETTING } from '@/constants'
import { LightTheme, DarkTheme } from '@/styles/variable'
import { UserSetting } from '@/types'
import { LocalCache } from '@/utils'
import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = typeof LightTheme

interface ThemeContextType {
    theme: Theme
    toggleTheme: (cb?: () => void) => void
    isDarkMode: boolean
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType>({
    theme: LightTheme,
    toggleTheme: () => {},
    isDarkMode: false
})

interface ThemeProviderProps {
    children: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [isDarkMode, setIsDarkMode] = useState(false)

    const toggleTheme = (cb?: () => void) => {
        cb && cb()

        setIsDarkMode(!isDarkMode)
    }

    useEffect(() => {
        const load = async () => {
            const userSetting: UserSetting = await LocalCache.getData(USER_SETTING)
            if (userSetting) {
                setIsDarkMode(!!(userSetting.systemTheme === 'dark'))
            }
        }
        load()
    }, [])

    const theme: Theme = isDarkMode ? DarkTheme : LightTheme

    return <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
