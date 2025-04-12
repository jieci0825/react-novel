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
