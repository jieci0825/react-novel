import React, { useRef } from 'react'
import { View, PanResponder, LayoutChangeEvent } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'
import { progressBarStyles } from './progress-bar.style'
import { useTheme } from '@/hooks/useTheme'

type ProgressBarProps = {
    value: number // 当前进度 0-1
    onChange?: (value: number) => void
    height?: number
    trackColor?: string
    progressColor?: string
    thumbColor?: string
    thumbSize?: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    onChange,
    height = 6,
    trackColor,
    progressColor,
    thumbColor,
    thumbSize = 16
}) => {
    const { theme } = useTheme()

    const styles = progressBarStyles(theme)

    const progress = useSharedValue(value)
    const containerWidth = useRef(0)

    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`
    }))

    const thumbStyle = useAnimatedStyle(() => ({
        left: `${progress.value * 100}%`
    }))

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {},
            onPanResponderMove: (_, gestureState) => {
                if (containerWidth.current === 0) return
                let newProgress = gestureState.moveX / containerWidth.current
                newProgress = Math.max(0, Math.min(1, newProgress))
                progress.value = newProgress
                if (onChange) runOnJS(onChange)(newProgress)
            }
        })
    ).current

    const handleLayout = (e: LayoutChangeEvent) => {
        containerWidth.current = e.nativeEvent.layout.width
        progress.value = withTiming(value)
    }

    return (
        <View
            style={[styles.container, { height }]}
            onLayout={handleLayout}
            {...panResponder.panHandlers}
        >
            <View style={[styles.track, { backgroundColor: trackColor || theme.progress.track }]}>
                <Animated.View
                    style={[
                        styles.progress,
                        animatedProgressStyle,
                        { backgroundColor: progressColor || theme.progress.progress }
                    ]}
                />
                <Animated.View
                    style={[
                        styles.thumb,
                        thumbStyle,
                        {
                            backgroundColor: thumbColor || theme.progress.thumb,
                            transform: [{ translateX: -thumbSize / 2 }], // thumb centered
                            width: thumbSize,
                            height: thumbSize
                        }
                    ]}
                />
            </View>
        </View>
    )
}

export default ProgressBar
