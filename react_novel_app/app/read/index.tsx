import { useTheme } from '@/hooks/useTheme'
import { readStyles } from '@/styles/pages/read.styles'
import { Button, View } from 'react-native'
import ReadHeader from './read-header'
import { useEffect, useState } from 'react'
import ReadFooter from './read-footer'
import { bookApi } from '@/api'
import { useLocalSearchParams } from 'expo-router'
import { ChapterItem, GetBookDetailsData } from '@/api/modules/book/type'
import ChapterList from '@/components/chapter-list/chapter-list'
import { CurrentReadChapterInfo } from '@/types'
import { LocalCache } from '@/utils'
import { CURRENT_READ_CHAPTER_KEY } from '@/constants'

export default function ReadPage() {
    const { theme } = useTheme()
    const styles = readStyles(theme)

    // 控制上下菜单的显示与隐藏
    const [isVisible, setIsVisible] = useState(false)

    // 当前章节进度
    const [curChapterProgress, setCurChapterProgress] = useState(0)

    // 目录的显示与隐藏
    const [isChapterListVisible, setIsChapterListVisible] = useState(false)
    // 显示目录列表-隐藏上下菜单
    const showChapterList = () => {
        setIsChapterListVisible(true)
        setIsVisible(false)
    }

    // 当前阅读章节
    const [curChapter, setCurChapter] = useState<CurrentReadChapterInfo | null>(null)

    // 书籍详情
    const [bookDetails, setBookDetails] = useState<GetBookDetailsData>()

    // 章节列表
    const [chapterList, setChapterList] = useState<ChapterItem[]>([])

    async function init() {
        const currentReadChapter: CurrentReadChapterInfo = await LocalCache.getData(CURRENT_READ_CHAPTER_KEY)
        if (currentReadChapter) {
            setCurChapter(currentReadChapter)
            try {
                // 获取章节详情
                const bookResp = await bookApi.reqGetBookDetails({
                    bookId: curChapter!.bID as string,
                    _source: curChapter!.source
                })
                setChapterList(bookResp.data.chapters)
                setBookDetails(bookResp.data)
            } catch (error) {}
        } else {
            return
        }
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <>
            <View style={[styles.container]}>
                {bookDetails && (
                    <ReadHeader
                        chapterName={chapterList[0].chapterName}
                        bookName={bookDetails.title}
                        isVisible={isVisible}
                    />
                )}
                <View
                    style={{
                        marginTop: 200
                    }}
                >
                    <Button
                        onPress={() => setIsVisible(!isVisible)}
                        title='切换'
                    ></Button>
                </View>
                <ReadFooter
                    isVisible={isVisible}
                    showChapterList={showChapterList}
                />
                <ChapterList
                    isVisible={isChapterListVisible}
                    chaperList={chapterList}
                    closeChapterList={() => setIsChapterListVisible(false)}
                />
            </View>
        </>
    )
}
