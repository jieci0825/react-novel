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

export interface ReaderSetting {
    fontSize: number // 字体大小
    lineHeight: number // 行高
    letterSpacing: number // 字间距
    paragraphSpacing: number // 段间距
    fontFamily: string // 字体
    paddingHorizontal: number // 左右边距
    paddingVertical: number // 上下边距
    backgroundColor: string
    textColor: string
    indent: number // 缩进
}

export interface ReadContentBase {
    content: string
    contents: string[]
    animation: 'scroll' | 'page' | 'none' | 'simulation'
    readSetting: ReaderSetting
    dynamicTextStyles: TextStyle
    characterSizeMap: CharacterSizeMap
}

export default {}
