import { FlatList, PixelRatio, Text, useWindowDimensions, View } from 'react-native'
import { CharacterSizeMap, ReadContentBase } from './read.type'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { readContentHorizontalStyles } from '@/styles/pages/read.styles'
import { isArray, isChineseChar, splitTextByLine } from '@/utils'
import processContentPage from '@/utils/process-content-page'

// 根据缓存的字符 size，来计算当前章节的分页数据
function usePageData(characterSizeMap: CharacterSizeMap, props: ReadContentBase) {
    interface PageDataItem {
        isNeedIndent: boolean
        content: string
    }

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

        console.log(result)

        // const result = []

        // for (const key in context.pageData) {
        //     const content = context.pageData[key]
        //     const idx = +key - 1
        //     result[idx] = content
        // }

        // setPageData(result)
    }

    return { startCalc, paragraphIndent, pageData }
}

export default function ReadContentHorizontal(props: ReadContentBase) {
    const { theme } = useTheme()
    const styles = readContentHorizontalStyles(theme)

    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

    const { pageData, startCalc, paragraphIndent } = usePageData(props.characterSizeMap, props)

    useEffect(() => {
        startCalc(containerSize)
    }, [containerSize])

    const { width: screenWidth, height: screenHeight } = useWindowDimensions()

    const renderPage = ({ item }: { item: string[] }) => {
        return (
            <View
                style={{
                    width: screenWidth - props.readSetting.paddingHorizontal * 2,
                    backgroundColor: 'red',
                    justifyContent: 'space-between'
                }}
            >
                {item.map((content, index) => {
                    return (
                        <Text
                            selectable={true}
                            key={index}
                            style={[
                                styles.contentText,
                                props.dynamicTextStyles,
                                {
                                    textIndent: `${paragraphIndent}px`,
                                    marginBottom: index === item.length - 1 ? 0 : props.dynamicTextStyles.marginBottom
                                }
                            ]}
                        >
                            {content}
                        </Text>
                    )
                })}
            </View>
        )
    }

    return (
        <>
            <View
                style={[
                    styles.container,
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
                    {/* <FlatList
                        style={{
                            height: '100%'
                        }}
                        horizontal={true}
                        data={pageData}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate='fast'
                        keyExtractor={(_, index) => String(index)}
                        renderItem={renderPage}
                    /> */}
                </View>
            </View>
        </>
    )
}
