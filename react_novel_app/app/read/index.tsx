import { Theme, useTheme } from '@/hooks/useTheme'
import { readStyles } from '@/styles/pages/read.styles'
import { Button, PixelRatio, Text, TouchableOpacity, View } from 'react-native'
import ReadHeader from './read-header'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReadFooter from './read-footer'
import { bookApi } from '@/api'
import { useLocalSearchParams } from 'expo-router'
import { ChapterItem, GetBookDetailsData } from '@/api/modules/book/type'
import ChapterList from '@/components/chapter-list/chapter-list'
import { CurrentReadChapterInfo } from '@/types'
import { extractNonChineseChars, getAdjacentIndexes, LocalCache, splitTextByLine } from '@/utils'
import { CURRENT_READ_CHAPTER_KEY } from '@/constants'
import { jcShowToast } from '@/components/jc-toast/jc-toast'
import ReadContentHorizontal from './read-content-wrap'
import { CharacterSizeMap, ReaderSetting } from './read.type'
import ReadContentFooter from './read-content-footer'
import CalcTextSize from './calc-text-size'

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
        return bookResp.data.chapters
    }

    return { bookDetails, chapterList, setChapterList, getBookDetails }
}

// 章节正文
function useChapterContent() {
    // 存储章节内容
    const [chapterContents, setChapterContents] = useState<Array<{ chapterIndex: number; content: string }>>([])

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
                content: item.data.content,
                chapterName: chapterList[allIndex[index]].chapterName
            }
        })

        setChapterContents(allChapterContents)

        return allChapterContents
    }

    return { chapterContents, getCacheChapterContentsInit }
}

// 阅读器界面设置
function useReaderSetting(theme: Theme) {
    const [readStyle, setReadStyle] = useState<ReaderSetting>({
        fontSize: 16, // 基础字体大小
        lineHeight: 24, // 行高
        letterSpacing: 1, // 字间距
        paragraphSpacing: 14, // 段间距
        fontFamily: 'Arial', // 字体
        paddingHorizontal: 16, // 左右边距
        paddingVertical: 10, // 上下边距
        backgroundColor: theme.bgColor,
        textColor: theme.textSecondaryColor,
        indent: 2
    })

    return { readStyle, setReadStyle }
}

// 缓存字符的size
function useCacheCharacterSize(readStyle: ReaderSetting) {
    const fontScale = PixelRatio.getFontScale()

    const dynamicTextStyles = useMemo(() => {
        return {
            color: readStyle.textColor,
            fontSize: readStyle.fontSize * fontScale,
            lineHeight: readStyle.lineHeight * fontScale,
            letterSpacing: readStyle.letterSpacing * fontScale,
            fontFamily: readStyle.fontFamily,
            marginBottom: readStyle.paragraphSpacing * fontScale
        }
    }, [readStyle])

    const [noChineseCharacterList, setNoChineseCharacterList] = useState<string[]>([])

    const characterSizeMap = useRef(new Map<string, { width: number; height: number }>())

    // 动态添加数据
    const addData = (key: string, value: { width: number; height: number }) => {
        characterSizeMap.current.set(key, value)
    }

    // 获取非中文的字符
    const getNoChineseCharacterList = (content: string) => {
        setNoChineseCharacterList([...new Set(extractNonChineseChars(content).split(''))])
    }

    return { characterSizeMap, dynamicTextStyles, addData, noChineseCharacterList, getNoChineseCharacterList }
}

export default function ReadPage() {
    // 主题样式
    const { theme } = useTheme()
    const styles = readStyles(theme)

    // 是否开始正式正式渲染
    const [isRender, setIsRender] = useState(false)

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
    const { chapterContents, getCacheChapterContentsInit } = useChapterContent()
    const { readStyle, setReadStyle } = useReaderSetting(theme)
    const { characterSizeMap, dynamicTextStyles, addData, noChineseCharacterList, getNoChineseCharacterList } =
        useCacheCharacterSize(readStyle)

    // 当前阅读章节
    const [curReadChapter, setCurReadChapter] = useState<CurrentReadChapterInfo | null>(null)

    // 上一章
    const prevChapter = () => {
        console.log('prevChapter')
    }

    // 下一章
    const nextChapter = () => {
        console.log('nextChapter')
    }

    async function init() {
        // 1. 获取当前的阅读章节
        //  - 在每次进入阅读页面之前，都会处理当前阅读章节，所以一般而言，肯定会有当前阅读章节数据
        const currentReadChapter: CurrentReadChapterInfo = await LocalCache.getData(CURRENT_READ_CHAPTER_KEY)
        if (!currentReadChapter) return
        setCurReadChapter(currentReadChapter)

        const bookId = currentReadChapter.bID
        const source = currentReadChapter.source

        // 2. 获取书籍详情
        const _chapters = await getBookDetails(bookId, source)

        // 3. 获取初始化的缓存章节内容
        const _allChapterContents = await getCacheChapterContentsInit(currentReadChapter.cSN, _chapters, bookId, source)

        // 4. 拿到当前的正文，获取章节字符的尺寸信息
        const _currentChapterContent = _allChapterContents.find(item => item.chapterIndex === currentReadChapter.cSN)
        if (_currentChapterContent) {
            const content = _currentChapterContent.content
            getNoChineseCharacterList(content)
        }
        // 5. 开启渲染
        setIsRender(true)
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
            {/* 中文字符固定使用一来检测，中文字符的宽度都是一样的，无需重复计算 */}
            <CalcTextSize
                text='一'
                textStyle={dynamicTextStyles}
                onSizeInfo={({ width, height }) => {
                    addData('chinese', { width, height })
                }}
            />
            {/* 其他字符动态计算 */}
            {noChineseCharacterList.map((item, index) => {
                return (
                    <CalcTextSize
                        key={index}
                        text={item}
                        textStyle={dynamicTextStyles}
                        onSizeInfo={({ width, height }) => {
                            // 检测当前 key 是否存在
                            if (characterSizeMap.current.has(item)) return
                            addData(item, { width, height })
                        }}
                    />
                )
            })}
            {/* 只有等字符都计算好了才渲染 */}
            {isRender && (
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
                    <View style={styles.main}>
                        {/* 正文渲染区域 */}
                        <ReadContentHorizontal
                            handleCenter={() => setIsVisible(!isVisible)}
                            prevChapter={prevChapter}
                            nextChapter={nextChapter}
                            animation='none'
                            content={chapterContents[curReadChapter?.cSN || 0]?.content || ''}
                            contents={splitTextByLine(chapterContents[curReadChapter?.cSN || 0]?.content || '')}
                            readSetting={readStyle}
                            dynamicTextStyles={dynamicTextStyles}
                            characterSizeMap={characterSizeMap}
                        />
                    </View>
                    <ReadFooter
                        prevChapter={prevChapter}
                        nextChapter={nextChapter}
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
            )}
        </>
    )
}
