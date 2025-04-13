import { View, Text } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { useEffect, useState } from 'react'
import { bookStoreApi } from '@/api'
import { SearchBookItem } from '@/api/modules/book-store/type'
import { LocalCache } from '@/utils'
import { SEARCH_HISTORY } from '@/constants'
import SearchBookList from '@/components/search-book-list/search-book-list'
import SearchBar from './search-bar'
import SearchHistoryPanel from './search-hostory-panel'
import { searchStyles } from '@/styles/pages/search.style'

// 添加搜索历史
async function addHistoryKeyword(keyword: string) {
    const historys = (await LocalCache.getData(SEARCH_HISTORY)) || []
    // 如果已经存在，则删除
    const index = historys.indexOf(keyword)
    if (index > -1) {
        historys.splice(index, 1)
    }
    // 检测是否超过50个，超过则删除最后一个
    if (historys.length >= 50) {
        historys.pop()
    }
    historys.unshift(keyword)

    // 保存
    LocalCache.storeData(SEARCH_HISTORY, historys)

    return historys
}

export default function SearchPage() {
    const { theme } = useTheme()

    const styles = searchStyles(theme)

    // 是否还有更多
    const [isMore, setIsMore] = useState(true)
    // 搜索历史
    const [historys, setHistorys] = useState<string[]>([])
    // 搜索结果
    const [searchResult, setSearchResult] = useState<SearchBookItem[]>([])
    // 是否显示历史记录面板
    const [showHistoryPanel, setShowHistoryPanel] = useState(true)
    // page
    const [page, setPage] = useState(1)

    useEffect(() => {
        LocalCache.getData(SEARCH_HISTORY).then(h => {
            setHistorys(h || [])
        })
    }, [])

    const onSearch = async (keyword: string) => {
        if (!keyword || !isMore) return

        // 每次搜索前需要添加历史记录、关闭历史记录面板、重置数据
        const h = await addHistoryKeyword(keyword)
        setHistorys(h)
        setShowHistoryPanel(false)
        reset()

        fetchData(keyword)
    }

    async function fetchData(keyword: string) {
        const resp = await bookStoreApi.reqSearchBookByKeyword({ keyword, _source: 1, page })

        setPage(page + 1)

        const list = [...resp.data.list, ...searchResult]
        setSearchResult(list)

        if (resp.data.list.length < resp.data.limit) {
            setIsMore(false)
        }
    }

    function reset() {
        setIsMore(true)
        setSearchResult([])
        setPage(1)
    }

    function onClear() {
        // TODO 删除本地缓存
        setHistorys([])
    }

    function onDelete() {
        // TODO
    }

    function onSelect(keyword: string) {
        onSearch(keyword)
    }

    function onFocus() {
        // 聚焦就要打开历史记录面板，且重置数据
        setShowHistoryPanel(true)
        reset()
    }

    return (
        <View style={styles.container}>
            <SearchBar
                onSearch={onSearch}
                onFocus={onFocus}
            />
            <View style={styles.main}>
                {showHistoryPanel ? (
                    <SearchHistoryPanel
                        historys={historys}
                        onClear={onClear}
                        onDelete={onDelete}
                        onSelect={onSelect}
                    />
                ) : (
                    <SearchBookList list={searchResult} />
                )}
            </View>
        </View>
    )
}
