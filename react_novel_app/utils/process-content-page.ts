/**
 * 将小说正文内容进行分成若干个页面数据
 */

import { CharacterSizeMap } from '@/app/read/read.type'
import { isChineseChar } from './check-type'

export interface PageDataItem {
    isNeedIndent: boolean
    content: string
}

export interface CharItem {
    char: string
    charIndex: number
    contentIndex: number
    isChineseChar: boolean
    width: number
}

export interface PageDataContext {
    _s: CharItem[] // 源数据
    curCharIndx: number // 当前字符索引。即遍历时整体数据时的位置
    curParagraphIndx: number // 上一个段落索引
    curParagraphCharIndx: number // 上一个段落字符索引，即本字符在本段落中的位置
    letterSpacing: number // 字间距
    indent: number // 缩进
    lineHeight: number // 行高
    paragraphSpacing: number // 段落间距
    curPageHeight: number // 当前页的高度
    curLineWidth: number // 当前行目前的宽度
    curPageNum: number // 当前页码
    curPageData: PageDataItem[] // 当前页的数据
    isNeedIndent: boolean // 是否需要缩进
    curParagraphData: PageDataItem // 当前段落的数据
    pageData: Record<number, PageDataItem[]> // 分页数据 {1:[[第一段...],[第一段...],[第一段...]], 2:[[第一段...],[第一段...],[第一段...]]}
    increaseLineWidth: (width: number) => void // 增加行宽
    newLine: () => void // 新行
    newParagraph: () => void // 新段落
    newPage: () => void // 新页
    isNeedNewLine: (charItem: CharItem) => boolean // 是否需要新行
    isNeedNewParagraph: (charItem: CharItem) => boolean // 是否需要新段落
    isNeedNewPage: () => boolean // 是否需要新开一页
    addCurParagraphData: (char: string) => void // 给当前段落添加数据
    resetCurParagraphData: () => void // 重置当前段落数据
}

function createParseContext({
    charItemList,
    letterSpacing,
    paragraphIndent,
    paragraphSpacing,
    lineHeight,
    containerSize
}: GetCharItemListParams): PageDataContext {
    const context: PageDataContext = {
        _s: JSON.parse(JSON.stringify(charItemList)), // 源数据
        curCharIndx: -1,
        curParagraphIndx: -1,
        curParagraphCharIndx: 0,
        letterSpacing: letterSpacing,
        indent: paragraphIndent,
        lineHeight,
        paragraphSpacing,
        curPageHeight: 0,
        curLineWidth: 0,
        curPageNum: 1,
        curPageData: [],
        isNeedIndent: true,
        curParagraphData: {
            isNeedIndent: true,
            content: ''
        },
        pageData: {},
        increaseLineWidth(width) {
            // width 即为当前字符的宽度
            this.curLineWidth += width
            // 还需要加上字符间距
            this.curLineWidth += this.letterSpacing
        },
        newLine() {
            // 开新行，则叠加页面高度
            this.curPageHeight += this.lineHeight
            // 重置行宽
            this.curLineWidth = 0
        },
        newParagraph() {
            // 叠加段落间隔。增加新开一个段落后的页面高度
            //  - -1 表示初始化，不要要叠加段间距
            if (this.curParagraphIndx !== -1) {
                this.curPageHeight += this.paragraphSpacing
            }

            // 新开段落的行宽需要重置为缩进
            this.curLineWidth = this.indent
            // 新开段落需要更新行高。因为新开了段落重新设置了行宽。所以后续的行高的逻辑就不会加上、需要手动设置
            this.curPageHeight += this.lineHeight

            // 将本段落数据保存到当前页数据中。有数据才保存
            if (this.curParagraphData.content.length > 0) {
                this.curPageData.push(this.curParagraphData)
                // 重置当前段落数据
                this.resetCurParagraphData()
            }
        },
        newPage() {
            // 如果还存在当前段落的字符，则保存当前段落数据
            if (this.curParagraphData.content.length > 0) {
                this.curPageData.push(this.curParagraphData)
            }

            // 保存当前页的数据
            this.pageData[this.curPageNum] = this.curPageData

            // 重置数据
            this.resetCurParagraphData()
            this.curPageData = []

            this.curPageNum++ // 页码+1
            this.curPageHeight = this.lineHeight // 页高重置为第一行的高度
            // 行宽新的一页无需重置。
            //  - 因为如果是切换段落之后需要分页，则行宽已经重置为缩进
            //  - 如果是段落中的某一行需要截断，则行宽已经重置为0
        },
        isNeedNewLine(charItem) {
            // 如果当前行宽加上当前字符的宽度大于容器宽度，则表示这个字符是新行的第一个字符
            const isNewLine = this.curLineWidth + charItem.width > containerSize.width
            if (isNewLine) {
                return true
            } else {
                // * 换行这里有个特殊情况，如果当前字符是中文，且加上字符宽度就是新行第一个字符就无所谓。
                // * 但是如果是中文，加上这个字符宽度之后，不是新行第一个字符，就需要检测他下一个字符是否是中文：
                //  - 如果是中文，则不做处理。返回 false。表是这个中文字符不是新行的第一个字符
                //  - 如果不是中文，则还要加上下一个非中文字符的宽度，如果超出了容器宽度，则返回 true，将当前中文字符作为新行第一个字符，因为标点符号这些。通常来说不能作为新行的第一个字符，段落开头就可以是，所以不需要处理段落
                const nextChar = this._s[this.curCharIndx + 1]
                // 如果下一个字符不存在。则直接返回之前的判断结果
                if (!nextChar) {
                    return isNewLine
                }

                // 检查这个下一个字符是否和当前字符是同一段落。不是同一个段落不处理
                if (nextChar.contentIndex !== charItem.contentIndex) {
                    return isNewLine
                }

                if (nextChar.isChineseChar) {
                    return false
                } else {
                    if (this.curLineWidth + charItem.width + nextChar.width > containerSize.width) {
                        return true
                    }
                    return false
                }
            }
        },
        isNeedNewParagraph(charItem) {
            // 如果当前的 charItem 的 contentIndex 大于上下文中的 curParagraphIndx，则表示需要新段落
            return charItem.contentIndex > this.curParagraphIndx
        },
        isNeedNewPage() {
            // 当前页高度大于等于容器高度时，需要新开一页。如果只是相等的话，则有可能是最后一行，无需新开一页
            if (this.curPageHeight > containerSize.height) {
                return true
            }
            return false
        },
        addCurParagraphData(char) {
            this.curParagraphData.content += char
            this.curParagraphData.isNeedIndent = this.isNeedIndent
        },
        resetCurParagraphData() {
            this.curParagraphData = {
                isNeedIndent: this.isNeedIndent,
                content: ''
            }
        }
    }

    return context
}

