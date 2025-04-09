import { db } from '@/core/db'
import { DataTypes } from 'sequelize'

const BookAccessModel = db.define(
    'book_access',
    {
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
        access_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '访问量'
        }
    },
    {
        tableName: 'book_access'
    }
)

export default BookAccessModel
