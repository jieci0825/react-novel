import { db } from '@/core/db'
import { DataTypes } from 'sequelize'

const BookRankModel = db.define('book_rank', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '书籍id'
    },
    book_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '书籍名'
    },
    book_author: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '作者'
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 默认值为 0 表示未排序
        comment: '排序'
    },
    rank_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '排名类型 1:热榜 2:推荐'
    }
})

export default BookRankModel
