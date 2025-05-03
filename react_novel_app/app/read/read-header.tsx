import { useTheme } from '@/hooks/useTheme'
import { readHeaderStyles } from '@/styles/pages/read.styles'
import { adaptiveSize } from '@/utils'
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

interface ReadHeaderProps {
    isVisible: boolean
    bookName: string
    chapterName: string
}

export default function ReadHeader(props: ReadHeaderProps) {
    const { theme } = useTheme()
    const styles = readHeaderStyles(theme)

    const initValue = adaptiveSize(70)

    // 初始位置在屏幕上方之外
    const topAnim = useRef(new Animated.Value(-initValue)).current

    useEffect(() => {
        Animated.timing(topAnim, {
            toValue: props.isVisible ? 0 : -initValue,
            duration: 300,
            useNativeDriver: true
        }).start()
    }, [props.isVisible])

    const toBack = () => {
        const canGoBack = router.canGoBack()
        // 检测是否存在可以返回的页面，不存在则返回发现页
        if (!canGoBack) {
            router.navigate('/discover')
        } else {
            router.back()
        }
    }

    return (
        <>
            <Animated.View style={[styles.readHeaderWrap, { transform: [{ translateY: topAnim }] }]}>
                <TouchableOpacity
                    onPress={toBack}
                    style={styles.backBtn}
                >
                    <AntDesign
                        name='arrowleft'
                        size={RFValue(24)}
                        color={theme.primaryColor}
                    />
                </TouchableOpacity>
                <View>
                    <Text style={styles.bookName}>{props.bookName}</Text>
                    <Text style={styles.chapterName}>{props.chapterName}</Text>
                </View>
                <View style={styles.readHeaderRight}>
                    <FontAwesome
                        name='refresh'
                        size={RFValue(20)}
                        color={theme.primaryColor}
                    />
                    <FontAwesome5
                        name='random'
                        size={RFValue(20)}
                        color={theme.primaryColor}
                    />
                </View>
            </Animated.View>
        </>
    )
}
