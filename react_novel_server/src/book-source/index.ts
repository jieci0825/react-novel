import * as BS_1 from './book-source-1'
import * as BS_2 from './book-source-2'
import { BookSourceImpl } from '@/types'

const BookSourceMap: { [key: number]: BookSourceImpl } = {
    1: BS_1,
    2: BS_2
}

export const BookSourceKeys = Object.keys(BookSourceMap).map(key => +key) as unknown as number[]

export default BookSourceMap
