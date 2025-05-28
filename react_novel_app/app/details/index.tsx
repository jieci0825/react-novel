import PageHeader from '@/components/page-header/page-header'
import { useTheme } from '@/hooks/useTheme'
import { detailsStyles } from '@/styles/pages/details.style'
import { RelativePathString, router, useLocalSearchParams } from 'expo-router'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { RFValue } from 'react-native-responsive-fontsize'
import BookInfo from './book-info'
import { useEffect, useState } from 'react'
import { bookApi } from '@/api'
import { GetBookDetailsData } from '@/api/modules/book/type'
import BookChapter from './book-chapter'
import DetailsFooter from './details-footer'
import ChapterList from '@/components/chapter-list/chapter-list'
import { LocalCache } from '@/utils'
import { CURRENT_SOURCE } from '@/constants'
import { useSQLiteContext } from 'expo-sqlite'
import * as schema from '@/db/schema'
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { and, eq } from 'drizzle-orm'

export default function DetailsPage() {
    const { theme } = useTheme()
    const styles = detailsStyles(theme)

    const db = useSQLiteContext()
    const drizzleDB = drizzle(db, { schema })

    const params = useLocalSearchParams()
    // 书籍详情
    const [details, setDetails] = useState<GetBookDetailsData | null>(null)

    // 本书籍是否存在于书架中
    const [isExistBookShelf, setIsExistBookShelf] = useState(false)

    async function init() {
        try {
            const s = await LocalCache.getData(CURRENT_SOURCE)
            // 获取书籍详情
            const { data } = await bookApi.reqGetBookDetails({
                bookId: params.bid as string,
                _source: s
            })
            setDetails(data)
            // 检查书籍是否存在于书架中
            const result = await drizzleDB
                .select()
                .from(schema.books)
                .where(
                    and(
                        eq(schema.books.book_name, data.title),
                        eq(schema.books.author, data.author),
                        eq(schema.books.is_bookshelf, true)
                    )
                )

            if (result.length > 0) {
                setIsExistBookShelf(true)
                // 如果存在还需要检测当前发起请求的 bid 是否和记录中存储的 bid 是否一致，不一致则需要切换
                const record = result[0]
                if (params.bid !== record.book_id) {
                    await drizzleDB
                        .update(schema.books)
                        .set({ book_id: params.bid as string })
                        .where(eq(schema.books.id, record.id))
                }
            }
        } catch (error) {}
    }

    useEffect(() => {
        init()
    }, [])

    const toBack = () => {
        const canGoBack = router.canGoBack()
        // 检测是否存在可以返回的页面，不存在则返回发现页
        if (!canGoBack) {
            router.navigate('/discover')
        } else {
            router.back()
        }
    }

    const slots = {
        left: () => (
            <TouchableOpacity onPress={toBack}>
                <AntDesign
                    name='left'
                    size={RFValue(22)}
                    color={theme.primaryColor}
                />
            </TouchableOpacity>
        )
    }

    const toRead = async (cSN?: number) => {
        if (!details) {
            // 没有详情记录则不做后续处理
            // TODO 添加提示
            return
        }

        // 如果有 cSN 则表示打开书籍，需要定位到这个章节，且章节进度为更新为 0
        if (cSN !== undefined) {
            // 从 books 表中，找到当前书籍的记录
            const result = await drizzleDB
                .select()
                .from(schema.books)
                .where(and(eq(schema.books.book_name, details.title), eq(schema.books.author, details.author)))
            // 如果有，更新 books 表中的记录
            if (result.length) {
                await drizzleDB
                    .update(schema.books)
                    .set({
                        // 定位到指定章节
                        last_read_chapter_index: cSN,
                        // 重置章节阅读进度
                        last_read_chapter_page_index: 0
                    })
                    .where(eq(schema.books.id, result[0].id))
            }
        }

        router.push({
            pathname: '/read' as RelativePathString,
            params: {
                bookId: params.bid,
                bookName: details.title,
                author: details.author
            }
        })
    }

    // 添加书籍到书架
    const addBookShelf = async () => {
        if (!details) return

        const bookName = details.title || '[未知]'
        const author = details.author || '[未知]'
        const cover = details.cover || ''

        // 检测书籍是否存在于书架中，如果存在则只更新 is_bookshelf 为 true
        const result = await drizzleDB
            .select()
            .from(schema.books)
            .where(and(eq(schema.books.book_name, bookName), eq(schema.books.author, author)))

        if (result.length) {
            await drizzleDB
                .update(schema.books)
                .set({
                    is_bookshelf: true
                })
                .where(eq(schema.books.id, result[0].id))
        } else {
            const data: schema.AddBooks = {
                book_id: params.bid as string,
                book_name: bookName,
                author,
                cover,
                is_bookshelf: true,
                total_chapter: details?.chapters.length || 0,
                last_read_chapter_page_index: 0,
                last_read_chapter_index: 0,
                last_read_time: new Date()
            }

            // 插入数据到 books 表
            await drizzleDB.insert(schema.books).values(data)
        }

        setIsExistBookShelf(true)
    }

    // 移除书籍
    const delBookShelf = async () => {
        if (!details) return

        // 从 sqlite 中删除这条记录
        await drizzleDB
            .delete(schema.books)
            .where(and(eq(schema.books.book_name, details.title), eq(schema.books.author, details.author)))

        setIsExistBookShelf(false)
    }

    // 目录的显示与隐藏
    const [isChapterListVisible, setIsChapterListVisible] = useState(false)
    const onMoreChapter = () => {
        setIsChapterListVisible(true)
    }

    return (
        <>
            <View style={styles.container}>
                <PageHeader
                    slots={slots}
                    title='书籍详情'
                />
                <View style={styles.main}>
                    <ScrollView style={styles.mainWrap}>
                        {details && <BookInfo item={details} />}
                        {details && (
                            <BookChapter
                                onMoreChapter={onMoreChapter}
                                item={details}
                                onChapterClick={index => {
                                    toRead(index)
                                }}
                            />
                        )}
                    </ScrollView>
                </View>
                <DetailsFooter
                    toRead={() => toRead()}
                    addBookShelf={addBookShelf}
                    delBookShelf={delBookShelf}
                    isExist={isExistBookShelf}
                />
                <ChapterList
                    clickChapter={index => {
                        setIsChapterListVisible(false)
                        toRead(index)
                    }}
                    isVisible={isChapterListVisible}
                    chaperList={details?.chapters || []}
                    closeChapterList={() => setIsChapterListVisible(false)}
                />
            </View>
        </>
    )
}
