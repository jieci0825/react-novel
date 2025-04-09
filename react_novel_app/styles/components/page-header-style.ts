import { Theme } from '@/hooks/useTheme'
import { adaptiveSize } from '@/utils'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

export const pageHeaderStyles = (theme: Theme) => {
    return StyleSheet.create({
        pageHeader: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: adaptiveSize(60),
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor
        },
        headerAct: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            gap: adaptiveSize(10),
            padding: adaptiveSize(20)
        },
        pageCenter: {
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        pageCenterText: {
            color: theme.primaryColor,
            fontSize: RFValue(18)
        }
    })
}
