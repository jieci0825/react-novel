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
    book_source_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '书源状态'
    }
})

export default BookSource
