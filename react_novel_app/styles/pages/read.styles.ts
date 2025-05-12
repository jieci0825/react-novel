import { Theme } from '@/hooks/useTheme'
import { adaptiveSize } from '@/utils'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

export const readStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.bgColor,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        },
        main: {
            flex: 1,
            overflow: 'hidden'
        }
    })
}

export const readHeaderStyles = (theme: Theme) => {
    return StyleSheet.create({
        readHeaderWrap: {
            width: '100%',
            height: adaptiveSize(60),
            position: 'absolute',
            left: 0,
            top: 0,
            backgroundColor: theme.bgColor,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            zIndex: 1
        },
        backBtn: {
            marginRight: 20
        },
        bookName: {
            fontSize: RFValue(14),
            color: theme.textPrimaryColor,
            fontWeight: '600'
        },
        chapterName: {
            marginTop: 2,
            fontSize: RFValue(12),
            color: theme.textSecondaryColor
        },
        readHeaderRight: {
            marginLeft: 'auto',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20
        }
    })
}

export const readFooterStyles = (theme: Theme) => {
    return StyleSheet.create({
        readFooterWrap: {
            width: '100%',
            height: adaptiveSize(100),
            position: 'absolute',
            left: 0,
            bottom: 0,
            backgroundColor: theme.bgColor,
            borderTopWidth: 1,
            borderTopColor: theme.borderColor,
            paddingHorizontal: 20,
            paddingVertical: 10,
            gap: adaptiveSize(10),
            justifyContent: 'space-between',
            zIndex: 1
        },
        footerTop: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
            gap: adaptiveSize(20)
        },
        footerTopText: {
            fontSize: RFValue(14),
            color: theme.textPrimaryColor
        },
        footerTopCenter: {
            flex: 1
        },
        footerBottom: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            width: '100%'
        },
        footerBottomBtn: {
            alignItems: 'center'
        },
        footerBottomBtnText: {
            color: theme.textPrimaryColor,
            fontSize: RFValue(12),
            marginTop: 2
        }
    })
}

export const readChapterListStyles = (theme: Theme) => {
    return StyleSheet.create({
        readChapterListWrap: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: theme.bgColor,
            zIndex: 1000
        },
        header: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            height: adaptiveSize(60),
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor
        },
        title: {
            fontSize: RFValue(18),
            fontWeight: '600',
            color: theme.textPrimaryColor
        },
        content: {
            flex: 1,
            paddingHorizontal: 10
        },
        chapterItem: {
            paddingVertical: 10
        },
        chapterItemText: {
            fontSize: RFValue(14),
            color: theme.textSecondaryColor
        }
    })
}

export const readContentHorizontalStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: 'blue'
        },
        containerWrap: {
            width: '100%',
            flex: 1
        },
        containerInner: {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'yellow'
        },
        contentText: {
            textIndent: '1px'
        }
    })
}

export const readContentFooterStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            height: adaptiveSize(30),
            paddingHorizontal: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: theme.textTertiaryColor,
            backgroundColor: 'orange'
        },
        text: {
            color: theme.textSecondaryColor,
            fontSize: RFValue(12)
        }
    })
}

export const pageHorizontalStyles = (theme: Theme) => {
    return StyleSheet.create({
        contianer: {
            width: '100%',
            height: '100%',
            justifyContent: 'space-between'
        }
    })
}
