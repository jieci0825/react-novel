import { useTheme } from '@/hooks/useTheme'
import { pageHorizontalStyles } from '@/styles/pages/read.styles'
import { PageDataItem } from '@/utils'
import { Text, TextStyle, View } from 'react-native'

interface PageHorizontalProps {
    pageList: PageDataItem[][]
    currentPage: number
    setCurrentPage: (page: number) => void
    nextPage?: () => void
    prevPage?: () => void
    textStyle: TextStyle
    paragraphIndent: number
}

export default function PageHorizontal(props: PageHorizontalProps) {
    const { theme } = useTheme()
    const styles = pageHorizontalStyles(theme)

    const contentList = props.pageList[props.currentPage]

    return (
        <>
            {contentList && contentList.length > 0 && (
                <View style={styles.contianer}>
                    {contentList.map((item, index) => {
                        return (
                            <Text
                                style={[
                                    props.textStyle,
                                    {
                                        textIndent: item.isNeedIndent ? String(props.paragraphIndent) + 'px' : '0',
                                        // 取消最后一段的段间距
                                        marginBottom:
                                            index === contentList.length - 1 ? 0 : props.textStyle.marginBottom
                                    }
                                ]}
                                key={index}
                            >
                                {item.content}
                            </Text>
                        )
                    })}
                </View>
            )}
        </>
    )
}
