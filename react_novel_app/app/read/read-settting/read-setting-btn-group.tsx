import { useTheme } from '@/hooks/useTheme'
import { readSettingBtnGroupStyles } from '@/styles/pages/read.styles'
import { Text, TouchableOpacity, View } from 'react-native'

interface ReadSettingBtnGroupProps {
    activeIndex: number
    onClick?: (index: number) => void
}
export default function ReadSettingBtnGroup({ activeIndex, onClick }: ReadSettingBtnGroupProps) {
    const { theme } = useTheme()
    const styles = readSettingBtnGroupStyles(theme)

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        onClick && onClick(0)
                    }}
                    style={[styles.btn, activeIndex === 0 && { backgroundColor: theme.bgColor }]}
                >
                    <Text style={styles.btnText}>排版</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        onClick && onClick(1)
                    }}
                    style={[styles.btn, activeIndex === 1 && { backgroundColor: theme.bgColor }]}
                >
                    <Text style={styles.btnText}>边距</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}
