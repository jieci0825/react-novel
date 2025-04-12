import { View, Text } from 'react-native'
import { searchBarStyles, SearchHistoryPanelStyles, searchStyles } from '@/styles/pages/search-style'
import { useTheme } from '@/hooks/useTheme'
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input'
import { RFValue } from 'react-native-responsive-fontsize'
import { CloseIcon, SearchIcon } from '@/components/ui/icon'
import { useState } from 'react'
import { Button, ButtonText } from '@/components/ui/button'
import { bookStoreApi } from '@/api'
import { SearchBookItem } from '@/api/modules/book-store/type'
import { NovelStorage, storage } from '@/utils'
import { SEARCH_HISTORY } from '@/constants'
import SearchBookList from '@/components/search-book-list/search-book-list'

interface SearchPageProps {
    onSearch: (keyword: string) => void
    onFocus: () => void
}
// 搜索栏
function SearchBar(props: SearchPageProps) {
    const { theme } = useTheme()
    const styles = searchBarStyles(theme)

    const [keyword, setKeyword] = useState('')

    return (
        <View style={styles.searchBarWrap}>
            <View style={styles.searchBarLeft}>
                <AntDesign
                    name='arrowleft'
                    size={RFValue(24)}
                    color={theme.primaryColor}
                />
            </View>
            <View style={styles.searchBarCenter}>
                <Input
                    className='w-full'
                    variant='rounded'
                    size='sm'
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                >
                    <InputSlot className='pr-2 pl-2'>
                        <InputIcon as={SearchIcon} />
                    </InputSlot>
                    <InputField
                        className='p-0 flex-1'
                        value={keyword}
                        onSubmitEditing={e => props.onSearch(keyword)}
                        onChangeText={v => setKeyword(v)}
                        onFocus={() => props.onFocus()}
                        placeholder='输入关键词查询'
                    />
                    <InputSlot
                        onPress={() => setKeyword('')}
                        className='pr-2 pl-2'
                    >
                        {!!keyword && <InputIcon as={CloseIcon} />}
                    </InputSlot>
                </Input>
            </View>
            <View style={styles.searchBarRight}>
                <FontAwesome5
                    name='random'
                    size={RFValue(22)}
                    color={theme.primaryColor}
                />
                <Button
                    size='xs'
                    variant='solid'
                    action='primary'
                    onPress={() => props.onSearch(keyword)}
                >
                    <ButtonText>搜索</ButtonText>
                </Button>
            </View>
        </View>
    )
}

interface SearchHistoryPanelProps {
    historys: string[]
    // 选中历史搜索词
    onSelect: (keyword: string) => void
    // 删除历史搜索词
    onDelete: (index: number) => void
    // 清空历史搜索词
    onClear: () => void
}
// 搜索历史面板
function SearchHistoryPanel(props: SearchHistoryPanelProps) {
    const { theme } = useTheme()

    const styles = SearchHistoryPanelStyles(theme)

    return (
        <>
            <View style={styles.searchHistoryPanel}>
                <View style={styles.head}>
                    <Text style={styles.headLeft}>搜索历史</Text>
                    <Text style={styles.headRight}>清空</Text>
                </View>
                <View style={styles.content}>
                    {props.historys.map((item, index) => {
                        return (
                            <Text
                                style={styles.item}
                                key={index}
                            >
                                {item}
                            </Text>
                        )
                    })}
                </View>
            </View>
        </>
    )
}

// 添加搜索历史
function addHistoryKeyword(keyword: string) {
    const historys = NovelStorage.getItem(SEARCH_HISTORY) || []
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
    NovelStorage.setItem(SEARCH_HISTORY, historys)

    return historys
}

export default function SearchPage() {
    const { theme } = useTheme()

    const styles = searchStyles(theme)

    // 是否还有更多
    const [isMore, setIsMore] = useState(true)
    // 搜索历史
    const [historys, setHistorys] = useState<string[]>(NovelStorage.getItem(SEARCH_HISTORY) || [])
    // 搜索结果
    const [searchResult, setSearchResult] = useState<SearchBookItem[]>([])
    // 是否显示历史记录面板
    const [showHistoryPanel, setShowHistoryPanel] = useState(true)
    // page
    const [page, setPage] = useState(1)

    const onSearch = async (keyword: string) => {
        if (!keyword || !isMore) return

        // 每次搜索前需要添加历史记录、关闭历史记录面板、重置数据
        setHistorys(addHistoryKeyword(keyword))
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
        NovelStorage.removeItem(SEARCH_HISTORY)
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
