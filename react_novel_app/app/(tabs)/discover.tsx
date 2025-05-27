import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import {
    discoverBookHotRankStyles,
    discoverCategoryStyles,
    discoverFAQStyles,
    discoverMainRecommendStyles,
    discoverStyles
} from '@/styles/tabs/discover.style'
import { useTheme } from '@/hooks/useTheme'
import Feather from '@expo/vector-icons/Feather'
import { RFValue } from 'react-native-responsive-fontsize'
import { bookRecommendApi, bookStoreApi } from '@/api'
import React, { useEffect, useState } from 'react'
import { BookCategoryItem, FAQItem, HotRankingItem } from '@/api/modules/book-store/type'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import AntDesign from '@expo/vector-icons/AntDesign'
import PageHeader from '@/components/page-header/page-header'
import PageSection from '@/components/page-section/page-section'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { BookRecommendItem } from '@/api/modules/book-recommend/type'
import TextOverflowHidden from '@/components/text-overflow-hidden/text-overflow-hidden'
import ImgPlus from '@/components/img-plus/img-plus'
import { RelativePathString, router } from 'expo-router'

// 头部
function DiscoverHeader() {
    const { theme } = useTheme()

    const toSearch = () => {
        router.push({ pathname: '/search' as RelativePathString })
    }

    const slots = {
        left: () => (
            <TouchableOpacity onPress={toSearch}>
                <Feather
                    name='search'
                    size={RFValue(22)}
                    color={theme.tertiaryColor}
                />
            </TouchableOpacity>
        ),
        right: () => (
            <FontAwesome6
                name='filter'
                size={RFValue(18)}
                color={theme.tertiaryColor}
            />
        )
    }

    return (
        <>
            <PageHeader
                title='发现书籍'
                slots={slots}
            />
        </>
    )
}

interface CategoryIconProps {
    name: string
}
// 分类icon
function CategoryIcon(props: CategoryIconProps) {
    const { theme } = useTheme()

    const size = 22

    switch (props.name) {
        case '玄幻':
            return (
                <FontAwesome6
                    name='ghost'
                    size={RFValue(size)}
                    color={theme.tertiaryColor}
                />
            )
        case '武侠':
            return (
                <FontAwesome5
                    name='user-secret'
                    size={RFValue(size)}
                    color={theme.tertiaryColor}
                />
            )
        case '都市':
            return (
                <FontAwesome6
                    name='mountain-city'
                    size={RFValue(size)}
                    color={theme.tertiaryColor}
                />
            )
        case '历史':
            return (
                <FontAwesome5
                    name='scroll'
                    size={RFValue(size)}
                    color={theme.tertiaryColor}
                />
            )
        case '科幻':
            return (
                <FontAwesome5
                    name='brain'
                    size={RFValue(size)}
                    color={theme.tertiaryColor}
                />
            )
        case '言情':
            return (
                <AntDesign
                    name='heart'
                    size={RFValue(size)}
                    color={theme.tertiaryColor}
                />
            )
        case '系统':
            return (
                <FontAwesome6
                    name='microchip'
                    size={RFValue(size)}
                    color={theme.tertiaryColor}
                />
            )
        case '种田':
            return (
                <FontAwesome5
                    name='seedling'
                    size={RFValue(size)}
                    color={theme.tertiaryColor}
                />
            )
        default:
            return (
                <FontAwesome5
                    name='book'
                    size={RFValue(size)}
                    color={theme.tertiaryColor}
                />
            )
    }
}

