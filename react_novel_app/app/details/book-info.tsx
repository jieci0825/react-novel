import { GetBookDetailsData } from '@/api/modules/book/type'
import ImgPlus from '@/components/img-plus/img-plus'
import PageSection from '@/components/page-section/page-section'
import { useTheme } from '@/hooks/useTheme'
import { detailsBookInfoStyles } from '@/styles/pages/details.style'
import { Text, View } from 'react-native'

interface BookInfoProps {
    item: GetBookDetailsData
}

export default function BookInfo(props: BookInfoProps) {
    const { theme } = useTheme()
    const styles = detailsBookInfoStyles(theme)

    const details = props.item

    return (
        <>
            <View style={styles.detailsBookInfoWrap}>
                <View style={styles.bookCoverWrap}>
                    <ImgPlus src={details.cover} />
                </View>
                <View style={styles.bookInfoContent}>
                    <Text style={styles.bookTitle}>{details.title}</Text>
                    <Text style={styles.bookAuthor}>{details.author}</Text>
                </View>
            </View>
            <View style={styles.bookInfoDescWrap}>
                <PageSection title='简介' />
                <Text style={styles.bookInfoDescContent}>{details.description}</Text>
            </View>
        </>
    )
}
