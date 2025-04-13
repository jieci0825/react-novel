import { useTheme } from '@/hooks/useTheme'
import { SearchHistoryPanelStyles } from '@/styles/pages/search.style'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import AntDesign from '@expo/vector-icons/AntDesign'

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

    // 激活index
    const [activeIndex, setActiveIndex] = useState(-1)

    const handleDelete = () => {
        if (activeIndex !== -1) {
            props.onDelete(activeIndex)
            setActiveIndex(-1)
        }
    }

    return (
        <>
            <View style={styles.searchHistoryPanel}>
                <View style={styles.head}>
                    <Text style={styles.headLeft}>搜索历史</Text>
                    <View style={styles.headRight}>
                        {activeIndex !== -1 ? (
                            <Text
                                onPress={() => setActiveIndex(-1)}
                                style={styles.headRightText}
                            >
                                取消
                            </Text>
                        ) : null}
                        <Text
                            onPress={props.onClear}
                            style={styles.headRightText}
                        >
                            清空
                        </Text>
                    </View>
                </View>
                <View style={styles.content}>
                    {props.historys.map((item, index) => {
                        return (
                            <Pressable
                                onLongPress={() => {
                                    setActiveIndex(index)
                                }}
                                key={index}
                            >
                                <View style={styles.item}>
                                    <Text
                                        onPress={() => props.onSelect(item)}
                                        style={styles.itemText}
                                    >
                                        {item}
                                    </Text>
                                    {activeIndex === index && (
                                        <AntDesign
                                            onPress={handleDelete}
                                            name='close'
                                            size={RFValue(14)}
                                            color={theme.textSecondaryColor}
                                        />
                                    )}
                                </View>
                            </Pressable>
                        )
                    })}
                </View>
            </View>
        </>
    )
}
