import { ReaderSetting } from '@/types'
import { TextStyle } from 'react-native'

export type CharacterSizeMap = React.MutableRefObject<
    Map<
        string,
        {
            width: number
            height: number
        }
    >
>

export type AnimationType = 'scroll' | 'page' | 'none' | 'simulation' | 'slide'

export interface ReadContentBase {
    currentChapterName: string
    content: string
    contents: string[]
    animation: AnimationType
    readSetting: ReaderSetting
    dynamicTextStyles: TextStyle
    characterSizeMap: CharacterSizeMap
}

type ReaderSettingKeys = keyof ReaderSetting

export interface ControllerItem {
    label: string
    step: number
    field: ReaderSettingKeys
    min: number // 不具备实际限制意义，用于限制区间，来得出不同区间时，一个百分比处于这个区间的那个值
    max: number // 不具备实际限制意义，用于限制区间，来得出不同区间时，一个百分比处于这个区间的那个值
    current: number // 当前值，即一个处于最大值和最小值之间的值
}

export default {}
