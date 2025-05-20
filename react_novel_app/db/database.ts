import * as SQLite from 'expo-sqlite'
import { createBooksTable } from './tables/books.table'

export const initializeDB = async (dbName: string) => {
    const db = await SQLite.openDatabaseAsync(dbName)

    await createBooksTable(db)

    return db
}
