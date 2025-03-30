// 异常基类
export class ErrorTypeImpl extends Error {
    public statusCode: number
    public errorCode: string
    public msg: string
    public data: any

    constructor(status?: number, errorCode?: string, msg?: string, data?: any) {
        super()
        this.statusCode = status || 200
        this.errorCode = errorCode || '0'
        this.msg = msg || 'ok'
        this.data = data || null
    }
}

export class DataSuccess extends ErrorTypeImpl {
    constructor(data = null, msg = 'ok', errorCode = '0') {
        super()
        this.statusCode = 200
        this.errorCode = errorCode
        this.msg = msg
        this.data = data
    }
}

export class Success extends ErrorTypeImpl {
    constructor(msg: string) {
        super()
        this.statusCode = 201
        this.errorCode = '0'
        this.msg = msg || 'ok'
    }
}

export class ParamsError extends ErrorTypeImpl {
    constructor(msg: string, errorCode: string) {
        super()
        this.statusCode = 400
        this.errorCode = errorCode || '10000'
        this.msg = msg || '参数错误'
    }
}

export class NotFound extends ErrorTypeImpl {
    constructor(msg: string, errorCode: string) {
        super()
        this.statusCode = 404
        this.errorCode = errorCode || '10001'
        this.msg = msg || '资源不存在'
    }
}

export class AuthFailed extends ErrorTypeImpl {
    constructor(msg: string, errorCode: string) {
        super()
        this.statusCode = 401
        this.errorCode = errorCode || '10002'
        this.msg = msg || '授权失败'
    }
}

export class Forbidden extends ErrorTypeImpl {
    constructor(msg: string, errorCode: string) {
        super()
        this.statusCode = 403
        this.errorCode = errorCode || '10003'
        this.msg = msg || '禁止访问'
    }
}

export class Collide extends ErrorTypeImpl {
    constructor(msg: string, errorCode: string) {
        super()
        this.statusCode = 409
        this.errorCode = errorCode || '10004'
        this.msg = msg || '请求冲突'
    }
}

export class UnknownError extends ErrorTypeImpl {
    constructor(msg: string, errorCode: string) {
        super()
        this.statusCode = 500
        this.errorCode = errorCode || '20000'
        this.msg = msg || '未知错误'
    }
}
