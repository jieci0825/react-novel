const Sequelize = require('sequelize')

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
} as any

const db = new Sequelize(config.database, config.username, config.password, {
    dialect: 'mysql', // 选择链接数据库的类型, 需要安装 mysql2 这个驱动包
    host: config.host,
    port: config.port,
    logging: false, // 显示每次操作的原始sql命令在终端输出
    timezone: '+08:00', // 设置时区
    define: {
        timestamps: true, // 设置为 false 不会生成 createAT 和 updateAt 两个字段
        paranoid: true // 可以生成记录删除时间的字段,  delete (软删除-硬删除)
    }
})

module.exports = { db }
