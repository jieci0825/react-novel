import * as SQLite from 'expo-sqlite'

let _db: SQLite.SQLiteDatabase | null = null

export interface BookItemBase {
    id: number
    book_id: string
    book_name: string
    author: string
    cover: string
    source: number
    is_bookshelf: number
    last_read_chapter: number
    total_chapter: number
    last_read_chapter_page_index: number
    last_read_time: number
}

// 创建 books 表
export function createBooksTable(db: SQLite.SQLiteDatabase) {
    _db = db

    _db.execSync(`
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id TEXT,
            book_name TEXT,
            author TEXT,
            cover TEXT,
            source INTEGER,
            is_bookshelf INTEGER,
            last_read_chapter INTEGER,
            total_chapter INTEGER,
            last_read_chapter_page_index INTEGER,
            last_read_time INTEGER
        );
    `)
}

type InsertBookParams = Omit<BookItemBase, 'id' | 'last_read_time'> & {
    last_read_time?: number
}
// 插入数据
export async function insertBook(book: InsertBookParams) {
    if (!_db) return

    const {
        book_id,
        book_name,
        author,
        cover = '',
        source = '',
        is_bookshelf = 0,
        last_read_chapter = 0,
        total_chapter = 0,
        last_read_chapter_page_index = 0,
        last_read_time
    } = book

    _db.runSync(
        `INSERT INTO books (
          book_id, book_name, author, cover, source, is_bookshelf,
          last_read_chapter, total_chapter, last_read_chapter_page_index, last_read_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            book_id,
            book_name,
            author,
            cover,
            source,
            is_bookshelf,
            last_read_chapter,
            total_chapter,
            last_read_chapter_page_index,
            last_read_time || Math.floor(Date.now() / 1000)
        ]
    )
}
