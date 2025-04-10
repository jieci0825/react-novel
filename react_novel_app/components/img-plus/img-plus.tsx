import React from 'react'
import { Image, ImageStyle, StyleProp, View, ViewStyle } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useTheme } from '@/hooks/useTheme'
import { isString } from '@/utils'
import { RFValue } from 'react-native-responsive-fontsize'

interface ImageProps {
    src: string
    defaultImg?: string | React.ReactNode
    style?: StyleProp<ImageStyle | ViewStyle>
}

/**
 * @name 基于Image组件的plus版
 * @description 图片加载失败显示默认图
 */
export default function ImgPlus(props: ImageProps) {
    const { theme } = useTheme()

    const config: ImageProps = Object.assign(
        {
            defaultImg: (
                <MaterialCommunityIcons
                    style={{ margin: 'auto' }}
                    name='file-image-remove'
                    size={RFValue(32)}
                    color={theme.tertiaryColor}
                />
            )
        },
        props
    )

    // 图片加载失败
    const [hasError, setHasError] = React.useState(false)

    const imageStyles: ImageStyle[] = [{ width: '100%', height: '100%' }, config.style as ImageStyle]

    const ErrorComp = () => {
        // 如果 props.defaultImg 是字符串，则渲染图片，否则渲染组件
        if (isString(config.defaultImg)) {
            return (
                <Image
                    source={{ uri: config.defaultImg }}
                    style={imageStyles}
                />
            )
        } else {
            return <View style={config.style as ViewStyle}>{config.defaultImg}</View>
        }
    }

    return (
        <>
            {!hasError ? (
                <Image
                    source={{ uri: config.src }}
                    onError={() => setHasError(true)}
                    style={imageStyles}
                />
            ) : (
                <ErrorComp />
            )}
        </>
    )
}
