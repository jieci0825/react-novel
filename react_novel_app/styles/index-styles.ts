import { Theme } from '@/hooks/useTheme'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { adaptiveSize } from '@/utils'

export const homeStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bgColor
        }
    })
}

export const homeHeaderStyles = (theme: Theme) => {
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

export const homeContentStyles = (theme: Theme) => {
    return StyleSheet.create({
        homeContent: {
            width: '100%',
            flex: 1
        },
        homeContentInner: {
            padding: 20
        },
        emptyTips: {
            width: '100%'
        },
        emptyTipsText: {
            marginHorizontal: 'auto',
            marginTop: adaptiveSize(50),
            color: theme.textTertiaryColor,
            fontSize: RFValue(18)
        }
    })
}

export const bookGridStyles = (theme: Theme) => {
    return StyleSheet.create({
        bookRow: {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 20,
            gap: 20
        },
        bookItem: {
            display: 'flex',
            width: '30%',
            aspectRatio: 1 / 1.5
        },
        bookCover: {
            width: '100%',
            flex: 1,
            backgroundColor: theme.bgSecondaryColor,
            borderRadius: 4,
            overflow: 'hidden'
        },
        bookTitle: {
            marginTop: 5,
            fontSize: RFValue(13),
            color: theme.textSecondaryColor
        }
    })
}

export const bookListStyles = (theme: Theme) => {
    return StyleSheet.create({
        bookListWrap: {
            display: 'flex',
            gap: adaptiveSize(20)
        },
        bookItem: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row'
        },
        bookCover: {
            width: adaptiveSize(65),
            height: adaptiveSize(80),
            backgroundColor: theme.bgSecondaryColor,
            borderRadius: 4
        },
        bookInfo: {
            flex: 1,
            marginLeft: 10,
            display: 'flex'
        },
        bookTitle: {
            marginTop: 5,
            fontWeight: '500',
            color: theme.textPrimaryColor,
            fontSize: RFValue(14)
        },
        bookAuthor: {
            marginTop: 'auto',
            fontSize: RFValue(12),
            color: theme.textSecondaryColor
        },
        bookProcess: {
            marginTop: 5,
            fontSize: RFValue(12),
            color: theme.textSecondaryColor
        }
    })
}
