import { ChapterItem } from '@/api/modules/book/type'
import { useTheme } from '@/hooks/useTheme'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import { useEffect, useRef, useState } from 'react'
import { Animated, FlatList, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { chapterListStyles } from './chapter-list.style'

interface ChapterListProps {
    isVisible: boolean
    chaperList: ChapterItem[]
    closeChapterList: () => void
    clickChapter?: (csn: number) => void
    activeIndex?: number
}

export default function ChapterList(props: ChapterListProps) {
    const { theme } = useTheme()
    const styles = chapterListStyles(theme)

    const offsetWidth = useWindowDimensions().width + 30

    const translateX = useRef(new Animated.Value(offsetWidth)).current

    useEffect(() => {
        if (props.isVisible) {
            Animated.timing(translateX, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(translateX, {
                toValue: offsetWidth,
                duration: 300,
                useNativeDriver: true
            }).start()
        }
    }, [props.isVisible])

    const [searchText, setSearchText] = useState('')
    const [filterChapterList, setFilterChapterList] = useState<ChapterItem[]>([])

    useEffect(() => {
        if (searchText) {
            const filterList = props.chaperList.filter(item => {
                return item.chapterName.includes(searchText)
            })
            setFilterChapterList(filterList)
        } else {
            setFilterChapterList(props.chaperList)
        }
    }, [props.chaperList, searchText])

    const renderItem = ({ item, index }: { item: ChapterItem; index: number }) => {
        return (
            <TouchableOpacity
                style={[styles.chapterItem, index === props.activeIndex && styles.chapterItemActive]}
                onPress={() => props.clickChapter && props.clickChapter(index)}
            >
                <Text style={styles.chapterItemText}>{item.chapterName}</Text>
                {index === props.activeIndex && (
                    <Feather
                        name='check'
                        size={RFValue(18)}
                        color={theme.textSecondaryColor}
                    />
                )}
            </TouchableOpacity>
        )
    }

    return (
        <Animated.View
            style={[
                styles.readChapterListWrap,
                {
                    transform: [{ translateX }]
                }
            ]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={props.closeChapterList}>
                    <AntDesign
                        name='arrowleft'
                        size={RFValue(24)}
                        color={theme.textPrimaryColor}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>目录</Text>
                <TouchableOpacity>
                    <Feather
                        name='search'
                        size={RFValue(24)}
                        color={theme.textPrimaryColor}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <FlatList
                    data={filterChapterList}
                    keyExtractor={item => item.chapterId as string}
                    renderItem={renderItem}
                />
            </View>
        </Animated.View>
    )
}
