import { ReaderSetting } from '@/types'
import { PageDataItem } from '@/utils'
import { useMemo, useRef } from 'react'
import { FlatList, GestureResponderEvent, ScrollView, Text, TextStyle, TouchableOpacity, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

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
function ScrollAnimation(props: RenderPageProps) {
    const flatListRef = useRef<FlatList<PageDataItem>>(null)

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

    const flatList = useMemo(() => {
        return props.pageList.flat(1)
    }, [props.pageList])

    const fullText = Array(props.indent).fill('一').join('')

    const renderItem = ({ item, index }: { item: PageDataItem; index: number }) => {
        return (
            <>
                {item.isTitle ? (
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
                        style={[props.textStyle]}
                    >
                        {item.isNeedIndent && <Text style={{ opacity: 0, color: 'rgba(0,0,0,0)' }}>{fullText}</Text>}
                        <Text>{item.content}</Text>
                    </Text>
                )}
            </>
        )
    }

    return (
        <>
            <FlatList
                showsVerticalScrollIndicator={false}
                ref={flatListRef}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }}
                renderItem={renderItem}
                data={flatList}
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
    animation: 'scroll'
    readerSetting: ReaderSetting
    containerSize: { width: number; height: number }
    containerClick: (e: GestureResponderEvent) => void
}

export default function PageVertical(props: PageHorizontalProps) {
    const contentList = props.pageList[props.currentPage]

    const showPageComp = {
        scroll: (
            <ScrollAnimation
                {...props}
                paragraphSpacing={props.readerSetting.paragraphSpacing}
                indent={props.readerSetting.indent}
            />
        )
    }

    return (
        <>
            {contentList && contentList.length > 0 && (
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
                    }}
                >
                    {showPageComp[props.animation]}
                </View>
            )}
        </>
    )
}
