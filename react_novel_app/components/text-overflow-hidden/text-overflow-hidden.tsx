import { useTheme } from '@/hooks/useTheme'
import { textOverflowHiddenStyles } from '@/styles/components/text-overflow-hidden-style'
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

interface TextOverflowHiddenProps {
    children: React.ReactNode
    line?: number
    style?: StyleProp<ViewStyle>
    fontStyle?: StyleProp<TextStyle>
    color?: string
    fontSize?: number
}

export default function TextOverflowHidden({
    children,
    line = 1,
    style,
    fontStyle,
    color,
    fontSize
}: TextOverflowHiddenProps) {
    const styles = textOverflowHiddenStyles()
    const { theme } = useTheme()

    return (
        <View style={[styles.textOverflowHiddenWrap, style]}>
            <Text
                numberOfLines={line}
                ellipsizeMode='tail'
                style={[{ color: color || theme.secondaryColor, fontSize: fontSize || RFValue(14) }, fontStyle]}
            >
                {children}
            </Text>
        </View>
    )
}
