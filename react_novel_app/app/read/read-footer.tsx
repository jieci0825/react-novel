import { useTheme } from '@/hooks/useTheme'
import { readFooterStyles } from '@/styles/pages/read.styles'
import { useEffect, useRef, useState } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
import { Slider, SliderThumb, SliderTrack, SliderFilledTrack } from '@/components/ui/slider'
import { RFValue } from 'react-native-responsive-fontsize'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { adaptiveSize } from '@/utils'
import Fontisto from '@expo/vector-icons/Fontisto'
import Feather from '@expo/vector-icons/Feather'

interface ReadFooterProps {
    isVisible: boolean
    showChapterList: () => void
    prevChapter: () => void
    nextChapter: () => void
    curChapterProgress: number
    toggleDarkMode: () => void
    openReaderSetting: () => void
}

export default function ReadFooter(props: ReadFooterProps) {
    const { theme } = useTheme()
    const styles = readFooterStyles(theme)

    const initValue = adaptiveSize(100)

    const bottomAnim = useRef(new Animated.Value(initValue)).current

    useEffect(() => {
        Animated.timing(bottomAnim, {
            toValue: props.isVisible ? 0 : initValue,
            duration: 300,
            useNativeDriver: true
        }).start()
    }, [props.isVisible])

    return (
        <>
            <Animated.View style={[styles.readFooterWrap, { transform: [{ translateY: bottomAnim }] }]}>
                <View style={styles.footerTop}>
                    <TouchableOpacity onPress={props.prevChapter}>
                        <Text style={styles.footerTopText}>上一章</Text>
                    </TouchableOpacity>
                    <View style={styles.footerTopCenter}>
                        <View style={styles.footerProgressWrap}>
                            <View
                                style={[
                                    styles.footerProgressBar,
                                    {
                                        width: `${props.curChapterProgress}%`
                                    }
                                ]}
                            ></View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={props.nextChapter}>
                        <Text style={styles.footerTopText}>下一章</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerBottom}>
                    <TouchableOpacity
                        onPress={props.showChapterList}
                        style={styles.footerBottomBtn}
                    >
                        <FontAwesome5
                            name='list'
                            size={RFValue(16)}
                            color={theme.primaryColor}
                        />
                        <Text style={styles.footerBottomBtnText}>目录</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            props.toggleDarkMode()
                        }}
                        style={styles.footerBottomBtn}
                    >
                        <Fontisto
                            name='night-clear'
                            size={RFValue(16)}
                            color={theme.primaryColor}
                        />
                        <Text style={styles.footerBottomBtnText}>夜间</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={props.openReaderSetting}
                        style={styles.footerBottomBtn}
                    >
                        <Feather
                            name='layout'
                            size={RFValue(16)}
                            color={theme.primaryColor}
                        />
                        <Text style={styles.footerBottomBtnText}>界面</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.footerBottomBtn}>
                        <Feather
                            name='settings'
                            size={RFValue(16)}
                            color={theme.primaryColor}
                        />
                        <Text style={styles.footerBottomBtnText}>设置</Text>
                    </TouchableOpacity> */}
                </View>
            </Animated.View>
        </>
    )
}
