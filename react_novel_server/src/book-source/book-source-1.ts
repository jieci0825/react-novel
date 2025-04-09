import axios from 'axios'
import { SearchBookParams } from '@/app/types/backend/book-store.type'
import { BookDetailResult, BookSourceSearchResult, ChapterItem, ContentResult, SearchBookItem } from '@/types'
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

export async function detail(bookId: SearchBookItem['bookId']): Promise<BookDetailResult> {
    const resp = await axios.get('https://bookshelf.html5.qq.com/qbread/api/novel/intro-info', {
        params: { bookid: bookId },
        headers: {
            Referer: 'https://bookshelf.html5.qq.com/qbread'
        }
    })

    const detail = resp.data.data.bookInfo
    if (!detail) return {} as BookDetailResult

    const chapters = await chapter(bookId)

    return {
        bookId,
        title: detail.resourceName,
        author: detail.author,
        cover: detail.picCDN,
        description: detail.summary,
        wordCount: formatToTenThousand(detail.contentsize),
        status: detail.isfinish ? '已完结' : '连载中',
        _source: 1,
        chapters: chapters,
        chapterCount: chapters.length
    }
}

export async function chapter(bookId: SearchBookItem['bookId']): Promise<any> {
    const resp = await axios.get('https://bookshelf.html5.qq.com/qbread/api/book/all-chapter', {
        params: { bookId },
        headers: {
            Referer: 'https://bookshelf.html5.qq.com/qbread'
        }
    })

    const chapters = resp.data.rows.map((item: any) => {
        const c: ChapterItem = {
            chapterId: item.serialID,
            chapterName: item.serialName,
            _source: 1
        }
        return c
    })

    return chapters
}

export async function content(
    bookId: SearchBookItem['bookId'],
    chapterId: ChapterItem['chapterId']
): Promise<ContentResult> {
    const data = {
        Scene: 'chapter',
        ContentAnchorBatch: [
            {
                BookID: String(bookId),
                ChapterSeqNo: [chapterId]
            }
        ]
    }

    const resp = await axios({
        method: 'post',
        url: 'https://novel.html5.qq.com/be-api/content/ads-read',
        data,
        headers: {
            'Q-GUID': '4aa27c7cf2d9aca3359656ea186488cb'
        }
    })
    const result = resp.data.data.Content[0]
    if (!result) {
        return { content: '请求失败~~' }
    }

    return {
        content: result.Content
    }
}
