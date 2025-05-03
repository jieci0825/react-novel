import { useTheme } from '@/hooks/useTheme'
import { readStyles } from '@/styles/pages/read.styles'
import { Button, TouchableOpacity, View } from 'react-native'
import ReadHeader from './read-header'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReadFooter from './read-footer'
import { bookApi } from '@/api'
import { useLocalSearchParams } from 'expo-router'
import { ChapterItem, GetBookDetailsData } from '@/api/modules/book/type'
import ChapterList from '@/components/chapter-list/chapter-list'
import { CurrentReadChapterInfo } from '@/types'
import { LocalCache } from '@/utils'
import { CURRENT_READ_CHAPTER_KEY } from '@/constants'
import { jcShowToast } from '@/components/jc-toast/jc-toast'

export default function ReadPage() {
    const { theme } = useTheme()
    const styles = readStyles(theme)

    // 缓存数量
    const cacheNum = useRef(3).current

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
    const [curReadChapter, setCurReadChapter] = useState<CurrentReadChapterInfo | null>(null)
    // 书籍详情
    const [bookDetails, setBookDetails] = useState<GetBookDetailsData>()
    // 章节列表
    const [chapterList, setChapterList] = useState<ChapterItem[]>([])
    // 存储章节内容
    const [chapterContent, setChapterContent] = useState<Array<{ chapterIndex: number; content: string }>>([])

    async function init() {
        const currentReadChapter: CurrentReadChapterInfo = await LocalCache.getData(CURRENT_READ_CHAPTER_KEY)
        if (currentReadChapter) {
            setCurReadChapter(currentReadChapter)
        } else {
            return
        }

        try {
            // 获取章节详情
            const bookResp = await bookApi.reqGetBookDetails({
                bookId: curReadChapter!.bID as string,
                _source: +curReadChapter!.source
            })
            setChapterList(bookResp.data.chapters)
            setBookDetails(bookResp.data)

            // 获取当前章节正文
            //  - 检测当前章节信息是否携带访问正文内容的 url
            const chapter = bookResp.data.chapters[curReadChapter!.cSN]
            if (chapter.contentUrl) {
            }
        } catch (error) {
            console.log(error)
            jcShowToast({ text: '获取书籍数据失败', type: 'error' })
        }
    }

    useEffect(() => {
        init()
    }, [])

    // 当前章节名称
    const curChapterName = useMemo(() => {
        const chapter = chapterList[curReadChapter?.cSN || 0]
        return chapter ? chapter.chapterName : ''
    }, [curReadChapter, chapterList])

    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => setIsVisible(!isVisible)}
                style={[styles.container]}
            >
                {bookDetails && (
                    <ReadHeader
                        chapterName={curChapterName}
                        bookName={bookDetails.title}
                        isVisible={isVisible}
                    />
                )}
                <ReadFooter
                    isVisible={isVisible}
                    showChapterList={showChapterList}
                />
                <ChapterList
                    isVisible={isChapterListVisible}
                    chaperList={chapterList}
                    closeChapterList={() => setIsChapterListVisible(false)}
                    activeIndex={curReadChapter?.cSN || 0}
                />
            </TouchableOpacity>
        </>
    )
}
