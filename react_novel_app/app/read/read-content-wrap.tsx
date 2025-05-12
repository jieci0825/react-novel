import { FlatList, PixelRatio, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { AnimationType, CharacterSizeMap, ReadContentBase } from './read.type'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { readContentWrapStyles } from '@/styles/pages/read.styles'
import processContentPage, { PageDataItem } from '@/utils/process-content-page'
import PageHorizontal from './page-horizontal'
import ReadContentFooter from './read-content-footer'
import { GestureResponderEvent } from 'react-native'
import { jcShowToast } from '@/components/jc-toast/jc-toast'
import { LocalCache } from '@/utils'
import { READER_GUIDE_AREA } from '@/constants'

// 根据缓存的字符 size，来计算当前章节的分页数据
function usePageData(characterSizeMap: CharacterSizeMap, props: ReadContentBase) {
    // 分页数据
    const [pageData, setPageData] = useState<Array<PageDataItem[]>>([])

    // 中文字符宽度
    const chineseWidth = characterSizeMap.current.get('chinese')?.width || 0
    // 行高
    const lineHeight = props.dynamicTextStyles.lineHeight || 0
    // 段落间距
    const paragraphSpacing = parseInt((props.dynamicTextStyles.marginBottom as any) || 0)
    // 字间距
    const letterSpacing = props.dynamicTextStyles.letterSpacing || 0
    // 段落缩进
    //  - 缩进的字符数 * 中文字符的宽度 + 缩进的字符数 * 字符间距
    const paragraphIndent = props.readSetting.indent * chineseWidth + props.readSetting.indent * letterSpacing

    const startCalc = (containerSize: { width: number; height: number }) => {
        const result = processContentPage({
            characterSizeMap,
            letterSpacing,
            paragraphIndent,
            lineHeight,
            paragraphSpacing,
            containerSize,
            contents: props.contents
        })

        if (!result) return

        setPageData(result)
    }

    return { startCalc, paragraphIndent, pageData }
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

interface ReadContentHorizontalMethods {
    nextPage: () => void
    prevPage: () => void
}

interface ReadContentHorizontalProps extends ReadContentBase {
    handleCenter: () => void
    prevChapter: () => void
    nextChapter: () => void
}

export default forwardRef<ReadContentHorizontalMethods, ReadContentHorizontalProps>(function ReadContentHorizontal(
    props,
    ref
) {
    const { theme } = useTheme()
    const styles = readContentWrapStyles(theme)
    const screenWidth = useWindowDimensions().width

    const { showGuide, closeGuide } = useGuide()

    // 屏幕划分为几部分
    const portion = useRef(3).current

    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

    const { pageData, startCalc, paragraphIndent } = usePageData(props.characterSizeMap, props)

    // 当前页
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        startCalc(containerSize)
    }, [containerSize])

    const nextPage = () => {
        if (currentPage >= pageData.length - 1) {
            props.nextChapter()
            return
        }
        setCurrentPage(currentPage + 1)
    }

    const prevPage = () => {
        if (currentPage <= 0) {
            props.prevChapter()
            return
        }
        setCurrentPage(currentPage - 1)
    }

    useImperativeHandle(ref, () => {
        return {
            nextPage,
            prevPage
        }
    })

    const containerClick = (e: GestureResponderEvent) => {
        const x = e.nativeEvent.pageX
        const leftRange = screenWidth / portion
        const rightRange = (screenWidth / portion) * 2

        if (x < leftRange) {
            prevPage()
        } else if (x > rightRange) {
            nextPage()
        } else {
            // 都不是则表示中间
            props.handleCenter()
        }
    }

    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onPress={containerClick}
                style={[styles.container]}
            >
                <View
                    style={[
                        styles.containerWrap,
                        {
                            paddingHorizontal: props.readSetting.paddingHorizontal,
                            paddingVertical: props.readSetting.paddingVertical,
                            backgroundColor: props.readSetting.backgroundColor
                        }
                    ]}
                >
                    <View
                        style={styles.containerInner}
                        onLayout={({ nativeEvent }) => {
                            setContainerSize(nativeEvent.layout)
                        }}
                    >
                        {/* 根据阅读进度计算展示第几页 */}
                        {!!containerSize.width && (
                            <>
                                <PageHorizontal
                                    pageList={pageData}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    textStyle={props.dynamicTextStyles}
                                    paragraphIndent={paragraphIndent}
                                    animation={props.animation as Exclude<AnimationType, 'scroll'>}
                                />
                            </>
                        )}
                    </View>
                </View>
                <ReadContentFooter
                    chapterName={props.currentChapterName}
                    currentPage={currentPage + 1}
                    totalPage={pageData.length}
                />
            </TouchableOpacity>
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
})
