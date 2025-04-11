import React, { useState } from 'react'
import { useToast } from '@/components/ui/toast'
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast'
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native'

interface ToastOptions {
    title?: string
    message?: string
    placement?: 'top' | 'top right' | 'top left' | 'bottom' | 'bottom left' | 'bottom right'
    duration?: number
    variant?: 'solid' | 'outline'
    action?: 'muted' | 'success' | 'error' | 'warning' | 'info'
    onCloseComplete?: () => void
    containerStyle?: StyleProp<ViewStyle>
}

interface ToastProps {
    children?: React.ReactNode
    options?: ToastOptions
}

export default function PageToast(props: ToastProps) {
    const toast = useToast()
    const [toastId, setToastId] = useState<string>('')
    const handleToast = () => {
        if (!toast.isActive(toastId)) {
            showNewToast()
        }
    }

    const optios: ToastOptions = Object.assign(
        {},
        {
            title: '提示',
            message: '这是一条提示信息',
            placement: 'top',
            duration: 3000,
            variant: 'solid',
            action: 'muted',
            onCloseComplete: () => {},
            containerStyle: {}
        },
        props.options
    )

    const showNewToast = () => {
        const newId = String(Math.random())
        setToastId(newId)
        toast.show({
            id: newId,
            placement: optios.placement,
            duration: optios.duration,
            render: ({ id }) => {
                const uniqueToastId = 'toast-' + id
                return (
                    <Toast
                        nativeID={uniqueToastId}
                        action={optios.action}
                        variant={optios.variant}
                        style={optios.containerStyle}
                    >
                        <ToastTitle>{optios.title}</ToastTitle>
                        <ToastDescription>{optios.message}</ToastDescription>
                    </Toast>
                )
            }
        })
    }
    return <TouchableOpacity onPress={handleToast}>{props.children || <Text>Press Me</Text>}</TouchableOpacity>
}
