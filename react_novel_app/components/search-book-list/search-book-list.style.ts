import { Theme } from '@/hooks/useTheme'
import { adaptiveSize } from '@/utils'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

export const searchBookListStyles = (theme: Theme) => {
    return StyleSheet.create({
        searchResultWrap: {
            width: '100%',
            padding: adaptiveSize(10),
            paddingBottom: 0
        },
        searchResultItem: {
            width: '100%',
            height: adaptiveSize(120),
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            marginBottom: 10
        },
        cover: {
            width: adaptiveSize(90),
            height: '100%',
            marginRight: 10,
            borderRadius: 4
        },
        info: {
            height: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        title: {
            color: theme.textPrimaryColor,
            fontSize: RFValue(14)
        },
        otherInfo: {
            marginTop: 'auto'
        },
        author: {
            color: theme.textSecondaryColor,
            fontSize: RFValue(12)
        },
        tags: {
            marginVertical: 4,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5
        },
        tag: {
            backgroundColor: theme.bgSecondaryColor,
            color: theme.textSecondaryColor,
            fontSize: RFValue(10),
            paddingVertical: 2,
            paddingHorizontal: 4,
            borderRadius: 4
        },
        desc: {
            color: theme.textSecondaryColor,
            fontSize: RFValue(12)
        }
    })
}

export const searchEmptyStyles = (theme: Theme) => {
    return StyleSheet.create({
        searchEmpty: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        searchEmptyText: {
            marginTop: adaptiveSize(50),
            color: theme.textTertiaryColor,
            fontSize: RFValue(18)
        }
    })
}
