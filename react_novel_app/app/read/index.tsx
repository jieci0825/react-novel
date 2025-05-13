import { Theme, useTheme } from '@/hooks/useTheme'
import { readStyles } from '@/styles/pages/read.styles'
import { Button, PixelRatio, Text, TouchableOpacity, View } from 'react-native'
import ReadHeader from './read-header'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import ReadFooter from './read-footer'
import { bookApi } from '@/api'
import { useLocalSearchParams } from 'expo-router'
import { ChapterItem, GetBookDetailsData } from '@/api/modules/book/type'
import ChapterList from '@/components/chapter-list/chapter-list'
import { CurrentReadChapterInfo } from '@/types'
import { extractNonChineseChars, getAdjacentIndexes, LocalCache, splitTextByLine } from '@/utils'
import { CURRENT_READ_CHAPTER_KEY, READER_GUIDE_AREA } from '@/constants'
import { jcShowToast } from '@/components/jc-toast/jc-toast'
import ReadContentWrap from './read-content-wrap'
import { CharacterSizeMap, ReaderSetting } from './read.type'
import ReadContentFooter from './read-content-footer'
import CalcTextSize from './calc-text-size'

// 缓存数量：即当前章节上下章节的缓存数量
const cacheNum = 2

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

interface CacheChapterItem {
    chapterIndex: number
    content: string
    chapterName: string
    chapterId: string | number
}
// 章节正文
function useChapterContent() {
    // 存储章节内容
    const [chapterContents, setChapterContents] = useState<CacheChapterItem[]>([])

    //  获取一开始进入需要缓存的章节内容
    const getCacheChapterContentsInit = async (
        currentChapterIndex: number,
        chapterList: ChapterItem[],
        bookId: string | number,
        source: number
    ) => {
        const { prevIndex, nextIndex } = getAdjacentIndexes(currentChapterIndex, chapterList.length, cacheNum)

        const allIndex = [...prevIndex, currentChapterIndex, ...nextIndex]

        const allChapterContents = await getCacheChapterContentsByIndexs(allIndex, chapterList, bookId, source)

        setChapterContents(allChapterContents)

        return allChapterContents
    }

    // 根据章节索引获取章节内容
    async function getCacheChapterContentsByIndexs(
        allIndex: number[],
        chapterList: ChapterItem[],
        bookId: string | number,
        source: number
    ) {
        // TODO 每次获取章节内容后，将内容进行缓存到本地，下次获取时先从本地获取，没有在筛选index去请求

        const result = (
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
                chapterName: chapterList[allIndex[index]].chapterName,
                chapterId: chapterList[allIndex[index]].chapterId
            }
        })

        return result
    }

    return { chapterContents, setChapterContents, getCacheChapterContentsInit, getCacheChapterContentsByIndexs }
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
        const list = [...new Set(extractNonChineseChars(content).split(''))]

        setNoChineseCharacterList(
            list.filter(item => {
                // 已经存在的则无需再次添加计算字符大小
                return !characterSizeMap.current.has(item)
            })
        )
    }

    return { characterSizeMap, dynamicTextStyles, addData, noChineseCharacterList, getNoChineseCharacterList }
}

