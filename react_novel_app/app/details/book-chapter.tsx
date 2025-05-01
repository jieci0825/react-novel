import { GetBookDetailsData } from '@/api/modules/book/type'
import PageSection from '@/components/page-section/page-section'
import { useTheme } from '@/hooks/useTheme'
import { detailsBookChapterStyles } from '@/styles/pages/details.style'
import { Text, TouchableOpacity, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

interface BookChapterProps {
    item: GetBookDetailsData
    onMoreChapter: () => void
}

export default function BookChapter(props: BookChapterProps) {
    const { theme } = useTheme()
    const styles = detailsBookChapterStyles(theme)

    const details = props.item

    const len = Math.min(details.chapters.length || 0, 5)
    const chapters = details.chapters.slice(0, len)

    const slots = {
        right: () => {
            return (
                <TouchableOpacity onPress={props.onMoreChapter}>
                    <Text
                        style={{
                            fontSize: RFValue(12),
                            color: theme.textSecondaryColor
                        }}
                    >
                        更多目录
                    </Text>
                </TouchableOpacity>
            )
        }
    }

    return (
        <>
            <View style={styles.bookChapterWrap}>
                <PageSection
                    title='目录'
                    slots={slots}
                />
                <View style={styles.bookChapterListWrap}>
                    {chapters.map(item => {
                        return (
                            <View
                                style={styles.bookChapterItem}
                                key={item.chapterId}
                            >
                                <Text style={styles.bookChapterItemTitle}>{item.chapterName}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        </>
    )
}
