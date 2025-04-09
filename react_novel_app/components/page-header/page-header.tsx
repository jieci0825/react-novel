import { pageHeaderStyles } from '@/styles/components/page-header-style'
import { useTheme } from '@/hooks/useTheme'
import React from 'react'
import { Text, View } from 'react-native'

interface PageHeaderSlots {
    left?: Function
    right?: Function
}
interface PageHeaderProps {
    slots?: PageHeaderSlots
    title: string
}
function PageHeader(props: PageHeaderProps) {
    const { theme } = useTheme()

    const styles = pageHeaderStyles(theme)

    const leftComp = () => {
        if (props.slots?.left) {
            return props.slots.left()
        }
    }

    const rightComp = () => {
        if (props.slots?.right) {
            return props.slots.right()
        }
    }

    return (
        <>
            <View style={[styles.pageHeader]}>
                <View style={[styles.headerAct]}>{leftComp()}</View>
                <View style={styles.pageCenter}>
                    <Text style={styles.pageCenterText}>{props.title}</Text>
                </View>
                <View style={[styles.headerAct]}>{rightComp()}</View>
            </View>
        </>
    )
}

export default PageHeader
