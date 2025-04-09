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

export const discoverTitlteStyles = (theme: Theme) => {
    return StyleSheet.create({
        titleText: {
            color: theme.primaryColor,
            fontSize: RFValue(16)
        },
        viewMoreWrap: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        viewMoreText: {
            color: theme.tertiaryColor,
            fontSize: RFValue(12),
            marginLeft: adaptiveSize(5)
        }
    })
}

export const discoverBookRankStyles = (theme: Theme) => {
    return StyleSheet.create({
        bookRankWrap: {
            marginTop: 20,
            width: '100%'
        },
        bookRankItem: {}
    })
}
