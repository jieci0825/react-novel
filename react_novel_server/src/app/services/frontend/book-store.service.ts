import { GetBookParams, SearchBookParams } from '@/app/types/boo-store.type'
import axios from 'axios'

export async function getBookStoreCategorysService() {
    // 由于数据并不来源本站，所以分类固定，无法更改
    return [
        { id: 1501, categoryName: '玄幻' },
        { id: 1503, categoryName: '武侠' },
        { id: 20006, categoryName: '系统' },
        { id: 20083, categoryName: '都市' },
        { id: 1506, categoryName: '历史' },
        { id: 1509, categoryName: '科幻' },
        { id: 1523, categoryName: '言情' },
        { id: 20349, categoryName: '种田' }
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

    const result = await axios.get('https://newopensearch.reader.qq.com/wechat', {
        params: { keyword: data.keyword, start, end }
    })

    return result.data.booklist
}
