import { useTheme } from '@/hooks/useTheme'
import { pageHorizontalStyles } from '@/styles/pages/read.styles'
import { PageDataItem } from '@/utils'
import { FlatList, GestureResponderEvent, Text, TextStyle, TouchableOpacity, View } from 'react-native'
import { ReaderSetting } from '@/types'
import { ChapterDataItem } from './read.type'
import { RFValue } from 'react-native-responsive-fontsize'
import { useEffect, useRef } from 'react'

interface RenderPageProps {
    textStyle: TextStyle
    paragraphIndent: number
    pageList: PageDataItem[][]
    currentPage: number
    indent: number
    paragraphSpacing: number
    containerSize: { width: number; height: number }
    containerClick: (e: GestureResponderEvent) => void
}
// 无动画-水平阅读
function NoneAnimation(props: RenderPageProps) {
    const { theme } = useTheme()
    const currentPageList = props.pageList[props.currentPage]

    const fullText = Array(props.indent).fill('一').join('')

    return (
        <>
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    justifyContent: props.currentPage === props.pageList.length - 1 ? 'flex-start' : 'space-between'
                }}
            >
                {currentPageList.map((item, index) => {
                    return props.currentPage === 0 && item.isTitle ? (
                        <View
                            style={{
                                height: (props.textStyle.lineHeight as number) * 1.3 + props.paragraphSpacing * 2
                            }}
                            key={index}
                        >
                            <Text
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{
                                    ...props.textStyle,
                                    fontWeight: 'bold',
                                    fontSize: (props.textStyle.fontSize as number) * 1.1
                                }}
                            >
                                {item.content}
                            </Text>
                        </View>
                    ) : (
                        <Text
                            key={index}
                            style={[
                                props.textStyle,
                                {
                                    // 这段样式代码在真机中无效，所以采取一个曲线救国的方案。在段落文本前面填充一个空格文本，这个文本的宽度是缩进的宽度
                                    // textIndent: item.isNeedIndent ? String(props.paragraphIndent) + 'px' : '0',
                                    marginBottom:
                                        index === currentPageList.length - 1 ? 0 : props.textStyle.marginBottom
                                }
                            ]}
                        >
                            {item.isNeedIndent && (
                                <Text style={{ opacity: 0, color: 'rgba(0,0,0,0)' }}>{fullText}</Text>
                            )}
                            <Text>{item.content}</Text>
                        </Text>
                    )
                })}
            </View>
        </>
    )
}

// 滑动翻页-水平阅读
function SlideAnimation(props: RenderPageProps) {
    const { theme } = useTheme()

    const fullText = Array(props.indent).fill('一').join('')

    const flatListRef = useRef<FlatList<PageDataItem[]>>(null)

    // 跳转到指定索引的函数
    const scrollToIndex = (index: number) => {
        if (flatListRef.current && index >= 0 && index < props.pageList.length) {
            flatListRef.current.scrollToIndex({
                animated: true,
                index,
                viewPosition: 0 // 0 = 顶部, 0.5 = 中间, 1 = 底部
            })
        }
    }

    const renderItem = ({ item, index }: { item: PageDataItem[]; index: number }) => {
        const currentPageList = item
        return (
            <View
                style={{
                    width: props.containerSize.width,
                    height: props.containerSize.height,
                    overflow: 'hidden',
                    justifyContent: props.currentPage === index ? 'flex-start' : 'space-between'
                }}
            >
                {currentPageList.map((item, idx) => {
                    return props.currentPage === 0 && item.isTitle ? (
                        <View
                            style={{
                                height: (props.textStyle.lineHeight as number) * 1.3 + props.paragraphSpacing * 2
                            }}
                            key={idx}
                        >
                            <Text
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{
                                    ...props.textStyle,
                                    fontWeight: 'bold',
                                    fontSize: (props.textStyle.fontSize as number) * 1.1
                                }}
                            >
                                {item.content}
                            </Text>
                        </View>
                    ) : (
                        <Text
                            key={idx}
                            style={[
                                props.textStyle,
                                {
                                    // 这段样式代码在真机中无效，所以采取一个曲线救国的方案。在段落文本前面填充一个空格文本，这个文本的宽度是缩进的宽度
                                    // textIndent: item.isNeedIndent ? String(props.paragraphIndent) + 'px' : '0',
                                    marginBottom: idx === currentPageList.length - 1 ? 0 : props.textStyle.marginBottom
                                }
                            ]}
                        >
                            {item.isNeedIndent && (
                                <Text style={{ opacity: 0, color: 'rgba(0,0,0,0)' }}>{fullText}</Text>
                            )}
                            <Text>{item.content}</Text>
                        </Text>
                    )
                })}
            </View>
        )
    }

    useEffect(() => {
        scrollToIndex(props.currentPage)
    }, [props.currentPage])

    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onPress={e => {
                    props.containerClick(e)
                }}
                style={{ backgroundColor: 'rgba(0,0,0,0)', width: '100%', height: '100%', overflow: 'hidden' }}
            >
                <FlatList
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    ref={flatListRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
                    }}
                    renderItem={renderItem}
                    data={props.pageList}
                    horizontal={true}
                    getItemLayout={(data, index) => ({
                        length: props.containerSize.width,
                        offset: props.containerSize.width * index,
                        index
                    })}
                    initialScrollIndex={props.currentPage}
                    ListEmptyComponent={
                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    color: props.textStyle.color,
                                    fontSize: RFValue(30)
                                }}
                            >
                                空空如也~
                            </Text>
                        </View>
                    }
                ></FlatList>
            </TouchableOpacity>
        </>
    )
}

interface PageHorizontalProps {
    pageList: PageDataItem[][]
    currentPage: number
    nextPage?: () => void
    prevPage?: () => void
    textStyle: TextStyle
    paragraphIndent: number
    animation: 'slide' | 'page' | 'none' | 'simulation'
    readerSetting: ReaderSetting
    containerSize: { width: number; height: number }
    containerClick: (e: GestureResponderEvent) => void
}

export default function PageHorizontal(props: PageHorizontalProps) {
    const { theme } = useTheme()
    const styles = pageHorizontalStyles(theme)

    const contentList = props.pageList[props.currentPage]

    const showPageComp = {
        slide: (
            <SlideAnimation
                {...props}
                paragraphSpacing={props.readerSetting.paragraphSpacing}
                indent={props.readerSetting.indent}
            />
        ),
        page: <></>,
        none: (
            <NoneAnimation
                {...props}
                paragraphSpacing={props.readerSetting.paragraphSpacing}
                indent={props.readerSetting.indent}
            />
        ),
        simulation: <></>
    }

    return (
        <>
            {contentList && contentList.length > 0 && (
                <View style={[styles.contianer]}>{showPageComp[props.animation]}</View>
            )}
        </>
    )
}
