import { useTheme } from '@/hooks/useTheme'
import { readContentFooterStyles } from '@/styles/pages/read.styles'
import { Text, View } from 'react-native'

interface ReadContentFooterProps {
    chapterName: string
    currentPage: number
    totalPage: number
}

export default function ReadContentFooter(props: ReadContentFooterProps) {
    const { theme } = useTheme()

    const styles = readContentFooterStyles(theme)

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text}>{props.chapterName}</Text>
                <Text
                    style={[
                        styles.text,
                        {
                            marginLeft: 'auto'
                        }
                    ]}
                >
                    {props.currentPage}/{props.totalPage}
                </Text>
            </View>
        </>
    )
}
