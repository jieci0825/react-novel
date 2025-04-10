import { db } from '@/core/db'
import { DataTypes } from 'sequelize'

const FaqModel = db.define('faq', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sn: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '序号'
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '问题'
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '答案'
    }
})

export default FaqModel
