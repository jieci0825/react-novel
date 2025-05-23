import { LightTheme, DarkTheme } from '@/styles/variable'
import React, { createContext, useContext, useState } from 'react'

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

    const theme: Theme = isDarkMode ? DarkTheme : LightTheme

    return <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
