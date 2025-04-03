import { DataTypes, Model } from 'sequelize'

const { db } = require('@/core/db.ts')

const BookSource = db.define('book_sources', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键id'
    },
    book_source_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        comment: '书源名称'
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
    }
})

export default BookSource
