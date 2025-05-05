import { useEffect } from 'react'
import { Text, TextStyle } from 'react-native'

interface CalcTextSizeProps {
    textStyle: TextStyle
    text: string
    onSizeInfo: (sizeInfo: { width: number; height: number }) => void
}

export default function CalcTextSize({ text, textStyle, onSizeInfo }: CalcTextSizeProps) {
    return (
        <>
            <Text
                style={[
                    textStyle,
                    {
                        opacity: 0,
                        pointerEvents: 'none',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        zIndex: -1,
                        // 测算字体的子边距需要设置为0，避免字体大小结果存在误差
                        letterSpacing: 0
                    }
                ]}
                onLayout={({ nativeEvent }) => {
                    // 获取字体宽度
                    onSizeInfo({ width: nativeEvent.layout.width, height: nativeEvent.layout.height })
                }}
            >
                {text}
            </Text>
        </>
    )
}
