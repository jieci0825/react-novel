import { DESIGN_WIDTH, DESIGN_HEIGHT } from '@/constants/Size'
import { useWindowDimensions } from 'react-native'
import { isString } from './check-type'

interface Options {
    standardSize?: number
    direction?: 'width' | 'height'
}

/**
 * 自适应
 */
export function adaptiveSize(value: number, options?: Options) {
    const { standardSize, direction = 'width' } = options || {}
    const s = standardSize || (direction === 'width' ? DESIGN_WIDTH : DESIGN_HEIGHT)
    const proportion = value / s
    const screenSize = useWindowDimensions()[direction]
    return screenSize * proportion
}

type getAdjacentIndexesReturnType = {
    prevIndex: number[]
    nextIndex: number[]
}
/**
 * 获取当前索引的相邻索引
 */
export function getAdjacentIndexes(
    curIndex: number,
    arrLength: number,
    range = 3,
    direction: 'both' | 'prev' | 'next' = 'both'
): getAdjacentIndexesReturnType {
    const result: getAdjacentIndexesReturnType = {
        prevIndex: [],
        nextIndex: []
    }

    if (arrLength <= 0) return result
    if (curIndex < 0 || curIndex >= arrLength) {
        console.warn('当前索引超出范围')
        return result
    }

    if (direction === 'both' || direction === 'prev') {
        const start = Math.max(0, curIndex - range)
        result.prevIndex = Array.from({ length: curIndex - start }, (_, i) => start + i)
    }

    if (direction === 'both' || direction === 'next') {
        const end = Math.min(arrLength, curIndex + range)
        result.nextIndex = Array.from({ length: end - curIndex }, (_, i) => curIndex + i + 1)
    }

    return result
}

/**
 * 将文本按换行符切割成数组，并过滤空行
 */
export function splitTextByLine(text: string): string[] {
    if (!isString(text)) {
        console.warn('请输入字符串')
        return []
    }

    // 匹配所有换行符：\n, \r\n, \r
    const lines = text.split(/\r?\n|\r/)

    return lines.filter(line => line.trim() !== '').map(line => line.trim())
}

/**
 * 提取非中文字符
 */
export function extractNonChineseChars(str: string) {
    // 正则表达式匹配非中文字符，同时排除回车(\r)和换行(\n)
    const regex = /[^\u4e00-\u9fa5\r\n]/g
    const matches = str.match(regex)
    return matches ? matches.join('') : ''
}
