import { useTheme } from '@/hooks/useTheme'
import { readStyles } from '@/styles/pages/read.styles'
import { Animated, Button, Text, View } from 'react-native'
import ReadHeader from './read-header'
import { useRef, useState } from 'react'
import ReadFooter from './read-footer'

export default function ReadPage() {
    const { theme } = useTheme()
    const styles = readStyles(theme)

    const [isVisible, setIsVisible] = useState(false)

    const [curChapterProgress, setCurChapterProgress] = useState(0)

    return (
        <>
            <View style={[styles.container]}>
                <ReadHeader isVisible={isVisible} />
                <View
                    style={{
                        marginTop: 200
                    }}
                >
                    <Button
                        onPress={() => setIsVisible(!isVisible)}
                        title='切换'
                    ></Button>
                </View>
                <ReadFooter isVisible={isVisible} />
            </View>
        </>
    )
}