interface useChapterSwitchParams {
    curReadChapter: CurrentReadChapterInfo | null
    chapterList: ChapterItem[]
    chapterContents: CacheChapterItem[]
    setCurChapterProgress: (progress: number) => void
    setCurReadChapter: (chapter: CurrentReadChapterInfo) => void
    getNoChineseCharacterList: (content: string) => void
    getCacheChapterContentsByIndexs: (
        allIndex: number[],
        chapterList: ChapterItem[],
        bookId: string | number,
        source: number
    ) => Promise<CacheChapterItem[]>
    setChapterContents: React.Dispatch<React.SetStateAction<CacheChapterItem[]>>
}
// 切换章节
function useChapterSwitch({
    curReadChapter,
    chapterList,
    chapterContents,
    setCurChapterProgress,
    setCurReadChapter,
    getNoChineseCharacterList,
    getCacheChapterContentsByIndexs,
    setChapterContents
}: useChapterSwitchParams) {
    // 上一章
    const prevChapter = () => {
        // 上一章的时候，判断是否是第一章节，如果是第一章节，则不进行任何操作
        if (curReadChapter?.cSN === 0) {
            jcShowToast({ text: '已经是第一章了', type: 'info' })
            return
        }

        const index = curReadChapter?.cSN || 0
        processChapterSwitch(index - 1, index)
    }

    // 下一章
    const nextChapter = () => {
        // 下一章的时候，判断是否是最后一章节，如果是最后一章节，则不进行任何操作
        if (curReadChapter?.cSN === chapterList.length - 1) {
            jcShowToast({ text: '已经是最后一章了', type: 'info' })
            return
        }

        // 切换到下一章节
        const index = curReadChapter?.cSN || 0
        processChapterSwitch(index + 1, index)
    }

    // 处理章节切换
    const processChapterSwitch = async (newIndex: number, oldIndex: number) => {
        // 根据当前章节index获取需要的缓存章节index
        const { prevIndex, nextIndex } = getAdjacentIndexes(newIndex, chapterList.length, cacheNum)
        const newIndexs = [...prevIndex, newIndex, ...nextIndex]

        const cacheChapterIndexs = chapterContents.map(item => item.chapterIndex)

        // 根据 cacheChapterIndexs 进行过滤，如果当前缓存的章节内容中，存在indexs中的章节，则直接使用，不存在才重新获取
        // 得到需要去请求获取的章节index
        const _chapterIndexList = newIndexs.filter(item => !cacheChapterIndexs.includes(item))

        // 是否完整章节的切换
        let isProcessChapterSwitch = false

        // 如果缓存章节的内容中，存在当前章节，则直接使用
        const chapterItem = chapterContents.find(item => item.chapterIndex === newIndex)

        if (chapterItem && curReadChapter) {
            // 重置章节阅读进度
            setCurChapterProgress(0)
            // 切换当前阅读章节
            setCurReadChapter({ ...curReadChapter, cSN: newIndex })
            // 获取新章节中非中文的字符
            getNoChineseCharacterList(chapterItem.content)

            // 完成章节切换
            isProcessChapterSwitch = true
        }

        // 如果有需要获取的章节，则进行获取
        if (_chapterIndexList.length > 0 && curReadChapter) {
            const result = await getCacheChapterContentsByIndexs(
                _chapterIndexList,
                chapterList,
                curReadChapter.bID,
                curReadChapter.source
            )

            // 遍历上一次缓存的章节内容，如果上一次的章节内容 index 不存在于本次需要的缓存章节index中，则删除，不加入这次更新的章节内容中
            //  - 这样可以保证，如果用户在阅读过程中，切换到其他章节时，一直都是保持着最大缓存章节内容，避免内存占用过大
            const list = chapterContents.filter(item => newIndexs.includes(item.chapterIndex))

            // 合并章节内容
            const newChapterContents = list.concat(result)

            setChapterContents(newChapterContents)
            setChapterContents(prev => {
                const item = prev.find(item => item.chapterIndex === newIndex)
                if (item) {
                    // 重置章节阅读进度
                    setCurChapterProgress(0)
                    // 切换当前阅读章节
                    setCurReadChapter({ ...curReadChapter, cSN: newIndex })
                    // 获取新章节中非中文的字符
                    getNoChineseCharacterList(item.content)
                }
                return newChapterContents
            })
        }
    }

    return { prevChapter, nextChapter }
}

interface usePageSwitchParams {
    nextChapter: () => void
    prevChapter: () => void
}
// 切换上下页
function usePageSwitch({ nextChapter, prevChapter }: usePageSwitchParams) {
    // 切换章节时的动作
    //  - 比如一直是上一页的切换，则下一次激活的章节是上一章的最后一页，反之则是下一章的第一页
    const [switchAction, setSwitchAction] = useState<'prev' | 'next'>('next')
    // 当前页
    const [currentPage, setCurrentPage] = useState(0)
    // // 最大页数
    // const [maxPageIndex, setMaxPageIndex] = useState(0)
    // // 下一页
    // const nextPage = () => {
    //     if (currentPage >= maxPageIndex) {
    //         nextChapter()
    //         setSwitchAction('next')
    //         return
    //     }
    //     setCurrentPage(currentPage + 1)
    // }
    // * 上述这种使用 maxPageIndex 会存在一个问题，当 maxPageIndex 更新时，会重新执行 usePageSwitch。在重新执行的过程中，可能由于视图尚未更新，事件绑定或异步操作中引用的仍是旧的闭包函数。就会导致 maxPageIndex 的值依然是旧值 0，从而发生逻辑错误。

    const [maxPageIndex, setMaxPageIndex] = useState(0)
    // 借用 useRef
    const maxPageIndexRef = useRef(0)

    useEffect(() => {
        maxPageIndexRef.current = maxPageIndex
    }, [maxPageIndex])

    const nextPage = () => {
        if (currentPage >= maxPageIndexRef.current) {
            nextChapter()
            setSwitchAction('next')
            return
        }
        setCurrentPage(currentPage + 1)
    }

    // 上一页
    const prevPage = () => {
        if (currentPage <= 0) {
            prevChapter()
            setSwitchAction('prev')
            return
        }
        setCurrentPage(currentPage - 1)
    }

    const calcPageDataCallback = (_maxPageIndex: number) => {
        setMaxPageIndex(_maxPageIndex)
        //  如果是切换章节，则根据上一次的切换动作，来决定当前章节的起始页
        if (switchAction === 'prev') {
            setCurrentPage(_maxPageIndex)
        } else {
            setCurrentPage(0)
        }
    }

    return {
        switchAction,
        setSwitchAction,
        currentPage,
        setCurrentPage,
        nextPage,
        prevPage,
        calcPageDataCallback,
        maxPageIndexRef
    }
}

