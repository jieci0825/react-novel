import { BookshelfItem } from '@/types'
import { LocalCache } from '.'
import { MY_BOOKSHELF } from '@/constants'
import { jcShowToast } from '@/components/jc-toast/jc-toast'

function getKey(data: BookshelfItem) {
    return `${data.bookName}-${data.author}`
}

export function genKey(bookName: string, author: string) {
    return `${bookName}-${author}`
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

// 删除书架中的书籍
async function delBookshelfItem(key: string) {
    const bookshelfs = await getBookshelfList()
    const index = bookshelfs.findIndex(item => getKey(item) === key)
    if (index === -1) {
        return false
    }
    bookshelfs.splice(index, 1)
    await LocalCache.storeData(MY_BOOKSHELF, bookshelfs)
    return true
}

// 更新书架中书籍的最后阅读章节
async function updateBookshelfLastChapter(chapterNum: number, key: string) {
    const bookshelfs = await getBookshelfList()
    const index = bookshelfs.findIndex(item => getKey(item) === key)
    if (index === -1) {
        return false
    }
    bookshelfs[index].lastReadChapter = chapterNum
    await LocalCache.storeData(MY_BOOKSHELF, bookshelfs)
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

// 根据 key 返回书架中的书籍
async function getBookshelfItem(key: string): Promise<BookshelfItem | null> {
    const bookshelfs = await getBookshelfList()
    return bookshelfs.find(item => getKey(item) === key) || null
}

const bookshelfStorage = {
    addToBookshelf,
    isInBookshelf,
    getBookshelfList,
    getBookshelfItem,
    updateBookshelfLastChapter,
    delBookshelfItem,
    genKey
}

export default bookshelfStorage
