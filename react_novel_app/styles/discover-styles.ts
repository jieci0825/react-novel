import { Theme } from '@/hooks/useTheme'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { adaptiveSize } from '@/utils'

export const discoverStyles = (theme: Theme) => {
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

export const discoverHeaderStyles = (theme: Theme) => {
    return StyleSheet.create({
        homeIconBox: {
            padding: 4,
            borderRadius: 4
        },
        homeIconBoxActive: {
            backgroundColor: theme.bgSecondaryColor
        }
    })
}

export const discoverCategoryStyles = (theme: Theme) => {
    return StyleSheet.create({
        categoryWrap: {
            marginTop: 15,
            height: adaptiveSize(70),
            overflow: 'hidden'
        },
        categoryIcon: {
            borderColor: theme.borderColor,
            padding: adaptiveSize(20),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        categoryIconText: {
            marginTop: 5,
            color: theme.tertiaryColor,
            fontSize: RFValue(12)
        }
    })
}

export const discoverBookHotRankStyles = (theme: Theme) => {
    const size = adaptiveSize(25)
    return StyleSheet.create({
        bookRankWrap: {
            marginTop: 20,
            width: '100%'
        },
        rankWrap: {
            marginTop: 15,
            display: 'flex',
            gap: adaptiveSize(10)
        },
        rankItem: {
            height: adaptiveSize(58),
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: adaptiveSize(10),
            backgroundColor: theme.bgSecondaryColor,
            borderRadius: adaptiveSize(4)
        },
        rankSN: {
            flexShrink: 0,
            backgroundColor: theme.primaryColor,
            width: size,
            height: size,
            borderRadius: '50%',
            marginRight: 10,
            color: theme.bgColor,
            textAlign: 'center',
            lineHeight: size,
            fontSize: RFValue(14)
        },
        rankInfo: {
            flex: 1,
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between'
        },
        rankInfoTitle: {
            color: theme.primaryColor,
            fontSize: RFValue(14),
            fontWeight: 'bold'
        },
        rankInfoAuthor: {
            color: theme.tertiaryColor,
            fontSize: RFValue(12)
        },
        rankRight: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        rankInfoCount: {
            color: theme.tertiaryColor,
            fontSize: RFValue(14)
        }
    })
}
