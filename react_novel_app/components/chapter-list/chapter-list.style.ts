import { Theme } from '@/hooks/useTheme'
import { adaptiveSize } from '@/utils'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

export const chapterListStyles = (theme: Theme) => {
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
            fontSize: RFValue(16),
            fontWeight: '600',
            color: theme.textPrimaryColor
        },
        content: {
            flex: 1
        },
        chapterItem: {
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        chapterItemText: {
            fontSize: RFValue(14),
            color: theme.textSecondaryColor
        },
        chapterItemActive: {
            backgroundColor: theme.bgSecondaryColor
        }
    })
}