// 控制指引
function useGuide() {
    const [showGuide, setShowGuide] = useState(false)

    const closeGuide = () => {
        LocalCache.storeData(READER_GUIDE_AREA, true)
        setShowGuide(false)
    }

    async function init() {
        const guide = await LocalCache.getData(READER_GUIDE_AREA)
        // 如果缓存中没有，则显示引导，如果有则后续不需要显示了
        if (!guide) {
            setShowGuide(true)
        }
    }

    useEffect(() => {
        init()
    }, [])

    return { showGuide, closeGuide }
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
    const { chapterContents, setChapterContents, getCacheChapterContentsInit, getCacheChapterContentsByIndexs } =
        useChapterContent()
    const { readStyle, setReadStyle } = useReaderSetting(theme)
    const { characterSizeMap, dynamicTextStyles, addData, noChineseCharacterList, getNoChineseCharacterList } =
        useCacheCharacterSize(readStyle)
    // 当前阅读章节
    const [curReadChapter, setCurReadChapter] = useState<CurrentReadChapterInfo | null>(null)
    // 切换阅读章节
    const { prevChapter, nextChapter } = useChapterSwitch({
        curReadChapter,
        chapterList,
        chapterContents,
        setCurChapterProgress,
        setCurReadChapter,
        getNoChineseCharacterList,
        getCacheChapterContentsByIndexs,
        setChapterContents
    })
    // 切换上下页
    const { currentPage, setCurrentPage, nextPage, prevPage, calcPageDataCallback, maxPageIndexRef } = usePageSwitch({
        prevChapter,
        nextChapter
    })
    // 指引
    const { showGuide, closeGuide } = useGuide()

    useEffect(() => {
        if (maxPageIndexRef.current === 0) return setCurChapterProgress(0)
        const progress = Math.round((currentPage / maxPageIndexRef.current) * 100 * 100) / 100
        // 四舍五入
        setCurChapterProgress(progress)
        // 更新当前阅读章节的进度
        setCurReadChapter(prev => {
            if (!prev) return prev
            return {
                ...prev,
                readProgress: progress
            }
        })
    }, [currentPage])

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
    // 当前章节内容
    const chapterContent = useMemo(() => {
        const chapter = chapterContents.find(item => item.chapterIndex === curReadChapter?.cSN)
        return chapter?.content || ''
    }, [curReadChapter, chapterList, chapterContents])

    const memoizedReadContentWrap = useMemo(() => {
        return (
            <ReadContentWrap
                currentChapterName={curChapterName}
                handleCenter={() => setIsVisible(!isVisible)}
                nextPage={nextPage}
                prevPage={prevPage}
                animation='none'
                content={chapterContent}
                contents={splitTextByLine(chapterContent)}
                readSetting={readStyle}
                dynamicTextStyles={dynamicTextStyles}
                characterSizeMap={characterSizeMap}
                currentPage={currentPage}
                calcPageDataCallback={calcPageDataCallback}
            />
        )
        // TODO 依赖项，后期增加
    }, [currentPage, chapterContent, isVisible])

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
                        {memoizedReadContentWrap}
                    </View>
                    <ReadFooter
                        prevChapter={prevChapter}
                        nextChapter={nextChapter}
                        isVisible={isVisible}
                        showChapterList={showChapterList}
                        curChapterProgress={curChapterProgress}
                    />
                    {isVisible && (
                        <TouchableOpacity
                            onPress={() => setIsVisible(false)}
                            style={styles.menuMask}
                        ></TouchableOpacity>
                    )}
                    <ChapterList
                        isVisible={isChapterListVisible}
                        chaperList={chapterList}
                        closeChapterList={() => setIsChapterListVisible(false)}
                        activeIndex={curReadChapter?.cSN || 0}
                        clickChapter={chapterIndex => {
                            setIsChapterListVisible(false)
                            if (chapterIndex === curReadChapter?.cSN) {
                                console.log('当前章节')
                            }
                        }}
                    />
                </TouchableOpacity>
            )}
            {showGuide && (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={closeGuide}
                    style={styles.portionMask}
                >
                    <View style={styles.portionMaskTextWrap}>
                        <Text style={styles.portionMaskText}>上一页</Text>
                    </View>
                    <View style={[styles.portionMaskTextWrap, styles.portionMaskTextWrapCenter]}>
                        <Text style={styles.portionMaskText}>呼唤菜单</Text>
                    </View>
                    <View style={styles.portionMaskTextWrap}>
                        <Text style={styles.portionMaskText}>下一页</Text>
                    </View>
                </TouchableOpacity>
            )}
        </>
    )
}
