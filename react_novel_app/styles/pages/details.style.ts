import { Theme } from '@/hooks/useTheme'
import { adaptiveSize } from '@/utils'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

export const detailsStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.bgColor,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
        },
        main: {
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 20
        }
    })
}

export const detailsBookInfoStyles = (theme: Theme) => {
    return StyleSheet.create({
        detailsBookInfoWrap: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: 10
        },
        bookCoverWrap: {
            width: adaptiveSize(100),
            height: adaptiveSize(130),
            borderRadius: 4,
            overflow: 'hidden'
        },
        bookInfoContent: {
            width: '100%',
            display: 'flex'
        },
        bookTitle: {
            fontSize: RFValue(18),
            color: theme.textPrimaryColor
        },
        bookAuthor: {
            fontSize: RFValue(14),
            marginTop: 5,
            color: theme.textSecondaryColor
        },
        bookInfoDescWrap: {
            marginTop: 20
        },
        bookInfoDescContent: {
            marginTop: 10,
            color: theme.textSecondaryColor,
            fontSize: RFValue(14)
        }
    })
}

export const detailsBookChapterStyles = (theme: Theme) => {
    return StyleSheet.create({
        bookChapterWrap: {
            width: '100%',
            marginTop: 40
        },
        bookChapterListWrap: {
            width: '100%',
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
        },
        bookChapterItem: {
            width: '100%',
            padding: 10,
            backgroundColor: theme.bgSecondaryColor,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        bookChapterItemTitle: {
            color: theme.textSecondaryColor,
            fontSize: RFValue(14)
        },
        bookChapterItemCount: {
            color: theme.textSecondaryColor,
            fontSize: RFValue(12),
            marginLeft: 'auto'
        }
    })
}

export const detailsFooterStyles = (theme: Theme) => {
    return StyleSheet.create({
        detailsFooterWrap: {
            flexShrink: 0,
            width: '100%',
            height: adaptiveSize(60),
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            borderTopWidth: 1,
            borderTopColor: theme.borderColor
        },
        detailsFooterBtn: {
            flex: 1,
            height: '100%',
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.bgSecondaryColor,
            gap: 5
        },
        leftText: {
            color: theme.textSecondaryColor,
            fontSize: RFValue(14)
        },
        right: {
            backgroundColor: theme.primaryColor
        },
        rightText: {
            fontSize: RFValue(14),
            color: theme.bgColor
        }
    })
}
