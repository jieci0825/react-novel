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
import { getAdjacentIndexes, LocalCache } from '@/utils'
import { CURRENT_READ_CHAPTER_KEY } from '@/constants'
import { jcShowToast } from '@/components/jc-toast/jc-toast'

// 页面UI状态
function useUIState() {
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

    return {
        isVisible,
        setIsVisible,
        curChapterProgress,
        setCurChapterProgress,
        isChapterListVisible,
        showChapterList,
        setIsChapterListVisible
    }
}

// 书籍数据：书籍详情、章节列表
function useBookData() {
    // 书籍详情
    const [bookDetails, setBookDetails] = useState<GetBookDetailsData>()
    // 章节列表
    const [chapterList, setChapterList] = useState<ChapterItem[]>([])

    const getBookDetails = async (bookId: string | number, source: number) => {
        // 获取章节详情
        const bookResp = await bookApi.reqGetBookDetails({
            bookId,
            _source: source
        })
        setChapterList(bookResp.data.chapters)
        setBookDetails(bookResp.data)
    }

    return { bookDetails, chapterList, setChapterList, getBookDetails }
}

// 章节正文
function useChapterContent() {
    // 存储章节内容
    const [chapterContent, setChapterContent] = useState<Array<{ chapterIndex: number; content: string }>>([])

    // 缓存数量：即当前章节上下章节的缓存数量
    const cacheNum = useRef(2).current

    //  获取一开始进入需要缓存的章节内容
    const getCacheChapterContentsInit = async (
        currentChapterIndex: number,
        chapterList: ChapterItem[],
        bookId: string | number,
        source: number
    ) => {
        const { prevIndex, nextIndex } = getAdjacentIndexes(currentChapterIndex, chapterList.length, cacheNum)

        const allIndex = [...prevIndex, currentChapterIndex, ...nextIndex]

        const allChapterContents = (
            await Promise.all(
                allIndex.map(item => {
                    return bookApi.reqGetBookContent({
                        bookId: bookId as string,
                        _source: +source,
                        chapterId: chapterList[item].chapterId,
                        contentUrl: chapterList[item].contentUrl || ''
                    })
                })
            )
        ).map((item, index) => {
            return {
                chapterIndex: allIndex[index],
                content: item.data.content
            }
        })

        setChapterContent(allChapterContents)
    }

    return { chapterContent, getCacheChapterContentsInit }
}

export default function ReadPage() {
    // 主题样式
    const { theme } = useTheme()
    const styles = readStyles(theme)

    // 页面hooks
    const {
        isVisible,
        setIsVisible,
        curChapterProgress,
        setCurChapterProgress,
        isChapterListVisible,
        showChapterList,
        setIsChapterListVisible
    } = useUIState()
    const { bookDetails, chapterList, setChapterList, getBookDetails } = useBookData()
    const { chapterContent, getCacheChapterContentsInit } = useChapterContent()

    // 当前阅读章节
    const [curReadChapter, setCurReadChapter] = useState<CurrentReadChapterInfo | null>(null)

    async function init() {
        // 1. 获取当前的阅读章节
        //  - 在每次进入阅读页面之前，都会处理当前阅读章节，所以一般而言，肯定会有当前阅读章节数据
        const currentReadChapter: CurrentReadChapterInfo = await LocalCache.getData(CURRENT_READ_CHAPTER_KEY)
        if (!currentReadChapter) return
        setCurReadChapter(currentReadChapter)

        const bookId = currentReadChapter.bID
        const source = currentReadChapter.source

        // 2. 获取书籍详情
        await getBookDetails(bookId, source)

        setChapterList(prev => {
            // 3. 获取初始化的缓存章节内容
            getCacheChapterContentsInit(currentReadChapter.cSN, prev, bookId, source)
            return prev
        })
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
