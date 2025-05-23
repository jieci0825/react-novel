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

export const userDataStyles = (theme: Theme) => {
    return StyleSheet.create({
        userDataWrap: {
            padding: adaptiveSize(15),
            marginBottom: adaptiveSize(10),
            display: 'flex',
            flexDirection: 'row',
            gap: adaptiveSize(10),
            justifyContent: 'space-between'
        },
        userDataItem: {
            flex: 1,
            height: adaptiveSize(45)
        },
        dataValue: {
            textAlign: 'center',
            fontSize: RFValue(18),
            color: theme.primaryColor,
            fontWeight: '600'
        },
        dataLabel: {
            textAlign: 'center',
            marginTop: 'auto',
            fontSize: RFValue(12),
            color: theme.secondaryColor
        }
    })
}

export const menuListStyles = (theme: Theme) => {
    return StyleSheet.create({
        menuWrap: {
            display: 'flex'
        },
        menuItem: {
            width: '100%',
            display: 'flex',
            height: adaptiveSize(50),
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor
        },
        menuIcon: {
            marginRight: adaptiveSize(10),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: adaptiveSize(30)
        },
        menuText: {
            fontSize: RFValue(14),
            color: theme.textPrimaryColor,
            flex: 1
        },
        menuAct: {
            marginLeft: adaptiveSize(10)
        }
    })
}
