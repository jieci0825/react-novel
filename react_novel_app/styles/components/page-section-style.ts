import { Theme } from '@/hooks/useTheme'
import { adaptiveSize } from '@/utils'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

export const pageSectionStyles = (theme: Theme) => {
    return StyleSheet.create({
        titleWrap: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: adaptiveSize(20)
        },
        titleLeft: {
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        titleBar: {
            width: adaptiveSize(3),
            height: '100%',
            backgroundColor: theme.primaryColor,
            marginRight: 8
        },
        titleText: {
            color: theme.primaryColor,
            fontSize: RFValue(16)
        },
        rightWrap: {
            marginLeft: 20
        }
    })
}
