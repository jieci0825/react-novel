import { Pressable, SafeAreaView, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
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
import React, { useEffect, useRef, useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import PageHeader from '@/components/page-header/page-header'
import { BookshelfItem } from '@/types'
import bookshelfStorage from '@/utils/bookshelf.storage'
import ImgPlus from '@/components/img-plus/img-plus'
import { RelativePathString, router, useNavigation } from 'expo-router'
import { getReadStorage, LocalCache, updateReadStorage } from '@/utils'
import { CURRENT_READ_CHAPTER_KEY } from '@/constants'
import useReactiveState from '@/hooks/useReactiveState'

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
        // 这里点击可以弹出一个才菜单列表
        //  - 导入本地书籍
        //  - 导入云端书架
        //  - ...
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

interface RenderBookshelfItem extends BookshelfItem {
    isActive: boolean
}

interface BookLayoutProps {
    bookList: RenderBookshelfItem[]
    onClick: (book: RenderBookshelfItem) => void
    onLongPress: (book: RenderBookshelfItem) => void
    toggleActive: (index: number, isActive: boolean) => void
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
    function chunkArray(array: RenderBookshelfItem[], chunkSize: number = columns) {
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

    const [isClickRef, setIsClickOut] = useReactiveState(true)

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
                                <Pressable
                                    // @ts-ignore
                                    style={[
                                        styles.bookItem,
                                        { width: itemWidth as number, height: itemHeight as number },
                                        styles.bookItem,
                                        book.isActive && {
                                            backgroundColor: theme.bgSecondaryColor
                                        }
                                    ]}
                                    key={book.bookId}
                                    onPressIn={() => {
                                        // 每次按压一触发，就设置是可以触发 click 事件的
                                        setIsClickOut(true)
                                        props.toggleActive(index, true)
                                    }}
                                    onLongPress={() => {
                                        // 但是一但触发了点击事件，就设置不可以触发 click 事件
                                        setIsClickOut(false)
                                        props.onLongPress(book)
                                    }}
                                    onPressOut={() => {
                                        props.toggleActive(index, false)

                                        // 为 true 才可以触发
                                        if (isClickRef.current) {
                                            props.onClick(book)
                                        }
                                    }}
                                    delayLongPress={500}
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
                                    {/* todo 补全进度 */}
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                        style={styles.bookProgress}
                                    >
                                        第{book.lastReadChapter}章/第{book.totalChapterCount}章
                                    </Text>
                                </Pressable>
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

    const [isClickRef, setIsClickOut] = useReactiveState(true)

    return (
        <View style={styles.bookListWrap}>
            {props.bookList.map((book, index) => {
                return (
                    <Pressable
                        style={[
                            styles.bookItem,
                            book.isActive && {
                                backgroundColor: theme.bgSecondaryColor
                            }
                        ]}
                        key={book.bookId}
                        onPressIn={() => {
                            // 每次按压一触发，就设置是可以触发 click 事件的
                            setIsClickOut(true)
                            props.toggleActive(index, true)
                        }}
                        onLongPress={() => {
                            // 但是一但触发了点击事件，就设置不可以触发 click 事件
                            setIsClickOut(false)
                            props.onLongPress(book)
                        }}
                        onPressOut={() => {
                            props.toggleActive(index, false)

                            // 为 true 才可以触发
                            if (isClickRef.current) {
                                props.onClick(book)
                            }
                        }}
                        delayLongPress={500}
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
                    </Pressable>
                )
            })}
        </View>
    )
}

interface HomeContentProps {
    bookLayout: BookLayout
}
function HomeContent(props: HomeContentProps) {
    const { theme } = useTheme()

    const styles = homeContentStyles(theme)

    const [bookList, setBookList] = useState<RenderBookshelfItem[]>([])

    async function init() {
        const resp = await bookshelfStorage.getBookshelfList()
        const list = resp.map(item => {
            return { ...item, isActive: false }
        })
        setBookList(list)
    }

    const navigation = useNavigation()

    useEffect(() => {
        // TODO 解决从详情页返回不会重新获取导致章节进度没有更新的问题
        const unsubscribe = navigation.addListener('focus', () => {
            init()
        })
        return unsubscribe
    }, [])

    const toRead = async (book: BookshelfItem) => {
        router.push({
            pathname: '/read',
            params: {
                bookId: book.bookId,
                bookName: book.bookName,
                author: book.author
            }
        })
    }

    const toggleBookItemActive = (index: number, isActive: boolean) => {
        const list = [...bookList]
        list[index].isActive = isActive
        setBookList(list)
    }

    const handleBookItemLongPress = (book: RenderBookshelfItem) => {
        // 长按则跳转到详情页面
        router.push({
            pathname: '/details',
            params: { bid: book.bookId }
        })
    }

    const layoutComp: Record<BookLayout, React.ReactNode> = {
        [BookLayout.Grid]: BookGridLayout({
            bookList: bookList,
            onClick: toRead,
            toggleActive: toggleBookItemActive,
            onLongPress: handleBookItemLongPress
        }),
        [BookLayout.List]: BookListLayout({
            bookList: bookList,
            onClick: toRead,
            toggleActive: toggleBookItemActive,
            onLongPress: handleBookItemLongPress
        })
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
