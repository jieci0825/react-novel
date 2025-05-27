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
            overflow: 'hidden',
            position: 'relative'
        },
        portionMask: {
            position: 'fixed',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'row'
        },
        portionMaskTextWrap: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        portionMaskTextWrapCenter: {
            borderLeftWidth: 2,
            borderRightWidth: 2,
            borderLeftColor: '#b3aeae',
            borderRightColor: '#b3aeae'
        },
        portionMaskText: {
            color: theme.bgColor,
            fontSize: RFValue(20),
            textAlign: 'center'
        },
        menuMask: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            zIndex: 10,
            opacity: 0
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
            zIndex: 2
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
            zIndex: 2
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
        footerProgressWrap: {
            width: '100%',
            height: adaptiveSize(8),
            borderRadius: 999,
            overflow: 'hidden',
            backgroundColor: theme.progress.track
        },
        footerProgressBar: {
            height: adaptiveSize(8),
            backgroundColor: theme.progress.progress,
            borderRadius: 999
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

export const readContentWrapStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            height: '100%'
        },
        containerWrap: {
            width: '100%',
            flex: 1
        },
        containerInner: {
            width: '100%',
            flex: 1,
            overflow: 'hidden'
        },
        contentText: {}
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
            borderTopColor: theme.textTertiaryColor
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
            display: 'flex',
            flexDirection: 'row'
        },
        containerInner: {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            justifyContent: 'space-between'
        }
    })
}

export const readerSettingCompStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            position: 'absolute',
            zIndex: 2000,
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: adaptiveSize(10)
        },
        containerInner: {
            position: 'absolute',
            zIndex: 2001,
            top: '40%',
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: theme.bgColor,
            overflow: 'hidden',
            borderTopColor: theme.borderColor,
            borderTopWidth: 1
        },
        controlItem: {
            paddingVertical: adaptiveSize(10),
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor
        },
        controlItemHead: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: adaptiveSize(5)
        },
        controlItemHeadText: {
            fontSize: RFValue(14),
            color: theme.textPrimaryColor
        },
        controlItemBody: {
            marginTop: adaptiveSize(10),
            gap: adaptiveSize(6)
        },
        controlItemBodyItem: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        controlItemBodyItemText: {
            fontSize: RFValue(12),
            color: theme.textSecondaryColor
        },
        controlItemBodyItemOperation: {
            marginLeft: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            gap: adaptiveSize(4)
        },
        controlItemBodyItemOperationBtn: {
            width: adaptiveSize(25),
            height: adaptiveSize(25),
            borderRadius: adaptiveSize(4),
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme.borderColor,
            borderWidth: 1
        },
        controlItemBodyItemOperationValue: {
            width: adaptiveSize(60),
            height: adaptiveSize(25),
            borderRadius: adaptiveSize(4),
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme.borderColor,
            borderWidth: 1,
            textAlign: 'center',
            lineHeight: adaptiveSize(25),
            color: theme.textSecondaryColor
        },
        controlItemBtnsBody: {
            marginTop: adaptiveSize(10),
            flexDirection: 'row',
            alignItems: 'center',
            gap: adaptiveSize(10)
        },
        controlItemBtnsBodyBtn: {
            width: adaptiveSize(60),
            height: adaptiveSize(30),
            borderRadius: adaptiveSize(4),
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme.borderColor,
            borderWidth: 1
        },
        controlItemBtnsBodyBtnText: {
            fontSize: RFValue(12),
            color: theme.textSecondaryColor
        },
        controlItemBgBody: {
            gap: adaptiveSize(10),
            marginTop: adaptiveSize(10),
            paddingBottom: adaptiveSize(10)
        },
        controlItemBgItemBody: {
            width: adaptiveSize(70),
            borderRadius: adaptiveSize(4),
            justifyContent: 'center',
            alignItems: 'center',
            gap: adaptiveSize(2),
            borderColor: theme.borderColor,
            borderWidth: 1,
            marginRight: adaptiveSize(10),
            paddingVertical: 5
        },
        controlItemBgItemBodyPreview: {
            width: '50%',
            height: adaptiveSize(20),
            borderRadius: adaptiveSize(4),
            borderColor: theme.borderColor,
            borderWidth: 1,
            backgroundColor: 'red'
        },
        controlItemBgItemBodyText: {
            fontSize: RFValue(10),
            color: theme.textSecondaryColor,
            textAlign: 'center'
        }
    })
}
