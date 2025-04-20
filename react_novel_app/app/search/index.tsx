import { Text, View } from 'react-native'
import { useTheme } from '@/hooks/useTheme'
import { useEffect, useState } from 'react'
import { bookStoreApi } from '@/api'
import { SearchBookItem, SearchByKeywordParams } from '@/api/modules/book-store/type'
import { LocalCache } from '@/utils'
import { SEARCH_HISTORY } from '@/constants'
import SearchBookList from '@/components/search-book-list/search-book-list'
import SearchBar from './search-bar'
import SearchHistoryPanel from './search-hostory-panel'
import { searchStyles } from '@/styles/pages/search.style'

// 获取搜索历史
async function getSearchHistory() {
    const h = await LocalCache.getData(SEARCH_HISTORY)
    return h || []
}
// 添加搜索历史
async function addHistoryKeyword(keyword: string) {
    const historys = await getSearchHistory()
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
// 删除搜索历史
async function deleteHistoryKeyword(index: number) {
    const historys = await getSearchHistory()
    historys.splice(index, 1)
    LocalCache.storeData(SEARCH_HISTORY, historys)
    return historys
}
// 清空搜索历史
async function clearAllHistoryKeyword() {
    await LocalCache.removeData(SEARCH_HISTORY)
    return []
}
// 搜索页面
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
    // 页码值
    const [page, setPage] = useState(1)
    // 搜索关键词
    const [keyword, setKeyword] = useState<string>('')

    useEffect(() => {
        LocalCache.getData(SEARCH_HISTORY).then(h => {
            setHistorys(h || [])
        })
    }, [])

    // 监听 keyword 变化。当其变为空时，打开历史记录面板
    useEffect(() => {
        if (!keyword) {
            setShowHistoryPanel(true)
        }
    }, [keyword])

    // 搜索，每次搜索都应该是从第一页开始
    const onSearch = async (v?: string) => {
        const k = v || keyword
        if (!k || !isMore) return

        // 每次搜索前需要添加历史记录、关闭历史记录面板、重置数据
        const h = await addHistoryKeyword(k)
        setHistorys(h)
        setShowHistoryPanel(false)
        reset()

        fetchData({ keyword: k, _source: 1, page: 1 })
    }

    // 获取数据
    async function fetchData(condition: SearchByKeywordParams) {
        const resp = await bookStoreApi.reqSearchBookByKeyword(condition)

        setSearchResult(prevData => [...prevData, ...resp.data.list])

        if (resp.data.list.length < resp.data.limit) {
            setIsMore(false)
        }
    }

    // 加载更多
    async function loadMore() {
        // 如果没有更多则不执行
        if (!isMore) return
        setPage(prev => {
            const newPage = prev + 1
            fetchData({ keyword, _source: 1, page: newPage })
            return newPage
        })
    }

    function reset() {
        setIsMore(true)
        setSearchResult([])
        setPage(1)
    }

    // 清除历史记录
    async function onClear() {
        await clearAllHistoryKeyword()
        setHistorys([])
    }

    // 删除历史记录
    async function onDelete(index: number) {
        const h = await deleteHistoryKeyword(index)
        setHistorys(h)
    }

    // 选择历史记录
    function onSelect(keyword: string) {
        setKeyword(() => {
            onSearch(keyword)
            return keyword
        })
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
                keyword={keyword}
                setKeyword={setKeyword}
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
                    <SearchBookList
                        list={searchResult}
                        loadData={loadMore}
                        isMore={isMore}
                    />
                )}
            </View>
        </View>
    )
}