interface ProcessContentPageParams {
    characterSizeMap: CharacterSizeMap // 字符大小映射表
    containerSize: { width: number; height: number } // 容器大小
    lineHeight: number // 行高
    paragraphSpacing: number // 段落间距
    letterSpacing: number // 字间距
    paragraphIndent: number // 段落缩进距离
    contents: string[] // 内容数组
}
export default function processContentPage(params: ProcessContentPageParams) {
    const { characterSizeMap, containerSize, letterSpacing, lineHeight, paragraphSpacing, paragraphIndent, contents } =
        params

    if (containerSize.width === 0) return

    // 中文字符宽度
    const chineseWidth = characterSizeMap.current.get('chinese')?.width || 0

    // 获取字符列表
    const charItemList = getCharItemList(contents, chineseWidth, characterSizeMap)

    // 创建解析上下文
    const context = createParseContext({
        charItemList,
        letterSpacing,
        paragraphIndent,
        lineHeight,
        paragraphSpacing,
        containerSize
    })

    // 开始解析
    while (charItemList.length > 0) {
        context.curCharIndx++

        // 开始消费数据
        const charItem = charItemList.shift()!

        // 检测是否需要新段落
        if (context.isNeedNewParagraph(charItem)) {
            // * 每次开一个新段落，都需要将 isNeedIndent 设置为 true，防止从换行截断，处理到一个新段落时，还是不需要缩进状态
            context.isNeedIndent = true

            context.newParagraph()
            // 更新段落索引
            context.curParagraphIndx = charItem.contentIndex

            // 检测是否需要新页
            if (context.isNeedNewPage()) {
                context.newPage()
            }
        }

        // 检测是否需要新行
        if (context.isNeedNewLine(charItem)) {
            context.newLine()
            // 检测是否需要新页
            if (context.isNeedNewPage()) {
                // * 如果是从换行处分页的话，则表示到下一个新的段落之前，isNeedIndent 都会返回 false。后续这个段落的字符虽然是新开了一个段落，但是是需要缩进为0的，因为后续字符还是属于这个段落的。
                context.isNeedIndent = false
                context.newPage()
            }
        }

        // 更新当前行宽
        //  - 换行后会把行宽重置为0，所以这里需要加上当前行宽
        //  - 不换行则同样需要更新
        context.increaseLineWidth(charItem.width)
        // 将当前字符添加到当前段落数据中
        context.addCurParagraphData(charItem.char)
    }

    // 当遍历完成之后，需要检查当前页是否有数据，有数据则保存到当前页数据中。
    if (context.curParagraphData.content.length > 0) {
        // 即手动调用 newPage。因为 while 中没有处理
        context.newPage()
    }

    const result = []

    for (const key in context.pageData) {
        const pageData = context.pageData[key]
        const idx = +key - 1
        result[idx] = pageData
    }

    return result
}

interface GetCharItemListParams {
    charItemList: CharItem[]
    letterSpacing: number
    paragraphIndent: number
    lineHeight: number
    paragraphSpacing: number
    containerSize: { width: number; height: number }
}

function getCharItemList(contents: string[], chineseWidth: number, characterSizeMap: CharacterSizeMap) {
    const charItemList: CharItem[] = []

    for (let i = 0; i < contents.length; i++) {
        const content = contents[i]
        for (let j = 0; j < content.length; j++) {
            const char = content[j]

            const _isChineseChar = isChineseChar(char)

            const width = _isChineseChar ? chineseWidth : characterSizeMap.current.get(char)?.width || 0

            charItemList.push({ char, charIndex: j, contentIndex: i, isChineseChar: _isChineseChar, width })
        }
    }

    return charItemList
}
