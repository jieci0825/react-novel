import { BookshelfItem } from '@/types'
import { LocalCache } from '.'
import { MY_BOOKSHELF } from '@/constants'
import { jcShowToast } from '@/components/jc-toast/jc-toast'

function getKey(data: BookshelfItem) {
    return `${data.bookId}-${data.source}-${data.bookName}-${data.author}`
}

export function genKey(bookId: string | number, source: number, bookName: string, author: string) {
    return `${bookId}-${source}-${bookName}-${author}`
}

// 添加到书架
async function addToBookshelf(data: BookshelfItem) {
    const key = getKey(data)
    const isExist = await isInBookshelf(key)
    if (isExist) {
        jcShowToast('已存在于书架中')
        return false
    }

    const bookshelfs = await getBookshelfList()
    bookshelfs.push(data)

    await LocalCache.storeData(MY_BOOKSHELF, bookshelfs)

    jcShowToast({ text: '已添加到书架', type: 'success' })

    return true
}

// 检测是否存在于书架中
async function isInBookshelf(key: string) {
    const bookshelfs = await getBookshelfList()
    return bookshelfs.some(item => getKey(item) === key)
}

// 获取书架列表
async function getBookshelfList(): Promise<BookshelfItem[]> {
    return (await LocalCache.getData(MY_BOOKSHELF)) || []
}

const bookshelfStorage = {
    addToBookshelf,
    isInBookshelf,
    getBookshelfList,
    genKey
}

export default bookshelfStorage
