import axios from 'axios'
import { SearchBookParams } from '@/app/types/book-store.type'
import { BookSourceSearchResult, SearchBookItem } from '@/types'
import { formatToTenThousand, getBookCoverUrl } from '@/utils'

export async function search(data: SearchBookParams): Promise<BookSourceSearchResult> {
    const limit = 20

    const start = (data.page - 1) * limit
    const end = data.page * limit - 1

    const resp = await axios.get('https://newopensearch.reader.qq.com/wechat', {
        params: { keyword: data.keyword, start, end }
    })

    const list = resp.data.booklist.map((item: any) => {
        const book: SearchBookItem = {
            // bookid 需要进行一定的规则转换
            bookId: 1100000000 + parseInt(item.bid),
            title: item.title,
            author: item.author,
            // 封面规则也需要转换
            cover: getBookCoverUrl(item.bid),
            description: item.intro,
            wordCount: formatToTenThousand(item.totalWords),
            status: item.updateInfo,
            _source: 1
        }
        return book
    })

    return {
        limit,
        list
    }
}
