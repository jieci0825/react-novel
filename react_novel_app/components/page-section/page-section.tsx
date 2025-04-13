import { useTheme } from '@/hooks/useTheme'
import { pageSectionStyles } from './page-section.style'
import { Text, View } from 'react-native'

interface PageSectionSlots {
    right?: Function
}

interface PageSectionProps {
    title: string
    slots?: PageSectionSlots
}
export default function PageSection(props: PageSectionProps) {
    const { theme } = useTheme()

    const styles = pageSectionStyles(theme)

    const rightComp = () => {
        if (props?.slots?.right) {
            return props.slots.right()
        }
    }

    return (
        <>
            <View style={styles.titleWrap}>
                <View style={styles.titleLeft}>
                    <View style={styles.titleBar}></View>
                    <Text style={styles.titleText}>{props.title}</Text>
                </View>
                <View style={styles.rightWrap}>{rightComp()}</View>
            </View>
        </>
    )
}
