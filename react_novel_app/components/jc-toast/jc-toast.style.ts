import { Theme } from '@/hooks/useTheme'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

export const jcToastStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent'
        },
        toast: {
            padding: 16,
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.7)',
            maxWidth: '50%',
            opacity: 0.8,
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
        },
        text: {
            color: 'white',
            fontSize: RFValue(16)
        }
    })
}
