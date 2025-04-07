import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import {
    discoverBookRankStyles,
    discoverCategoryStyles,
    discoverHeaderStyles,
    discoverStyles,
    discoverTitlteStyles
} from '@/styles/discover-styles'
import { useTheme } from '@/hooks/useTheme'
import Feather from '@expo/vector-icons/Feather'
import { RFValue } from 'react-native-responsive-fontsize'
import { bookStoreApi } from '@/api'
import React, { useEffect, useState } from 'react'
import { BookCategoryItem } from '@/api/modules/book-store/type'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import AntDesign from '@expo/vector-icons/AntDesign'

function DiscoverHeader() {
    const { theme } = useTheme()
    const styles = discoverHeaderStyles(theme)

    return (
        <>
            <View style={styles.discoverHeader}>
                <View style={styles.headerAct}>
                    <Feather
                        name='search'
                        size={RFValue(26)}
                        color={theme.tertiaryColor}
                    />
                </View>
                <Text style={styles.homeCenterText}>发现书籍</Text>
                <View style={styles.headerAct}>
                    <FontAwesome6
                        name='filter'
                        size={RFValue(22)}
                        color={theme.tertiaryColor}
                    />
                </View>
            </View>
        </>
    )
}

interface CategoryIconProps {
    name: string
}
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

function DiscoverCategory() {
    const { theme } = useTheme()

    const styles = discoverCategoryStyles(theme)

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

function DiscoverTitle(props: { title: string; viewMore?: Function }) {
    const { theme } = useTheme()

    const styles = discoverTitlteStyles(theme)

    const handleMore = () => {
        props.viewMore && props.viewMore()
    }

    return (
        <View style={styles.titleWrap}>
            <View style={styles.titleLeft}>
                <View style={styles.titleBar}></View>
                <Text style={styles.titleText}>{props.title}</Text>
            </View>
            <TouchableOpacity onPress={handleMore}>
                <View style={styles.viewMoreWrap}>
                    <Text style={styles.viewMoreText}>查看更多</Text>
                    <AntDesign
                        name='right'
                        size={RFValue(13)}
                        color={theme.tertiaryColor}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

function BookRank() {
    const { theme } = useTheme()

    const styles = discoverBookRankStyles(theme)

    return (
        <>
            <View style={styles.bookRankWrap}>
                <DiscoverTitle title='本站热门' />
            </View>
        </>
    )
}

export default function Discover() {
    const { theme } = useTheme()

    const styles = discoverStyles(theme)

    return (
        <>
            <View style={styles.container}>
                <DiscoverHeader />
                <View style={styles.content}>
                    <DiscoverCategory />
                    <BookRank />
                </View>
            </View>
        </>
    )
}
