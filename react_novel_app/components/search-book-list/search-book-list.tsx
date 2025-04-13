import { SearchBookItem } from '@/api/modules/book-store/type'
import { useTheme } from '@/hooks/useTheme'
import { searchBookListStyles } from './search-book-list.style'
import { View, Text, ScrollView } from 'react-native'
import ImgPlus from '../img-plus/img-plus'
import TextOverflowHidden from '../text-overflow-hidden/text-overflow-hidden'

// 搜索结果
interface SearchBookResultProps {
    list: SearchBookItem[]
}
export default function SearchBookList(props: SearchBookResultProps) {
    const { theme } = useTheme()

    const styles = searchBookListStyles(theme)

    return (
        <ScrollView>
            <View style={styles.searchResultWrap}>
                {props.list.map(item => {
                    return (
                        <View
                            key={item.bookId}
                            style={styles.searchResultItem}
                        >
                            <ImgPlus
                                src={item.cover}
                                style={styles.cover}
                            />
                            <View style={styles.info}>
                                <Text style={styles.title}>{item.title}</Text>
                                <View style={styles.otherInfo}>
                                    <Text style={styles.author}>{item.author}</Text>
                                    <View style={styles.tags}>
                                        {[item.wordCount, item.status].map((tag, idx) => {
                                            return (
                                                <Text
                                                    key={idx}
                                                    style={styles.tag}
                                                >
                                                    {tag}
                                                </Text>
                                            )
                                        })}
                                    </View>
                                    <TextOverflowHidden
                                        line={2}
                                        fontStyle={styles.desc}
                                    >
                                        {item.description}
                                    </TextOverflowHidden>
                                </View>
                            </View>
                        </View>
                    )
                })}
            </View>
        </ScrollView>
    )
}
