import CryptoJS from 'crypto-js'
import axios from 'axios'
import { SearchBookParams } from '@/app/types/book-store.type'
import { BookDetailResult, BookSourceSearchResult, ChapterItem, SearchBookItem } from '@/types'

// 配置密钥和IV（需与后端一致）
const key = CryptoJS.enc.Utf8.parse('f041c49714d39908')
const iv = CryptoJS.enc.Utf8.parse('0123456789abcdef')

// 解密函数
function decryptAES(encryptedBase64: string) {
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedBase64)
    // 使用CipherParams.create封装ciphertext
    const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext
    })
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

const headers = {
    'User-Agent': 'okhttp/4.9.2',
    'client-device': 'LND-AL40',
    'client-version': '2.2.0',
    'client-brand': 'HONOR',
    'client-source': 'android',
    'client-name': 'app.maoyankanshu.novel',
    'Authorization':
        'bearereyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuam1sbGRzYy5jb21cL2F1dGhcL3RoaXJkIiwiaWF0IjoxNjY1OTU4NzE0LCJleHAiOjE3NTkyNzA3MTQsIm5iZiI6MTY2NTk1ODcxNCwianRpIjoiTzdkNGZXZGo4b3JEZVBTbCIsInN1YiI6MjEwMjgsInBydiI6ImExY2IwMzcxODAyOTZjNmExOTM4ZWYzMGI0Mzc5NDY3MmRkMDE2YzUifQ.QIK10Tnkc25NqBE0XW7CgdHUZFFpEY1hS7s9yxJF378'
}

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

export async function detail(bookId: SearchBookItem['bookId']): Promise<BookDetailResult> {
    const resp = await axios.get(`http://api.lemiyigou.com/novel/${bookId}`, { headers })

    const detail = resp.data.data
    if (!detail) return {} as BookDetailResult

    const chapters = await chapter(bookId)

    return {
        bookId,
        title: detail.novelName,
        author: detail.authorName,
        cover: detail.cover,
        description: detail.summary,
        wordCount: detail.wordNum,
        status: +detail.isComplete === 1 ? '已完结' : '连载中',
        _source: 2,
        chapters: chapters.slice(0, 10),
        chapterCount: chapters.length
    }
}

export async function chapter(bookId: SearchBookItem['bookId']): Promise<ChapterItem[]> {
    const resp = await axios.get(`http://api.lemiyigou.com/novel/${bookId}/chapters`, { headers })
    const chapters = resp.data.data.list.map((item: any) => {
        const c: ChapterItem = {
            // 正文链接需要解密
            contentUrl: decryptAES(item.path),
            contentCount: item.wordNum,
            chapterName: item.chapterNumber,
            chapterId: item.chapterId,
            _source: 2
        }

        return c
    })

    return chapters
}
