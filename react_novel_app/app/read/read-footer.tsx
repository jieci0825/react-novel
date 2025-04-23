import { useTheme } from '@/hooks/useTheme'
import { readFooterStyles } from '@/styles/pages/read.styles'
import { useEffect, useRef, useState } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
import { Slider, SliderThumb, SliderTrack, SliderFilledTrack } from '@/components/ui/slider'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { RFValue } from 'react-native-responsive-fontsize'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { adaptiveSize } from '@/utils'
import Fontisto from '@expo/vector-icons/Fontisto'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'

interface ReadFooterProps {
    isVisible: boolean
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
                    <TouchableOpacity>
                        <Text style={styles.footerTopText}>上一章</Text>
                    </TouchableOpacity>
                    <View style={styles.footerTopCenter}>
                        <Slider
                            defaultValue={30}
                            size='sm'
                            orientation='horizontal'
                            isDisabled={false}
                            isReversed={false}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.footerTopText}>下一章</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footerBottom}>
                    <TouchableOpacity style={styles.footerBottomBtn}>
                        <FontAwesome5
                            name='list'
                            size={RFValue(16)}
                            color={theme.primaryColor}
                        />
                        <Text style={styles.footerBottomBtnText}>目录</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerBottomBtn}>
                        <Fontisto
                            name='night-clear'
                            size={RFValue(16)}
                            color={theme.primaryColor}
                        />
                        <Text style={styles.footerBottomBtnText}>夜间</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerBottomBtn}>
                        <Feather
                            name='layout'
                            size={RFValue(18)}
                            color={theme.primaryColor}
                        />
                        <Text style={styles.footerBottomBtnText}>界面</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerBottomBtn}>
                        <Feather
                            name='settings'
                            size={RFValue(16)}
                            color={theme.primaryColor}
                        />
                        <Text style={styles.footerBottomBtnText}>设置</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    )
}
