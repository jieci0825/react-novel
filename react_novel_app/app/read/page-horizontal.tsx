import { useTheme } from '@/hooks/useTheme'
import { pageHorizontalStyles } from '@/styles/pages/read.styles'
import { PageDataItem } from '@/utils'
import { Text, TextStyle, View } from 'react-native'
import { ReaderSetting } from './read.type'

interface NoneAnimationProps {
    textStyle: TextStyle
    paragraphIndent: number
    pageList: PageDataItem[][]
    currentPage: number
    indent: number
    containerSize: { width: number; height: number }
}
// 无动画-水平阅读
function NoneAnimation(props: NoneAnimationProps) {
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
                                height:
                                    (props.textStyle.lineHeight as number) +
                                    (props.textStyle.marginBottom as number) * 2
                            }}
                            key={index}
                        >
                            <Text
                                style={{
                                    ...props.textStyle,
                                    fontWeight: 'bold',
                                    fontSize: (props.textStyle.fontSize as number) * 1.3,
                                    color: theme.textPrimaryColor
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
}

export default function PageHorizontal(props: PageHorizontalProps) {
    const { theme } = useTheme()
    const styles = pageHorizontalStyles(theme)

    const contentList = props.pageList[props.currentPage]

    const showPageComp = {
        slide: <></>,
        page: <></>,
        none: (
            <NoneAnimation
                {...props}
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
