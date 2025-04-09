import BookRecommendModel from '@/app/models/book-recommend.model'
import { AddBookRecommendParams } from '@/app/types/backend/book-recommend.type'

// 添加站主推荐书籍
export async function addMainBookRecommendService(data: AddBookRecommendParams) {
    const insertData = {
        recommend_type: 'main',
        book_name: data.bookName,
        book_id: data.bookId,
        book_cover: data.bookCover,
        book_author: data.bookAuthor,
        book_source: data._source,
        order: data.order
    }

    await BookRecommendModel.create(insertData)
}
