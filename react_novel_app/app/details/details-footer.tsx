import { useTheme } from '@/hooks/useTheme'
import { detailsFooterStyles } from '@/styles/pages/details.style'
import { Text, TouchableOpacity, View } from 'react-native'

interface DetailsFooterProps {
    addBookShelf: Function
    toRead: Function
    isExist: boolean
}

export default function DetailsFooter(props: DetailsFooterProps) {
    const { theme } = useTheme()
    const styles = detailsFooterStyles(theme)

    return (
        <View style={styles.detailsFooterWrap}>
            {/* 不存在书架时才显示放入书架 */}
            {!props.isExist && (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => props.addBookShelf()}
                    style={[styles.detailsFooterBtn]}
                >
                    <Text style={styles.leftText}>放入书架</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.detailsFooterBtn, styles.right]}
                onPress={() => props.toRead()}
            >
                <Text style={styles.rightText}>开始阅读</Text>
            </TouchableOpacity>
        </View>
    )
}
