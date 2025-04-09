import BookAccessModel from '@/app/models/book-access.model'
import { AddBookAccessCountParams } from '@/app/types/book-access.type'

export async function addBookAccessCountService({ bookName, bookAuthor }: AddBookAccessCountParams) {
    // 先查询到记录
    const record = await BookAccessModel.findOne({ where: { book_name: bookName } })
    if (!record) {
        // 如果不存在，则创建一条新记录
        await BookAccessModel.create({ book_name: bookName, book_author: bookAuthor, access_count: 1 })
        return
    } else {
        // 如果存在，则自增
        await record.increment('access_count', { by: 1 })
    }
}
