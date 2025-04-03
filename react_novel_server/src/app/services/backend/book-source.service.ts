import BookSource from '@/app/models/book-source.model'
import { Collide } from '@/core/error-type'
import { AddBookSourceData, AddBookSourceRequest, BookSourceStatus } from '@/app/types/book-source.type'
import { db } from '@/core/db'
import { Transaction } from 'sequelize'
import BookSourceRequst from '@/app/models/book-source-request.model'
import BookSourceParams from '@/app/models/book-source-params.model'

export async function addBookSourceService(data: AddBookSourceData) {
    // 检测书源是否存在
    const bookSource = await BookSource.findOne({
        where: {
            book_source_name: data.bookSourceName
        }
    })

    if (bookSource) {
        throw new Collide('书源已存在')
    }

    const result = await BookSource.create({
        book_source_name: data.bookSourceName,
        book_source_status: BookSourceStatus.UNDONE
    })

    return result.id
}

export async function addRequestByBookSourceService(data: AddBookSourceRequest) {
    await db.transaction(async (t: Transaction) => {
        // 添加书源
        await BookSourceRequst.create({
            book_source_id: data.bookSourceId,
            book_source_method: data.method,
            book_source_url: data.url,
            book_source_effect: data.effect
        })

        // 添加书源配置
        //  - 书源参数
        const paramsList = data.details.paramsJsonSchema
        for (const p of paramsList) {
            const insertData = {
                field: p.field,
                type: p.type,
                data_type: p.dataType,
                value: p.value,
                book_source_id: data.bookSourceId
            }
            await BookSourceParams.create(insertData)
        }
    })
}
