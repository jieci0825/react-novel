import { ViewBookDetailParams } from '@/app/types/book.type'

export async function viewBookDetailService(data: ViewBookDetailParams) {
    if (data._source === 1) {
        // const bookInfo = resp.data?.data?.bookInfo || undefined
        // if (!bookInfo) return {}
        // const result: BookDetailResult = {
        //     resourceId: bookInfo.resourceID,
        //     cover: bookInfo.picurl,
        //     title: bookInfo.resourceName,
        //     description: bookInfo.summary,
        //     author: bookInfo.author,
        //     _source: data._source
        // }
    } else if (data._source === 2) {
    }
}

export async function viewBookChapterService(data: ViewBookDetailParams) {}
