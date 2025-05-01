import { SafeAreaView, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useTheme } from '@/hooks/useTheme'
import {
    bookGridStyles,
    bookListStyles,
    homeContentStyles,
    homeHeaderStyles,
    homeStyles
} from '@/styles/tabs/index.style'
import React, { useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import PageHeader from '@/components/page-header/page-header'
import { BookShelfItem } from '@/types'

enum BookLayout {
    Grid = 1,
    List = 2
}

interface HomeHeaderProps {
    setBookLayout: React.Dispatch<React.SetStateAction<BookLayout>>
    bookLayout: BookLayout
}
function HomeHeader(props: HomeHeaderProps) {
    const { theme } = useTheme()

    const styles = homeHeaderStyles(theme)

    const slots = {
        left: () => (
            <Entypo
                name='menu'
                size={RFValue(30)}
                color={theme.tertiaryColor}
            />
        ),
        right: () => (
            <>
                <TouchableOpacity onPress={() => props.setBookLayout(BookLayout.Grid)}>
                    <View
                        style={[styles.homeIconBox, props.bookLayout === BookLayout.Grid && styles.homeIconBoxActive]}
                    >
                        <MaterialCommunityIcons
                            name='grid-large'
                            size={RFValue(24)}
                            color={props.bookLayout === BookLayout.Grid ? theme.primaryColor : theme.tertiaryColor}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.setBookLayout(BookLayout.List)}>
                    <View
                        style={[styles.homeIconBox, props.bookLayout === BookLayout.List && styles.homeIconBoxActive]}
                    >
                        <FontAwesome5
                            name='list-ul'
                            size={RFValue(24)}
                            color={props.bookLayout === BookLayout.List ? theme.primaryColor : theme.tertiaryColor}
                        />
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    return (
        <PageHeader
            title='我的书架'
            slots={slots}
        />
    )
}

interface BookLayoutProps {
    bookList: BookShelfItem[]
}
function BookGridLayout(props: BookLayoutProps) {
    const { theme } = useTheme()

    const styles = bookGridStyles(theme)

    // 动态计算宽度，保证间隔是 20
    const [itemWidth, setItemWidth] = useState<number | string>('30%')

    // 监听屏幕宽度
    const { width: screenWidth } = useWindowDimensions()

    // 屏幕宽度超出 500 时候，每多100距离，就多一列
    const baseColumns = 3
    const baseWidth = 500
    // 计算列数
    const columns = screenWidth < baseWidth ? baseColumns : Math.floor((screenWidth - baseWidth) / 100) + baseColumns

    // 因为不支持 grid 布局，所以需要手动分配成一个二维数组，每一项排列三个
    function chunkArray(array: BookShelfItem[], chunkSize: number = columns) {
        const result = []
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize))
        }
        return result
    }

    const bookList = chunkArray(props.bookList)

    return (
        <>
            <View
                onLayout={e => {
                    // 宽度表示当前容器的宽度
                    const { width } = e.nativeEvent.layout
                    // 减去间隔，书籍之间的两个 20
                    // 然后剩余的宽度根据列数评分，即列数 - 1
                    const iw = (width - 20 * (columns - 1)) / columns
                    setItemWidth(iw)
                }}
            >
                {bookList.map((item, index) => {
                    return (
                        <View
                            style={[styles.bookRow]}
                            key={index}
                        >
                            {item.map(book => {
                                return (
                                    <View
                                        // @ts-ignore
                                        style={[styles.BookShelfItem, { width: itemWidth }]}
                                        key={book.bookId}
                                    >
                                        <View style={styles.bookCover}></View>
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode='tail'
                                            style={styles.bookTitle}
                                        >
                                            {book.bookName}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode='tail'
                                            style={styles.bookProgress}
                                        >
                                            第{book.lastReadChapter}章/第{book.totalChapterCount}章
                                        </Text>
                                    </View>
                                )
                            })}
                        </View>
                    )
                })}
            </View>
        </>
    )
}

function BookListLayout(props: BookLayoutProps) {
    const { theme } = useTheme()

    const styles = bookListStyles(theme)

    return (
        <>
            <View style={styles.bookListWrap}>
                {props.bookList.map(book => {
                    return (
                        <View
                            style={styles.bookItem}
                            key={book.bookId}
                        >
                            <View style={styles.bookCover}></View>
                            <View style={styles.bookInfo}>
                                <Text style={styles.bookTitle}>{book.bookName}</Text>
                                <Text style={styles.bookAuthor}>{book.author}</Text>
                                <Text style={styles.bookProgress}>第{book.lastReadChapter}章</Text>
                                <Text style={styles.bookProgress}>第{book.totalChapterCount}章</Text>
                            </View>
                        </View>
                    )
                })}
            </View>
        </>
    )
}

interface HomeContentProps {
    bookLayout: BookLayout
}
function HomeContent(props: HomeContentProps) {
    const { theme } = useTheme()

    const styles = homeContentStyles(theme)

    const originBookList: BookShelfItem[] = []

    const layoutComp: Record<BookLayout, React.ReactNode> = {
        [BookLayout.Grid]: BookGridLayout({ bookList: originBookList }),
        [BookLayout.List]: BookListLayout({ bookList: originBookList })
    }

    return (
        <>
            <SafeAreaView style={styles.homeContent}>
                <ScrollView style={styles.homeContentInner}>
                    {originBookList.length ? (
                        layoutComp[props.bookLayout]
                    ) : (
                        <View style={styles.emptyTips}>
                            <Text style={styles.emptyTipsText}>快去挑选你的书籍吧~</Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default function Index() {
    const { theme } = useTheme()

    const styles = homeStyles(theme)

    const [bookLayout, setBookLayout] = useState<BookLayout>(BookLayout.Grid)

    return (
        <>
            <View style={styles.container}>
                <HomeHeader
                    setBookLayout={setBookLayout}
                    bookLayout={bookLayout}
                />
                <HomeContent bookLayout={bookLayout} />
            </View>
        </>
    )
}
