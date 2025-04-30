import PageHeader from '@/components/page-header/page-header'
import { useTheme } from '@/hooks/useTheme'
import { detailsStyles } from '@/styles/pages/details.style'
import { RelativePathString, router, useLocalSearchParams } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { RFValue } from 'react-native-responsive-fontsize'
import BookInfo from './book-info'
import { useEffect, useState } from 'react'
import { bookApi } from '@/api'
import { GetBookDetailsData } from '@/api/modules/book/type'
import BookChapter from './book-chapter'
import DetailsFooter from './details-footer'
import ChapterList from '@/components/chapter-list/chapter-list'

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
            .catch(err => {})
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

    const toRead = () => {
        router.push({
            pathname: '/read' as RelativePathString,
            params: {
                bid: params.bid,
                source: params.source,
                c_sn: '1'
            }
        })
    }

    const addBookShelf = () => {
        console.log('加入书架')
    }

    // 目录的显示与隐藏
    const [isChapterListVisible, setIsChapterListVisible] = useState(false)
    const onMoreChapter = () => {
        setIsChapterListVisible(true)
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
                    {details && (
                        <BookChapter
                            onMoreChapter={onMoreChapter}
                            item={details}
                        />
                    )}
                </View>
                <DetailsFooter
                    toRead={toRead}
                    addBookShelf={addBookShelf}
                />
                <ChapterList
                    isVisible={isChapterListVisible}
                    chaperList={details?.chapters || []}
                    closeChapterList={() => setIsChapterListVisible(false)}
                />
            </View>
        </>
    )
}
