import { useTheme } from '@/hooks/useTheme'
import { readStyles } from '@/styles/pages/read.styles'
import { Animated, Button, Text, View } from 'react-native'
import ReadHeader from './read-header'
import { useEffect, useRef, useState } from 'react'
import ReadFooter from './read-footer'
import { bookApi } from '@/api'
import { useLocalSearchParams } from 'expo-router'
import ChapterList from './chapter-list'
import { ChapterItem } from '@/api/modules/book/type'

export default function ReadPage() {
    const { theme } = useTheme()
    const styles = readStyles(theme)

    // 控制上下菜单的显示与隐藏
    const [isVisible, setIsVisible] = useState(false)

    // 当前章节进度
    const [curChapterProgress, setCurChapterProgress] = useState(0)

    // 目录的显示与隐藏
    const [isChapterListVisible, setIsChapterListVisible] = useState(false)
    // 显示目录列表-隐藏上下菜单
    const showChapterList = () => {
        setIsChapterListVisible(true)
        setIsVisible(false)
    }

    // 路径参数
    const params = useLocalSearchParams()

    const [chapterList, setChapterList] = useState<ChapterItem[]>([])
    useEffect(() => {
        bookApi
            .reqGetBookChapters({
                bookId: params.bid as string,
                _source: +params.source as any
            })
            .then(res => {
                setChapterList(res.data)
            })
            .catch(() => {})
    }, [])

    return (
        <>
            <View style={[styles.container]}>
                <ReadHeader isVisible={isVisible} />
                <View
                    style={{
                        marginTop: 200
                    }}
                >
                    <Button
                        onPress={() => setIsVisible(!isVisible)}
                        title='切换'
                    ></Button>
                </View>
                <ReadFooter
                    isVisible={isVisible}
                    showChapterList={showChapterList}
                />
                <ChapterList
                    isVisible={isChapterListVisible}
                    chaperList={chapterList}
                    closeChapterList={() => setIsChapterListVisible(false)}
                />
            </View>
        </>
    )
}
