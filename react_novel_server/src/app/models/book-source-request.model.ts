import { DataTypes, Model } from 'sequelize'

const { db } = require('@/core/db.ts')

const BookSourceRequst = db.define('book_source_request', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键id'
    },
    book_source_method: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '书源请求方式'
    },
    book_source_url: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
        comment: '书源地址'
    },
    book_source_effect: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '书源效果'
    },
    book_source_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '书源id'
    }
})

export default BookSourceRequst
