import { useTheme } from '@/hooks/useTheme'
import { detailsFooterStyles } from '@/styles/pages/details.style'
import { Text, View } from 'react-native'

interface DetailsFooterProps {
    addBookShelf: Function
    toRead: Function
}

export default function DetailsFooter(props: DetailsFooterProps) {
    const { theme } = useTheme()
    const styles = detailsFooterStyles(theme)

    return (
        <View style={styles.detailsFooterWrap}>
            <View style={[styles.detailsFooterBtn]}>
                <Text style={styles.leftText}>放入书架</Text>
            </View>
            <View style={[styles.detailsFooterBtn, styles.right]}>
                <Text style={styles.rightText}>开始阅读</Text>
            </View>
        </View>
    )
}
