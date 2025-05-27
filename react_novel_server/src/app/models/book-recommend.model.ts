import { db } from '@/core/db'
import { DataTypes } from 'sequelize'

const BookRecommendModel = db.define('book_recommend', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    book_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '书名'
    },
    book_author: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '作者'
    },
    book_cover: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '封面'
    },
    book_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '书籍id'
    },
    recommend_type: {
        // 推荐类型：post-帖子，post-comment-帖子评论，main-站主推荐
        type: DataTypes.ENUM('post', 'post-comment', 'main'),
        allowNull: false,
        comment: '推荐类型'
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '排序'
    }
})

export default BookRecommendModel
