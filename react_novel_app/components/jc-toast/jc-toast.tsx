import { useTheme } from '@/hooks/useTheme'
import { Modal, Text, View } from 'react-native'
import { jcToastStyles } from './jc-toast.style'
import Entypo from '@expo/vector-icons/Entypo'
import { RFValue } from 'react-native-responsive-fontsize'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useEffect, useRef, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { isString } from '@/utils'

let toastRef: any = null

interface JcToastProps {
    type?: 'success' | 'error' | 'warning' | 'info'
    position?: 'top' | 'bottom' | 'center'
    text: string
    duration?: number
}

export const jcShowToast = (textOrOptions: JcToastProps | string) => {
    const options: JcToastProps = isString(textOrOptions) ? { text: textOrOptions } : textOrOptions
    if (toastRef) {
        toastRef.show(options)
    }
}

interface JcToastComponentProps {
    visible: boolean
    options: JcToastProps
    onDismiss: () => void
}

function JcToastComponent(props: JcToastComponentProps) {
    const { theme } = useTheme()
    const styles = jcToastStyles(theme)

    const iconSize = useRef(30).current
    const iconMap = {
        info: null,
        warning: (
            <Entypo
                name='warning'
                size={RFValue(iconSize)}
                color={theme.bgColor}
            />
        ),
        success: (
            <FontAwesome
                name='check-circle'
                size={RFValue(iconSize)}
                color={theme.bgColor}
            />
        ),
        error: (
            <AntDesign
                name='closecircle'
                size={RFValue(iconSize)}
                color={theme.bgColor}
            />
        )
    }

    useEffect(() => {
        if (props.visible) {
            const timer = setTimeout(() => {
                props.onDismiss()
            }, props.options.duration)
            return () => {
                clearTimeout(timer)
            }
        }
    }, [props.visible, props.options, props.onDismiss])

    if (!props.visible) return null

    return (
        <Modal
            transparent
            animationType='fade'
            visible={props.visible}
        >
            <View style={styles.container}>
                <View style={styles.toast}>
                    {iconMap[props.options.type!]}
                    <Text style={styles.text}>{props.options.text}</Text>
                </View>
            </View>
        </Modal>
    )
}

export default function JcToast() {
    const [isVisible, setVisible] = useState(false)
    const [options, setOptions] = useState<JcToastProps>({
        type: 'success',
        position: 'top',
        text: '这是一个 toast',
        duration: 2000
    })

    useEffect(() => {
        toastRef = {
            show: (opts: JcToastProps) => {
                // 设置 options
                setOptions({
                    ...options,
                    ...opts
                })
                setVisible(true)
            },
            hide: () => {
                setVisible(false)
            }
        }

        return () => {
            toastRef = null
        }
    }, [])

    return (
        <JcToastComponent
            options={options}
            visible={isVisible}
            onDismiss={() => setVisible(false)}
        />
    )
}
