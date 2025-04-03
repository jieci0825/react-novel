import { DataTypes } from 'sequelize'

const { db } = require('@/core/db.ts')

const BookSourceParams = db.define('book_source_params', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键id'
    },
    field: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '字段名'
    },
    data_type: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '数据类型'
    },
    type: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '参数填充类型'
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '参数值'
    },
    book_source_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '书源id'
    }
})

export default BookSourceParams
