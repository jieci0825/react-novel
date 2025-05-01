import PageHeader from '@/components/page-header/page-header'
import { useTheme } from '@/hooks/useTheme'
import { detailsStyles } from '@/styles/pages/details.style'
import { RelativePathString, router, useLocalSearchParams } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { RFValue } from 'react-native-responsive-fontsize'
import BookInfo from './book-info'
import { useEffect, useState } from 'react'
import { bookApi } from '@/api'
import { GetBookDetailsData } from '@/api/modules/book/type'
import BookChapter from './book-chapter'
import DetailsFooter from './details-footer'
import ChapterList from '@/components/chapter-list/chapter-list'
import { BookshelfItem } from '@/types'
import bookshelfStorage from '@/utils/bookshelf.storage'

export default function DetailsPage() {
    const { theme } = useTheme()
    const styles = detailsStyles(theme)

    const params = useLocalSearchParams()
    // 书籍详情
    const [details, setDetails] = useState<GetBookDetailsData | null>(null)

    // 本书籍是否存在于书架中
    const [isExistBookShelf, setIsExistBookShelf] = useState(false)

    async function init() {
        try {
            // 获取书籍详情
            const { data } = await bookApi.reqGetBookDetails({
                bookId: params.bid as string,
                _source: +params.source
            })
            setDetails(data)
            // 检查书籍是否存在于书架中
            const result = await bookshelfStorage.isInBookshelf(
                bookshelfStorage.genKey(data.bookId, data._source, data.title, data.author)
            )
            setIsExistBookShelf(result)
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

    // 如果存在于书架中，则获取该书籍阅读进度
    async function getBookItem() {
        // 没有指定章节，则检测是否存在于书架中
        if (isExistBookShelf && details) {
            // 如果存在于书架中，则将其上次阅读的章节作为默认章节
            const item = await bookshelfStorage.getBookshelfItem(
                bookshelfStorage.genKey(details.bookId, details._source, details.title, details.author)
            )
            return item
        } else {
            return null
        }
    }

    const toRead = async (cSN?: number) => {
        const item = await getBookItem()

        let c_sn = 1
        let readProgress = 0
        if (cSN) {
            // 指定了章节的话，则默认都从 0 开始
            c_sn = cSN
            // 检测指定章节是否与上次阅读章节一致，一致则使用上次阅读进度
            if (item && item.lastReadChapter === cSN) {
                readProgress = item.lastReadChapterProgress
            }
        } else {
            // 如果存在于书架中，则将其上次阅读的章节作为默认章节
            if (item) {
                c_sn = item.lastReadChapter
                readProgress = item.lastReadChapterProgress
            }
            // 如果不存在于书架中且没指定章节，则默认从第一章开始，进度也是 0
        }

        router.push({
            pathname: '/read' as RelativePathString,
            params: {
                bid: params.bid,
                source: params.source,
                c_sn,
                read_progress: readProgress
            }
        })
    }

    // 这里只会首次添加书籍到书架才会触发
    const addBookShelf = async () => {
        const bookName = details?.title || '[未知]'
        const author = details?.author || '[未知]'

        const data: BookshelfItem = {
            bookId: params.bid as string,
            source: +params.source,
            bookName,
            author,
            cover: details?.cover || '',
            lastReadChapter: 1,
            lastReadChapterProgress: 0,
            totalChapterCount: details?.chapters.length || 0
        }

        await bookshelfStorage.addToBookshelf(data)

        setIsExistBookShelf(true)
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
                    {details && <BookInfo item={details} />}
                    {details && (
                        <BookChapter
                            onMoreChapter={onMoreChapter}
                            item={details}
                            onChapterClick={index => {
                                toRead(index + 1)
                            }}
                        />
                    )}
                </View>
                <DetailsFooter
                    toRead={toRead}
                    addBookShelf={addBookShelf}
                    isExist={isExistBookShelf}
                />
                <ChapterList
                    clickChapter={index => {
                        setIsChapterListVisible(false)
                        toRead(index + 1)
                    }}
                    isVisible={isChapterListVisible}
                    chaperList={details?.chapters || []}
                    closeChapterList={() => setIsChapterListVisible(false)}
                />
            </View>
        </>
    )
}
