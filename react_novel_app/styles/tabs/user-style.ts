import { Theme } from '@/hooks/useTheme'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { adaptiveSize } from '@/utils'

export const userStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.bgColor,
            flex: 1
        },
        content: {
            paddingHorizontal: 20
        }
    })
}

export const userContentStyles = (theme: Theme) => {
    return StyleSheet.create({
        userContentWrap: {
            paddingVertical: adaptiveSize(15),
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
            display: 'flex',
            flexDirection: 'row'
        },
        avatarWrap: {
            width: adaptiveSize(50),
            height: adaptiveSize(50),
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginRight: adaptiveSize(10),
            backgroundColor: theme.bgSecondaryColor
        },
        avatar: {
            width: '100%',
            height: '100%',
            borderRadius: '50%'
        },
        userInfo: {
            flex: 1,
            display: 'flex',
            overflow: 'hidden'
        },
        userName: {
            fontSize: RFValue(16),
            color: theme.primaryColor,
            fontWeight: '600'
        },
        userSign: {
            marginTop: 'auto'
        }
    })
}
