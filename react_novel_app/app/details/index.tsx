import PageHeader from '@/components/page-header/page-header'
import { useTheme } from '@/hooks/useTheme'
import { detailsStyles } from '@/styles/pages/details.style'
import { router, useLocalSearchParams } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { RFValue } from 'react-native-responsive-fontsize'
import BookInfo from './book-info'
import { useEffect, useState } from 'react'
import { bookApi } from '@/api'
import { GetBookDetailsData } from '@/api/modules/book/type'
import BookChapter from './book-chapter'
import DetailsFooter from './details-footer'

export default function DetailsPage() {
    const { theme } = useTheme()
    const styles = detailsStyles(theme)

    const params = useLocalSearchParams()
    // 书籍详情
    const [details, setDetails] = useState<GetBookDetailsData | null>(null)

    useEffect(() => {
        bookApi
            .reqGetBookDetails({
                bookId: params.bid as string,
                _source: +params.source
            })
            .then(res => {
                setDetails(res.data)
            })
    }, [])

    const toBack = () => {
        const canGoBack = router.canGoBack()
        // 检测是否存在可以返回的页面，不存在则返回发现页
        if (!canGoBack) {
            router.navigate('/discover')
        } else {
            router.back()
        }
    }

    const slots = {
        left: () => (
            <TouchableOpacity onPress={toBack}>
                <AntDesign
                    name='left'
                    size={RFValue(22)}
                    color={theme.primaryColor}
                />
            </TouchableOpacity>
        )
    }

    return (
        <>
            <View style={styles.container}>
                <PageHeader
                    slots={slots}
                    title='书籍详情'
                />
                <View style={styles.main}>
                    {details && <BookInfo item={details} />}
                    {details && <BookChapter item={details} />}
                </View>
                <DetailsFooter />
            </View>
        </>
    )
}
