import BookAccessModel from '@/app/models/book-access.model'
import { GetBookParams, SearchBookParams } from '@/app/types/backend/book-store.type'
import axios from 'axios'

// 获取书籍分类
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

// 根据分类获取书籍
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

// 获取热度榜
export async function getBooksByHotService() {
    const topThreeRecords = await BookAccessModel.findAll({
        attributes: {
            exclude: ['createdAt', 'deletedAt', 'updatedAt']
        },
        order: [['access_count', 'DESC']],
        limit: 3
    })
    return topThreeRecords
}
