import { GetBookDetailsData } from '@/api/modules/book/type'
import PageSection from '@/components/page-section/page-section'
import { useTheme } from '@/hooks/useTheme'
import { detailsBookChapterStyles } from '@/styles/pages/details.style'
import { Text, View } from 'react-native'

interface BookChapterProps {
    item: GetBookDetailsData
}

export default function BookChapter(props: BookChapterProps) {
    const { theme } = useTheme()
    const styles = detailsBookChapterStyles(theme)

    const details = props.item

    const len = Math.min(details.chapters.length || 0, 5)
    const chapters = details.chapters.slice(0, len)

    return (
        <>
            <View style={styles.bookChapterWrap}>
                <PageSection title='目录' />
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
