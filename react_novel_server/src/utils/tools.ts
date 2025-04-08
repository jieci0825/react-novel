// 检测是否是一个合法的链接
export function isValidUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)([\w-]+\.)+[a-zA-Z]{2,6}(\/[\w./?%&=-]*)?$/
    return pattern.test(url) && !!url.trim() // 必须包含协议且非空字符串
}

// 转换松庭鹤沐书源的封面url
export function getBookCoverUrl(bid: string) {
    // 提取bid最后3位作为路径片段
    const getPathSegment = (bid: string) => {
        const last3 = bid.slice(-3)
        const num = parseInt(last3, 10)

        if (num < 10) return bid.slice(-1)
        if (num < 100) return bid.slice(-2)
        return last3
    }

    const pathSegment = getPathSegment(bid)
    return `http://wfqqreader-1252317822.image.myqcloud.com/cover/${pathSegment}/${bid}/b_${bid}.jpg`
}

// 将数字转换为"xx万字"格式
export function formatToTenThousand(value: number, decimalPlaces: number = 2): string {
    if (isNaN(value)) {
        throw new Error('Invalid number')
    }

    // 计算万单位的值
    const tenThousandValue = value / 10000

    // 格式化小数位数
    const formattedValue = tenThousandValue.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    })

    return `${formattedValue}万`
}
