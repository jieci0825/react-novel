import { useTheme } from '@/hooks/useTheme'
import { pageHorizontalStyles } from '@/styles/pages/read.styles'
import { PageDataItem } from '@/utils'
import { Text, TextStyle, View } from 'react-native'

interface NoneAnimationProps {
    textStyle: TextStyle
    paragraphIndent: number
    pageList: PageDataItem[][]
    currentPage: number
}
// 无动画-水平阅读
function NoneAnimation(props: NoneAnimationProps) {
    const { theme } = useTheme()
    const currentPageList = props.pageList[props.currentPage]

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
                                    textIndent: item.isNeedIndent ? String(props.paragraphIndent) + 'px' : '0',
                                    marginBottom:
                                        index === currentPageList.length - 1 ? 0 : props.textStyle.marginBottom
                                }
                            ]}
                        >
                            {item.content}
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
}

export default function PageHorizontal(props: PageHorizontalProps) {
    const { theme } = useTheme()
    const styles = pageHorizontalStyles(theme)

    const contentList = props.pageList[props.currentPage]

    const showPageComp = {
        slide: <></>,
        page: <></>,
        none: <NoneAnimation {...props} />,
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
