import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system'
import { createBooksTable } from './tables/books.table'

export const initializeDB = (dbName: string) => {
    const documentDirectory = FileSystem.documentDirectory

    const db = SQLite.openDatabaseSync(dbName)

    createBooksTable(db)

    return db
}
