import axios from 'axios'
import { SearchBookParams } from '@/app/types/book-store.type'
import { BookSourceSearchResult, SearchBookItem } from '@/types'

export async function search(data: SearchBookParams): Promise<BookSourceSearchResult> {
    const resp = await axios.get('http://api.lemiyigou.com/search', {
        params: {
            keyword: data.keyword,
            page: data.page
        }
    })

    const bookList = resp.data.data.map((item: any) => {
        const book: SearchBookItem = {
            bookId: item.novelId,
            title: item.novelName,
            author: item.authorName,
            cover: item.cover,
            description: item.summary,
            wordCount: item.wordNum,
            status: item.isComplete === 1 ? '已完结' : '连载中',
            _source: 2
        }

        return book
    })

    return {
        limit: 15,
        list: bookList
    }
}
