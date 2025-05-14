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
import { getReadStorage, LocalCache, updateReadStorage } from '@/utils'
import { CURRENT_READ_CHAPTER_KEY } from '@/constants'

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
            const result = await bookshelfStorage.isInBookshelf(bookshelfStorage.genKey(data.title, data.author))
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

    const toRead = async (cSN?: number) => {
        // 如果有 cSN 则表示打开书籍，需要定位到这个章节，且进度为 0
        if (cSN && details) {
            const item = await getReadStorage({
                bookName: details.title,
                author: details.author
            })
            if (item) {
                item.cSN = cSN
                item.readProgress = 0
                updateReadStorage(item)
            }
        }

        router.push({
            pathname: '/read' as RelativePathString,
            params: {
                bookId: params.bid,
                bookName: details?.title,
                author: details?.author
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
                                toRead(index)
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
