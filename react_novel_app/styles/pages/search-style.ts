import { Theme } from '@/hooks/useTheme'
import { adaptiveSize } from '@/utils'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

export const searchStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.bgColor,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        main: {
            width: '100%',
            flex: 1,
            overflowY: 'auto'
        }
    })
}

export const searchBarStyles = (theme: Theme) => {
    return StyleSheet.create({
        searchBarWrap: {
            width: '100%',
            height: adaptiveSize(60),
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10
        },
        searchBarLeft: {},
        searchBarCenter: {
            flex: 1,
            marginHorizontal: adaptiveSize(10)
        },
        searchBarRight: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: adaptiveSize(10)
        }
    })
}

export const SearchHistoryPanelStyles = (theme: Theme) => {
    return StyleSheet.create({
        searchHistoryPanel: {
            width: '100%',
            padding: 10
        },
        head: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 10
        },
        headLeft: {
            color: theme.textSecondaryColor,
            fontSize: RFValue(14)
        },
        headRight: {
            color: theme.textSecondaryColor,
            fontSize: RFValue(14),
            marginLeft: 'auto'
        },
        content: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10
        },
        item: {
            color: theme.textSecondaryColor,
            fontSize: RFValue(12),
            paddingVertical: 4,
            paddingHorizontal: 12,
            borderRadius: 20,
            backgroundColor: theme.bgSecondaryColor
        }
    })
}
