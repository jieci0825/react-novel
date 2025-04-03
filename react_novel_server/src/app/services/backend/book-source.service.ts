import BookSourceParams from '@/app/models/book-source-params.model'
import BookSource from '@/app/models/book-source.model'
import { AddBookSourceData } from '@/app/types/book-source.type'
import { Collide } from '@/core/error-type'
import { Op, Transaction } from 'sequelize'
const { db } = require('@/core/db')

// 添加书源
export async function addBookSourceService(data: AddBookSourceData) {
    // 检测书源是否存在
    const bookSource = await BookSource.findOne({
        where: {
            [Op.or]: [{ book_source_name: data.bookSourceName }, { book_source_url: data.url }]
        }
    })

    if (bookSource) {
        throw new Collide('书源已存在')
    }

    await db.transaction(async (t: Transaction) => {
        // 添加书源
        const restult = await BookSource.create(
            {
                book_source_name: data.bookSourceName,
                book_source_url: data.url,
                book_source_method: data.method
            },
            { transaction: t }
        )
        const id = restult.id

        // 添加书源配置
        //  - 书源参数
        const paramsList = data.details.paramsJsonSchema
        for (const p of paramsList) {
            const insertData = {
                field: p.field,
                type: p.type,
                data_type: p.dataType,
                value: p.value,
                book_source_id: id
            }
            await BookSourceParams.create(insertData)
        }
    })
}
