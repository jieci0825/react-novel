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
    createTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    updateTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
})

export default BookSource
