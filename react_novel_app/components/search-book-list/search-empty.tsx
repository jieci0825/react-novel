import { useTheme } from '@/hooks/useTheme'
import { searchEmptyStyles } from './search-book-list.style'
import { Text, View } from 'react-native'

export default function SearchEmpty() {
    const { theme } = useTheme()

    const styles = searchEmptyStyles(theme)

    return (
        <View style={styles.searchEmpty}>
            <Text style={styles.searchEmptyText}>暂无搜索结果</Text>
        </View>
    )
}
