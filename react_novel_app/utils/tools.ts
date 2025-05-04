import { DESIGN_WIDTH, DESIGN_HEIGHT } from '@/constants/Size'
import { useWindowDimensions } from 'react-native'

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
