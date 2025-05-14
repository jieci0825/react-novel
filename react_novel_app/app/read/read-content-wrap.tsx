import { FlatList, PixelRatio, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { AnimationType, CharacterSizeMap, ReadContentBase } from './read.type'
import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
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
function usePageData(characterSizeMap: CharacterSizeMap, props: ReadContentHorizontalProps) {
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
            contents: props.contents,
            chapterName: props.chapterName
        })

        if (!result) return

        props.calcPageDataCallback(result.length - 1)

        setPageData(result)
    }

    return { startCalc, paragraphIndent, pageData }
}

interface ReadContentHorizontalProps extends ReadContentBase {
    handleCenter: () => void
    prevPage: () => void
    nextPage: () => void
    currentPage: number
    // 重新计算分页后的回调
    calcPageDataCallback: (maxPageIndex: number) => void
    chapterName: string
}

export default function ReadContentWrap(props: ReadContentHorizontalProps) {
    const { theme } = useTheme()
    const styles = readContentWrapStyles(theme)
    const screenWidth = useWindowDimensions().width

    // 屏幕划分为几部分
    const portion = useRef(3).current

    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

    const { pageData, startCalc, paragraphIndent } = usePageData(props.characterSizeMap, props)

    useEffect(() => {
        startCalc(containerSize)
        // props.content 这里来监听 props.content 字符串的内容变化。如果是 props.contents 则因为每次都是新对象，导致会不停的触发计算
    }, [containerSize, props.content])

    const containerClick = (e: GestureResponderEvent) => {
        const x = e.nativeEvent.pageX
        const leftRange = screenWidth / portion
        const rightRange = (screenWidth / portion) * 2

        if (x < leftRange) {
            props.prevPage()
        } else if (x > rightRange) {
            props.nextPage()
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
                                    currentPage={props.currentPage}
                                    textStyle={props.dynamicTextStyles}
                                    paragraphIndent={paragraphIndent}
                                    animation={props.animation as Exclude<AnimationType, 'scroll'>}
                                    readerSetting={props.readSetting}
                                    containerSize={containerSize}
                                />
                            </>
                        )}
                    </View>
                </View>
                <ReadContentFooter
                    chapterName={props.currentChapterName}
                    currentPage={props.currentPage + 1}
                    totalPage={pageData.length}
                />
            </TouchableOpacity>
        </>
    )
}
