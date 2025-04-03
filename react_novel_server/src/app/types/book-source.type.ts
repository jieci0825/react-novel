interface ParamsJsonSchema {
    field: string
    dataType: 'number' | 'string' | 'boolean' | 'array' | 'object'
    type: 'header' | 'query' | 'body' | 'path'
    value: any
}

export interface HeaderJsonSchema {
    field: string
    value: string
}

export interface BookSourceDetails {
    paramsJsonSchema: Array<ParamsJsonSchema>
    headerJsonSchema: Array<HeaderJsonSchema>
}

export interface AddBookSourceData {
    bookSourceName: string
    method: 'get' | 'put' | 'post' | 'delete' | 'patch'
    url: string
    details: BookSourceDetails
}
