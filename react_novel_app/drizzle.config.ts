import type { Config } from 'drizzle-kit'

export default {
    // 指定数据库 schema 定义文件的路径-该文件中定义了数据库的表结构
    schema: './db/schema.ts',
    // 指定 Drizzle 生成的输出目录-包含生成的类型定义和查询构建器代码（可用于迁移）
    out: './drizzle',
    // 指定使用的数据库
    dialect: 'sqlite',
    // 使用 Expo 的 SQLite 驱动
    driver: 'expo'
} satisfies Config
