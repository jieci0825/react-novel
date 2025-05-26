import { Theme, useTheme } from '@/hooks/useTheme'
import { readStyles } from '@/styles/pages/read.styles'
import { ActivityIndicator, PixelRatio, Text, TouchableOpacity, View } from 'react-native'
import ReadHeader from './read-header'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReadFooter from './read-footer'
import { bookApi } from '@/api'
import { useLocalSearchParams } from 'expo-router'
import { ChapterItem, GetBookDetailsData } from '@/api/modules/book/type'
import ChapterList from '@/components/chapter-list/chapter-list'
import { CurrentReadChapterInfo, ReaderSetting } from '@/types'
import { extractNonChineseChars, getAdjacentIndexes, LocalCache, splitTextByLine } from '@/utils'
import { CURRENT_SOURCE, READER_GUIDE_AREA, READER_SETTING, USER_SETTING } from '@/constants'
import { jcShowToast } from '@/components/jc-toast/jc-toast'
import ReadContentWrap from './read-content-wrap'
import CalcTextSize from './calc-text-size'
import { useSQLiteContext } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as schema from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { DrizzleDB } from '@/db/db'
import { DarkTheme } from '@/styles/variable'
import ReaderSettingComp from './read-settting/read-setting'
import { AnimationType, ControllerItem } from './read.type'

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

        return {
            details: bookResp.data,
            chapters: bookResp.data.chapters
        }
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
function useChapterContent(drizzleDB: DrizzleDB, bookRecord: React.MutableRefObject<schema.Books | null>) {
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

    // 检测章节是否存在
    async function checkChapterExist(chapterIndex: number) {
        const result = await drizzleDB
            .select()
            .from(schema.chapters)
            .where(
                and(
                    eq(schema.chapters.books_id, bookRecord.current?.id!),
                    eq(schema.chapters.chapterIndex, chapterIndex)
                )
            )

        return {
            isExist: !!(result.length > 0),
            row: result[0]
        }
    }

    // 根据章节索引获取章节内容
    async function getCacheChapterContentsByIndexs(
        allIndex: number[],
        chapterList: ChapterItem[],
        bookId: string | number,
        source: number
    ) {
        const requestResultList = []

        // 每次获取章节内容后，将内容进行缓存到本地，下次获取时先从本地获取，没有在筛选index去请求
        const needRequestIndex = []
        for (const idx of allIndex) {
            const { isExist, row } = await checkChapterExist(idx)

            // 如果不存在才需要请求，加入请求队列
            if (!isExist) {
                needRequestIndex.push(idx)
            } else {
                requestResultList.push({
                    chapterIndex: idx,
                    content: row.content,
                    chapterName: row.chapter_name,
                    chapterId: chapterList[idx].chapterId
                })
            }
        }

        const result = (
            await Promise.all(
                needRequestIndex.map(item => {
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

        requestResultList.push(...result)

        const chapterDataList = requestResultList.map(item => {
            const obj: schema.AddChapters = {
                chapter_name: item.chapterName,
                content: item.content,
                chapterIndex: item.chapterIndex,
                // 即 books 表的主键 id
                books_id: bookRecord.current?.id!
            }

            return obj
        })

        for (const item of chapterDataList) {
            // 检测是否存在。只要 booksId 和 chapterIndex 相同，就不再插入
            const { isExist } = await checkChapterExist(item.chapterIndex)

            // 不存在的才缓存章节内容到本地
            if (!isExist) {
                await drizzleDB.insert(schema.chapters).values(item)
            }
        }

        return requestResultList
    }

    return { chapterContents, setChapterContents, getCacheChapterContentsInit, getCacheChapterContentsByIndexs }
}

// 阅读器界面设置
function useReaderSetting(theme: Theme, isDarkMode: boolean) {
    const [readStyle, setReadStyle] = useState<ReaderSetting>({
        fontSize: 18, // 基础字体大小
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

    const handleSetReadStyle = async (raw: ControllerItem, value: number) => {
        const data = { ...readStyle, [raw.field]: value }
        setReadStyle(data)
        await LocalCache.storeData(READER_SETTING, data)
    }

    return { readStyle, setReadStyle, handleSetReadStyle }
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
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
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
    setChapterContents,
    setCurrentPage
}: useChapterSwitchParams) {
    // 上一章
    const prevChapter = (progress?: number) => {
        // 上一章的时候，判断是否是第一章节，如果是第一章节，则不进行任何操作
        if (curReadChapter?.cSN === 0) {
            jcShowToast({ text: '已经是第一章了', type: 'info' })
            return
        }

        const index = curReadChapter?.cSN || 0
        processChapterSwitch(index - 1, index, progress || 0)
    }

    // 下一章
    const nextChapter = async (progress?: number) => {
        // 下一章的时候，判断是否是最后一章节，如果是最后一章节，则不进行任何操作
        if (curReadChapter?.cSN === chapterList.length - 1) {
            jcShowToast({ text: '已经是最后一章了', type: 'info' })
            return
        }

        // 切换到下一章节
        const index = curReadChapter?.cSN || 0
        await processChapterSwitch(index + 1, index, progress || 0)

        // tips: 等待章节切换完成后再更新当前阅读章节，可以避免切换时会先展示一下当前章节的第一页，然后才展现要切换到下一章节的内容
        // 每当切换到下一章节的时候，都应该将 currentPage 改为 0
        setCurrentPage(0)
    }

    // 处理章节切换
    const processChapterSwitch = async (newIndex: number, oldIndex: number, progress: number) => {
        // 根据当前章节index获取需要的缓存章节index
        const { prevIndex, nextIndex } = getAdjacentIndexes(newIndex, chapterList.length, cacheNum)
        const newIndexs = [...prevIndex, newIndex, ...nextIndex]

        const cacheChapterIndexs = chapterContents.map(item => item.chapterIndex)

        // 根据 cacheChapterIndexs 进行过滤，如果当前缓存的章节内容中，存在indexs中的章节，则直接使用，不存在才重新获取
        // 得到需要去请求获取的章节index
        const _chapterIndexList = newIndexs.filter(item => !cacheChapterIndexs.includes(item))

        // 是否处理完成章节的切换
        let isProcessChapterSwitch = false

        // 如果缓存章节的内容中，存在当前章节，则直接使用
        const chapterItem = chapterContents.find(item => item.chapterIndex === newIndex)

        if (chapterItem && curReadChapter) {
            // 重置章节阅读进度
            setCurChapterProgress(progress)
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

            // * 如果当前章节内容存在与上一次缓存的章节内容中，则前面已经处理完成了，这里就不需要再次处理了
            if (isProcessChapterSwitch) return

            setChapterContents(newChapterContents)
            setChapterContents(prev => {
                const item = prev.find(item => item.chapterIndex === newIndex)
                if (item) {
                    // 重置章节阅读进度
                    setCurChapterProgress(progress)
                    // 切换当前阅读章节
                    setCurReadChapter({ ...curReadChapter, cSN: newIndex, readProgress: progress })
                    // 获取新章节中非中文的字符
                    getNoChineseCharacterList(item.content)
                }
                return newChapterContents
            })
        }
    }

    return { prevChapter, nextChapter, processChapterSwitch }
}

interface usePageSwitchParams {
    nextChapter: (progress: number) => void
    prevChapter: (progress: number) => void
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}
// 切换上下页
function usePageSwitch({ nextChapter, prevChapter, currentPage, setCurrentPage }: usePageSwitchParams) {
    // 切换章节时的动作
    //  - 比如一直是上一页的切换，则下一次激活的章节是上一章的最后一页，反之则是下一章的第一页
    const [switchAction, setSwitchAction] = useState<'prev' | 'next'>('next')

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
            nextChapter(0)
            setSwitchAction('next')
            return
        }
        setCurrentPage(currentPage + 1)
    }

    // 上一页
    const prevPage = () => {
        if (currentPage <= 0) {
            // 通过点击上一页切换到的上一章，则阅读进度应为 100%
            prevChapter(100)
            setSwitchAction('prev')
            return
        }
        setCurrentPage(currentPage - 1)
    }

    const calcPageDataCallback = (_maxPageIndex: number) => {
        setMaxPageIndex(_maxPageIndex)
        //  这里额外处理一种情况，当用户通过上一页切换到上一章时，页面应该要单独处理，处理为上一章的最后一页
        //  - 即本次分页数据处理完成的最大的index
        if (switchAction === 'prev') {
            setCurrentPage(_maxPageIndex)
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
    const { theme, toggleTheme, isDarkMode } = useTheme()
    const styles = readStyles(theme)

    const db = useSQLiteContext()
    const drizzleDB = drizzle(db, { schema })

    // 是否开始正式正式渲染
    const [isRender, setIsRender] = useState(false)
    // 当前页
    const [currentPage, setCurrentPage] = useState(0)
    // 显示阅读器设置
    const [showReaderSetting, setShowReaderSetting] = useState(false)
    // 阅读动画
    const [readAnimation, setReadAnimation] = useState<AnimationType>('none')

    // 当前books表中的记录
    const bookRef = useRef<schema.Books | null>(null)

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
        useChapterContent(drizzleDB, bookRef)
    const { readStyle, setReadStyle, handleSetReadStyle } = useReaderSetting(theme, isDarkMode)
    const { characterSizeMap, dynamicTextStyles, addData, noChineseCharacterList, getNoChineseCharacterList } =
        useCacheCharacterSize(readStyle)
    // 当前阅读章节
    const [curReadChapter, setCurReadChapter] = useState<CurrentReadChapterInfo | null>(null)
    const curReadChapterRef = useRef(curReadChapter)
    useEffect(() => {
        curReadChapterRef.current = curReadChapter // 实时更新引用
    }, [curReadChapter])

    // 切换阅读章节
    const { prevChapter, nextChapter, processChapterSwitch } = useChapterSwitch({
        curReadChapter,
        chapterList,
        chapterContents,
        setCurChapterProgress,
        setCurReadChapter,
        getNoChineseCharacterList,
        getCacheChapterContentsByIndexs,
        setChapterContents,
        setCurrentPage
    })
    // 切换上下页
    const { nextPage, prevPage, calcPageDataCallback, maxPageIndexRef } = usePageSwitch({
        prevChapter,
        nextChapter,
        currentPage,
        setCurrentPage
    })
    // 指引
    const { showGuide, closeGuide } = useGuide()

    useEffect(() => {
        if (maxPageIndexRef.current === 0) return setCurChapterProgress(0)
        const progress = Math.round((currentPage / maxPageIndexRef.current) * 100 * 100) / 100
        // 四舍五入
        setCurChapterProgress(progress)
        // 更新当前章节的阅读进度
        setCurReadChapter(prev => {
            if (!prev) return prev
            return {
                ...prev,
                readProgress: currentPage
            }
        })
    }, [currentPage])

    const params = useLocalSearchParams()

    async function init() {
        const bookName = params.bookName as string
        const author = params.author as string
        const bookId = params.bookId as string
        const source = await LocalCache.getData(CURRENT_SOURCE)

        // 处理阅读器界面设置
        const readerSetting: ReaderSetting = await LocalCache.getData(READER_SETTING)

        // 检测是否是出于暗黑模式
        if (isDarkMode) {
            // 如果是暗黑模式则采用暗黑模式主题。非暗黑模式则使用本地记录的主题
            readerSetting.backgroundColor = DarkTheme.bgColor
            readerSetting.textColor = DarkTheme.textSecondaryColor
        }

        setReadStyle(readerSetting)

        const result = await drizzleDB
            .select()
            .from(schema.books)
            .where(and(eq(schema.books.book_name, bookName), eq(schema.books.author, author)))

        // 2. 获取书籍详情
        const { chapters: _chapters, details } = await getBookDetails(bookId, source)

        let currentReadChapter: CurrentReadChapterInfo = {} as CurrentReadChapterInfo

        // 如果不存在，则添加一个记录
        if (!result.length) {
            const data: schema.AddBooks = {
                book_id: bookId,
                book_name: bookName,
                author,
                cover: details.cover,
                is_bookshelf: false,
                total_chapter: _chapters.length || 0,
                last_read_chapter_page_index: 0,
                last_read_chapter_index: 0,
                last_read_time: new Date()
            }

            // 插入数据到 books 表
            await drizzleDB.insert(schema.books).values(data)

            currentReadChapter = {
                bID: bookId,
                source,
                cSN: 0,
                readProgress: 0,
                bookName,
                author
            }
        } else {
            bookRef.current = result[0]

            const record = result[0]
            // 存在则根据进度赋值
            currentReadChapter = {
                bID: bookId,
                source,
                cSN: record.last_read_chapter_index,
                readProgress: record.last_read_chapter_page_index,
                bookName,
                author
            }
        }

        if (!currentReadChapter) return

        setCurrentPage(currentReadChapter.readProgress)
        setCurReadChapter(currentReadChapter)

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

        return () => {
            // 组件卸载时，保存阅读进度到本地
            if (!curReadChapterRef.current) return
            // 更新 books 表中的阅读进度
            const update = async (cur: CurrentReadChapterInfo) => {
                await drizzleDB
                    .update(schema.books)
                    .set({
                        last_read_chapter_index: cur.cSN,
                        last_read_chapter_page_index: cur.readProgress,
                        last_read_time: new Date()
                    })
                    .where(and(eq(schema.books.book_name, cur.bookName), eq(schema.books.author, cur.author)))
            }
            update(curReadChapterRef.current)
        }
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
                chapterName={curChapterName}
            />
        )
    }, [currentPage, chapterContent, isVisible, dynamicTextStyles])

    const toggleDarkMode = () => {
        async function cb() {
            const userSetting = await LocalCache.getData(USER_SETTING)

            // 更改本地主题
            await LocalCache.storeData(USER_SETTING, {
                ...userSetting,
                systemTheme: isDarkMode ? 'dark' : 'light'
            })

            // 如果此时此处 isDarkMode 为 false，则表示要切换到深色主题
            //  - 而深色主题拥有最高权重的主题，字体颜色和背景色只能使用内置的、
            //  - 而为了避免 theme 因为直接切换深浅主题之后，theme 先改变，而 readStyle 还是原来初始值不会导致页面颜色不一致的问题，就在切换完成之前，手动更新相关颜色
            //  - 且提前修改，这样可以解决，因为 theme 先更新，而 readStyle 后更新，导致页面切换主题色时，正文内容会闪烁一下才变化的问题
            if (!isDarkMode) {
                setReadStyle({
                    ...readStyle,
                    textColor: DarkTheme.textSecondaryColor,
                    backgroundColor: DarkTheme.bgColor
                })
            } else {
                // 切换到浅色系也要这样提前更新，但是因为浅色系的主题是允许被用户自定义的，所以取值需要从本地的记录中取值
                //  - 因为 readStyle 的值可能被更改过了，所以需要从本地记录中取值。而本地本项目采用的是实时变化，所以可以放心取用
                const readerSetting: ReaderSetting = await LocalCache.getData(READER_SETTING)
                setReadStyle(readerSetting)
            }
        }
        toggleTheme(cb)
    }

    const openReaderSetting = () => {
        setIsVisible(false)
        setShowReaderSetting(true)
    }

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
                        {isVisible && (
                            <TouchableOpacity
                                style={styles.menuMask}
                                onPress={() => setIsVisible(false)}
                                activeOpacity={1}
                            ></TouchableOpacity>
                        )}
                    </View>
                    <ReadFooter
                        prevChapter={prevChapter}
                        nextChapter={nextChapter}
                        isVisible={isVisible}
                        showChapterList={showChapterList}
                        curChapterProgress={0}
                        toggleDarkMode={toggleDarkMode}
                        openReaderSetting={openReaderSetting}
                    />
                    <ChapterList
                        isVisible={isChapterListVisible}
                        chaperList={chapterList}
                        closeChapterList={() => setIsChapterListVisible(false)}
                        activeIndex={curReadChapter?.cSN || 0}
                        clickChapter={chapterIndex => {
                            setIsChapterListVisible(false)
                            // 章节不一致时才需要改变
                            if (chapterIndex !== curReadChapter?.cSN) {
                                // 切换章节时，重置当前页码
                                setCurrentPage(0)

                                processChapterSwitch(chapterIndex, curReadChapter?.cSN!, 0)
                            }
                        }}
                    />
                    {/* 阅读器设置 */}
                    {showReaderSetting && (
                        <ReaderSettingComp
                            settingData={readStyle}
                            handleSetReadStyle={handleSetReadStyle}
                            animation={readAnimation}
                            setReadAnimation={setReadAnimation}
                            close={() => {
                                setShowReaderSetting(false)
                            }}
                        />
                    )}
                </TouchableOpacity>
            )}
            {!isRender && (
                <View
                    style={[
                        styles.container,
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            overflow: 'hidden'
                        }
                    ]}
                >
                    <ActivityIndicator
                        size='large'
                        color={theme.primaryColor}
                    />
                </View>
            )}
            {/* 阅读指南 */}
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