// 分类列表
function DiscoverCategory() {
    const { theme } = useTheme()

    const styles = discoverCategoryStyles(theme)

    // 分类列表
    const [categoryList, setCategoryList] = useState<BookCategoryItem[]>([])

    useEffect(() => {
        bookStoreApi.reqGetBookCategoryList().then(res => {
            setCategoryList(res.data)
        })
    }, [])

    return (
        <>
            <View style={styles.categoryWrap}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                >
                    {categoryList.map(item => {
                        return (
                            <View
                                style={styles.categoryIcon}
                                key={item.id}
                            >
                                <CategoryIcon name={item.categoryName} />
                                <Text style={styles.categoryIconText}>{item.categoryName}</Text>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        </>
    )
}

// 热榜
function DiscoverHotRank() {
    const { theme } = useTheme()

    const styles = discoverBookHotRankStyles(theme)

    // 热度榜单
    const [hotList, setHotList] = useState<HotRankingItem[]>([])

    useEffect(() => {
        bookStoreApi.reqGetBookHotList().then(res => {
            setHotList(res.data)
        })
    }, [])

    const toSearch = (item: HotRankingItem) => {
        router.push({
            pathname: '/search',
            params: {
                bookName: item.bookName
            }
        })
    }

    return (
        <View style={styles.bookRankWrap}>
            <PageSection title='本站热榜' />
            {/* rank list */}
            <View style={styles.rankWrap}>
                {hotList.map((hot, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => toSearch(hot)}
                        >
                            <View style={styles.rankItem}>
                                <View style={styles.rankSN}>
                                    <Text style={styles.rankSNText}>{index + 1}</Text>
                                </View>
                                <View style={styles.rankInfo}>
                                    <Text style={styles.rankInfoTitle}>{hot.bookName}</Text>
                                    <Text style={styles.rankInfoAuthor}>{hot.bookAuthor}</Text>
                                </View>
                                <View style={styles.rankRight}>
                                    <MaterialCommunityIcons
                                        name='fire'
                                        size={RFValue(20)}
                                        color={theme.tertiaryColor}
                                    />
                                    <Text style={styles.rankInfoCount}>{hot.accessCount}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

// 站主推荐
function MainRecommend() {
    const { theme } = useTheme()

    const styles = discoverMainRecommendStyles(theme)

    // 站主推荐书籍
    const [mainRecommendList, setMainRecommendList] = useState<BookRecommendItem[]>([])

    useEffect(() => {
        bookRecommendApi.reqGetMainBookRecommendList().then(res => {
            setMainRecommendList(res.data)
        })
    }, [])

    const toSearch = (item: BookRecommendItem) => {
        router.push({
            pathname: '/search',
            params: {
                bookName: item.bookName
            }
        })
    }

    return (
        <>
            <View style={styles.recommendWrap}>
                <PageSection title='站主推荐' />
                <View style={styles.recommendContent}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.recommendItemWrap}>
                            {mainRecommendList.map(item => {
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => toSearch(item)}
                                    >
                                        <View style={styles.recommendItem}>
                                            <ImgPlus
                                                src={item.bookCover}
                                                style={styles.cover}
                                            />
                                            <TextOverflowHidden
                                                fontStyle={{
                                                    fontSize: RFValue(13),
                                                    color: theme.tertiaryColor,
                                                    textAlign: 'center'
                                                }}
                                                style={styles.title}
                                            >
                                                {item.bookName}
                                            </TextOverflowHidden>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </>
    )
}

// 常见问题
function DiscoverFAQ() {
    const { theme } = useTheme()

    const styles = discoverFAQStyles(theme)

    const [faqList, setFaqList] = useState<FAQItem[]>([])

    useEffect(() => {
        bookStoreApi.reqGetBookFAQ().then(res => {
            setFaqList(res.data)
        })
    }, [])

    return (
        <View style={styles.faqWrap}>
            <PageSection title='常见问题' />
            <View style={styles.fagContent}>
                {faqList.map(faq => {
                    return (
                        <View key={faq.id}>
                            <Text style={styles.fagTitle}>{faq.question}</Text>
                            <Text style={styles.fagText}>{faq.answer}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

// 容器
export default function Discover() {
    const { theme } = useTheme()

    const styles = discoverStyles(theme)

    return (
        <>
            <View style={styles.container}>
                <DiscoverHeader />
                <ScrollView style={styles.content}>
                    <DiscoverCategory />
                    <DiscoverHotRank />
                    <MainRecommend />
                    <DiscoverFAQ />
                </ScrollView>
            </View>
        </>
    )
}
