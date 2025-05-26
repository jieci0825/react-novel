import { useTheme } from '@/hooks/useTheme'
import { readContentFooterStyles } from '@/styles/pages/read.styles'
import { DarkTheme } from '@/styles/variable'
import { ReaderSetting } from '@/types'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

interface ReadContentFooterProps {
    chapterName: string
    currentPage: number
    totalPage: number
    readSetting: ReaderSetting
}

export default function ReadContentFooter(props: ReadContentFooterProps) {
    const { theme, isDarkMode } = useTheme()

    const styles = readContentFooterStyles(theme)

    const [bgColor, setBgColor] = useState<string>(isDarkMode ? DarkTheme.bgColor : props.readSetting.backgroundColor)

    useEffect(() => {
        if (!isDarkMode) {
            if (props.readSetting.backgroundColor !== bgColor) {
                // 设置背景色
                setBgColor(props.readSetting.backgroundColor)
            }
        } else {
            setBgColor(DarkTheme.bgColor)
        }
    }, [props.readSetting, isDarkMode])

    return (
        <>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: bgColor
                    }
                ]}
            >
                <Text
                    style={[
                        styles.text,
                        {
                            color: isDarkMode ? DarkTheme.textSecondaryColor : props.readSetting.textColor
                        }
                    ]}
                >
                    {props.chapterName}
                </Text>
                <Text
                    style={[
                        styles.text,
                        {
                            marginLeft: 'auto',
                            color: isDarkMode ? DarkTheme.textSecondaryColor : props.readSetting.textColor
                        }
                    ]}
                >
                    {props.currentPage}/{props.totalPage}
                </Text>
            </View>
        </>
    )
}
