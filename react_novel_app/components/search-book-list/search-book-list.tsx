import { SearchBookItem } from '@/api/modules/book-store/type'
import { useTheme } from '@/hooks/useTheme'
import { searchBookListStyles } from './search-book-list.style'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import ImgPlus from '../img-plus/img-plus'
import TextOverflowHidden from '../text-overflow-hidden/text-overflow-hidden'
import { useEffect, useRef, useState } from 'react'
import SearchEmpty from './search-empty'
import { debounce, DebouncedFunction } from '@/utils'
import { RelativePathString, router } from 'expo-router'

// 搜索结果
interface SearchBookResultProps {
    list: SearchBookItem[]
    loadData?: Function
    isMore: boolean
}
export default function SearchBookList(props: SearchBookResultProps) {
    const debouncedLoadRef = useRef<DebouncedFunction>()

    useEffect(() => {
        if (props.loadData) {
            debouncedLoadRef.current = debounce(props.loadData, 500)
        }
        // 组件卸载时取消防抖
        return () => {
            debouncedLoadRef.current && debouncedLoadRef.current.cancel()
        }
    }, [])

    // 选中的书籍id
    const [selectedId, setSelectedId] = useState<string | number>()

    const { theme } = useTheme()

    const styles = searchBookListStyles(theme)

    const handleSelectBookItem = (bookId: string | number, source: number) => {
        setSelectedId(bookId)
        router.push({
            pathname: '/details' as RelativePathString,
            params: { bid: bookId, source }
        })
    }

    // 搜索结果列表项
    const renderItem = ({ item, index }: { item: SearchBookItem; index: number }) => {
        return (
            <TouchableOpacity
                key={item.bookId}
                onPress={() => handleSelectBookItem(item.bookId, item._source)}
            >
                <View style={styles.searchResultItem}>
                    <ImgPlus
                        src={item.cover}
                        style={styles.cover}
                    />
                    <View style={styles.info}>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={styles.otherInfo}>
                            <Text style={styles.author}>{item.author}</Text>
                            <View style={styles.tags}>
                                {[item.wordCount, item.status].map((tag, idx) => {
                                    return (
                                        <Text
                                            key={idx}
                                            style={styles.tag}
                                        >
                                            {tag}
                                        </Text>
                                    )
                                })}
                            </View>
                            <TextOverflowHidden
                                line={2}
                                fontStyle={styles.desc}
                            >
                                {item.description}
                            </TextOverflowHidden>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const handleEndReached = () => {
        // 一开始数据为空时，或者已经没有更多数据时，不触发加载更多
        if (props.list.length === 0 || !props.isMore) return
        debouncedLoadRef.current && debouncedLoadRef.current()
    }

    return (
        <FlatList
            style={styles.searchResultWrap}
            data={props.list}
            renderItem={renderItem}
            keyExtractor={item => item.bookId as string}
            extraData={selectedId}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
                props.isMore ? (
                    <ActivityIndicator size='small' />
                ) : (
                    <Text
                        style={{
                            color: theme.textTertiaryColor,
                            marginTop: 10,
                            textAlign: 'center'
                        }}
                    >
                        没有更多数据了
                    </Text>
                )
            }
            ListEmptyComponent={SearchEmpty}
        />
    )
}
