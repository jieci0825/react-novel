import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const books = sqliteTable('books', {
    id: integer().primaryKey({ autoIncrement: true }),
    book_id: text().notNull(), // 书籍id
    book_name: text().notNull(), // 书籍名称
    author: text().notNull(), // 作者
    cover: text(), // 封面
    is_bookshelf: integer({ mode: 'boolean' }).notNull(), // 是否加入了书架
    total_chapter: integer().notNull(), // 当前书籍总章节数
    last_read_chapter_page_index: integer().notNull(), // 即最后阅读章节的页码索引
    last_read_time: integer({ mode: 'timestamp' }).notNull(), // 最后阅读时间
    last_read_chapter_index: integer().notNull() // 最后阅读章节的索引
})

export const chapters = sqliteTable('chapters', {
    id: integer().primaryKey({ autoIncrement: true }),
    chapter_name: text().notNull(), // 章节名称
    content: text().notNull(), // 章节正文
    chapterIndex: integer().notNull(), // 在章节目录中的索引
    books_id: integer().notNull() // 书籍id，即 books 表的主键
})

export type Books = typeof books.$inferSelect
export type AddBooks = Omit<Books, 'id'>

export type Chapters = typeof chapters.$inferSelect
export type AddChapters = Omit<Chapters, 'id'>
