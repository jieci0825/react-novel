import { useTheme } from '@/hooks/useTheme'
import { readContentFooterStyles } from '@/styles/pages/read.styles'
import { Text, View } from 'react-native'

export default function ReadContentFooter() {
    const { theme } = useTheme()

    const styles = readContentFooterStyles(theme)

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text}>第一章：陨落的天才</Text>
                <Text
                    style={[
                        styles.text,
                        {
                            marginLeft: 'auto'
                        }
                    ]}
                >
                    1/21
                </Text>
                <Text
                    style={[
                        styles.text,
                        {
                            marginLeft: 10
                        }
                    ]}
                >
                    1.12%
                </Text>
            </View>
        </>
    )
}
