import { CURRENT_READ_CHAPTER_KEY } from '@/constants'
import { LocalCache } from '.'
import { CurrentReadChapterInfo } from '@/types'

// 获取所有的阅读进度记录
export async function getAllReadStorage(): Promise<CurrentReadChapterInfo[]> {
    const list = await LocalCache.getData(CURRENT_READ_CHAPTER_KEY)
    return list || []
}

// 获取对应的阅读记录
//  - 只要书名和作者相同，则认为是同一个书。统一进度
export async function getReadStorage(params: { bookName: string; author: string }) {
    const { bookName, author } = params
    const list = await getAllReadStorage()
    const item = list.find(item => {
        return item.bookName === bookName && item.author === author
    })
    return item || null
}

// 更新阅读记录-如果存在则更新，不存在则添加
export async function updateReadStorage(item: CurrentReadChapterInfo) {
    const { bookName, author } = item

    const list = await getAllReadStorage()

    const index = list.findIndex(item => {
        return item.bookName === bookName && item.author === author
    })

    // 如果存在，则更新，否则添加
    if (index > -1) {
        list[index] = item
    } else {
        list.push(item)
    }

    // 写入缓存
    await LocalCache.storeData(CURRENT_READ_CHAPTER_KEY, list)
}

// 删除阅读记录
export async function deleteReadStorage(params: {
    bookId: string | number
    bookName: string
    author: string
    source: number
}) {
    const { bookId, bookName, author, source } = params
    const list = await getAllReadStorage()
    const index = list.findIndex(item => {
        return item.bookName === bookName && item.author === author
    })
    if (index > -1) {
        list.splice(index, 1)
    }
    await LocalCache.storeData(CURRENT_READ_CHAPTER_KEY, list)
}
