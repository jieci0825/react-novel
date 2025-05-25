import { Theme } from '@/hooks/useTheme'
import { StyleSheet } from 'react-native'

export const progressBarStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            justifyContent: 'center',
            width: '100%'
        },
        track: {
            borderRadius: 999,
            justifyContent: 'center'
        },
        progress: {
            height: '100%',
            borderRadius: 999
        },
        thumb: {
            position: 'absolute',
            borderRadius: '50%'
        }
    })
}
