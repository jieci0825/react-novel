import { FlatList, PixelRatio, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { CharacterSizeMap, ReadContentBase } from './read.type'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { readContentHorizontalStyles } from '@/styles/pages/read.styles'
import processContentPage, { PageDataItem } from '@/utils/process-content-page'
import PageHorizontal from './page-horizontal'
import ReadContentFooter from './read-content-footer'

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

export default function ReadContentHorizontal(props: ReadContentBase) {
    const { theme } = useTheme()
    const styles = readContentHorizontalStyles(theme)

    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

    const { pageData, startCalc, paragraphIndent } = usePageData(props.characterSizeMap, props)

    // 当前页
    const [currentPage, setCurrentPage] = useState(0)
    let w: any = window
    // 当前页的起始索引
    w.nextPage = () => {
        setCurrentPage(currentPage => currentPage + 1)
        console.log(pageData[currentPage + 1])
    }
    w.prePage = () => {
        setCurrentPage(currentPage => currentPage - 1)
        console.log(pageData[currentPage - 1])
    }

    useEffect(() => {
        startCalc(containerSize)
    }, [containerSize])

    return (
        <>
            <View style={[styles.container]}>
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
                                />
                            </>
                        )}
                    </View>
                </View>
                <ReadContentFooter />
            </View>
        </>
    )
}
