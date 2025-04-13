import { useTheme } from '@/hooks/useTheme'
import { SearchHistoryPanelStyles } from './search.style'
import { Text, View } from 'react-native'

interface SearchHistoryPanelProps {
    historys: string[]
    // 选中历史搜索词
    onSelect: (keyword: string) => void
    // 删除历史搜索词
    onDelete: (index: number) => void
    // 清空历史搜索词
    onClear: () => void
}
// 搜索历史面板
export default function SearchHistoryPanel(props: SearchHistoryPanelProps) {
    const { theme } = useTheme()

    const styles = SearchHistoryPanelStyles(theme)

    return (
        <>
            <View style={styles.searchHistoryPanel}>
                <View style={styles.head}>
                    <Text style={styles.headLeft}>搜索历史</Text>
                    <Text style={styles.headRight}>清空</Text>
                </View>
                <View style={styles.content}>
                    {props.historys.map((item, index) => {
                        return (
                            <Text
                                style={styles.item}
                                key={index}
                            >
                                {item}
                            </Text>
                        )
                    })}
                </View>
            </View>
        </>
    )
}
