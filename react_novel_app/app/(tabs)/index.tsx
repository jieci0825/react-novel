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
import React, { useEffect, useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import PageHeader from '@/components/page-header/page-header'
import { BookshelfItem } from '@/types'
import bookshelfStorage from '@/utils/bookshelf.storage'
import ImgPlus from '@/components/img-plus/img-plus'
import { useNavigation } from 'expo-router'

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

    const switchBookLayout = (layout: BookLayout) => {
        props.setBookLayout(layout)
    }

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
                <TouchableOpacity
                    onPress={() => {
                        switchBookLayout(BookLayout.Grid)
                    }}
                >
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
                <TouchableOpacity
                    onPress={() => {
                        switchBookLayout(BookLayout.List)
                    }}
                >
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
    bookList: BookshelfItem[]
}
function BookGridLayout(props: BookLayoutProps) {
    const { theme } = useTheme()

    const styles = bookGridStyles(theme)

    // 动态计算宽度，保证间隔是 20
    const [itemWidth, setItemWidth] = useState<number | string>('30%')
    const [itemHeight, setItemHeight] = useState<number | string>(0)

    // 监听屏幕宽度
    const { width: screenWidth } = useWindowDimensions()

    // 屏幕宽度超出 500 时候，每多100距离，就多一列
    const baseColumns = 3
    const baseWidth = 500
    // 计算列数
    const columns = screenWidth < baseWidth ? baseColumns : Math.floor((screenWidth - baseWidth) / 100) + baseColumns

    // 因为不支持 grid 布局，所以需要手动分配成一个二维数组，每一项排列三个
    function chunkArray(array: BookshelfItem[], chunkSize: number = columns) {
        const result = []
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize))
        }
        return result
    }

    const bookList = chunkArray(props.bookList)

    function calcWidthAndHeight() {
        // 计算书籍间隔需要减去的宽度： (columns - 1) * 20 即展示的列数 - 1 * 每列间隔 20、因为间隔的数量比列数少 1
        // 最后减去 40 表示容器的左右内边距
        const iw = (screenWidth - 20 * (columns - 1) - 40) / columns
        setItemWidth(iw)
        const ih = iw * 2
        setItemHeight(ih)
    }

    useEffect(() => {
        calcWidthAndHeight()
    }, [screenWidth])

    return (
        <View style={{ width: '100%' }}>
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
                                    style={[styles.BookshelfItem, { width: itemWidth, height: itemHeight }]}
                                    key={book.bookId}
                                >
                                    <View style={styles.bookCover}>
                                        <ImgPlus src={book.cover} />
                                    </View>
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
                            <View style={styles.bookCover}>
                                <ImgPlus src={book.cover} />
                            </View>
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

    const [bookList, setBookList] = useState<BookshelfItem[]>([])

    async function init() {
        const resp = await bookshelfStorage.getBookshelfList()
        setBookList(resp)
    }

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            init()
        })
        return unsubscribe
    }, [])

    const layoutComp: Record<BookLayout, React.ReactNode> = {
        [BookLayout.Grid]: BookGridLayout({ bookList: bookList }),
        [BookLayout.List]: BookListLayout({ bookList: bookList })
    }

    return (
        <>
            <SafeAreaView style={styles.homeContent}>
                <ScrollView style={styles.homeContentInner}>
                    {bookList.length ? (
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

    const [bookLayout, setBookLayout] = useState<BookLayout>(BookLayout.List)

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
