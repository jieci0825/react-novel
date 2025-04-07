import { GetBookParams, SearchBookItem, SearchBookParams, SearchBookResult } from '@/app/types/book-store.type'
import { isValidUrl } from '@/utils'
import axios from 'axios'

export async function getBookStoreCategorysService() {
    // 由于数据并不来源本站，所以分类固定，无法更改
    return [
        { id: 1501, categoryName: '玄幻' },
        { id: 1503, categoryName: '武侠' },
        { id: 20349, categoryName: '种田' },
        { id: 1523, categoryName: '言情' },
        { id: 1509, categoryName: '科幻' },
        { id: 20006, categoryName: '系统' },
        { id: 1506, categoryName: '历史' },
        { id: 20083, categoryName: '都市' }
    ]
}

export async function getBooksByCategoryService(data: GetBookParams) {
    const result = await axios.get('https://bookshelf.html5.qq.com/qbread/api/rank/list', {
        params: {
            ch: '001995',
            groupid: data.categoryId,
            start: data.page,
            count: data.pageSize,
            sort: 0
        },
        headers: {
            Referer: 'https://bookshelf.html5.qq.com/qbread'
        }
    })

    return result.data.rows
}

export async function searchBooksService(data: SearchBookParams) {
    const start = (data.page - 1) * data.pageSize
    const end = data.page * data.pageSize

    const result: SearchBookResult = {
        total: 0,
        list: []
    }

    try {
        if (data.source === 1) {
            const resp = await axios.get('https://newopensearch.reader.qq.com/wechat', {
                params: { keyword: data.keyword, start, end }
            })
            result.total = resp.data.booknum
            result.list = resp.data.booklist.map((item: any) => {
                const book: SearchBookItem = {
                    bookId: item.bid,
                    title: item.title,
                    author: item.author,
                    cover: item.jmpURL,
                    description: item.intro,
                    wordCount: item.totalWords,
                    status: item.updateInfo,
                    _source: 1
                }
                return book
            })
        } else if (data.source === 2) {
            const resp = await axios.post('https://apiv2hans.aixdzs.com/search', {
                searchTerms: data.keyword,
                pageNum: data.page,
                pageSize: data.pageSize
            })

            result.total = +resp.data.data.count
            result.list = resp.data.data.bookList.map((item: any) => {
                const book: SearchBookItem = {
                    bookId: item.bookId,
                    title: item.title,
                    author: item.author,
                    cover: isValidUrl(item.cover) ? item.cover : '',
                    description: item.shortIntro,
                    wordCount: item.wordCount,
                    status: item.zt,
                    _source: 2
                }
                return book
            })
        }
        return result
    } catch (error) {
        return result
    }
}
