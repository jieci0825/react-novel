import { useTheme } from '@/hooks/useTheme'
import { readerSettingCompStyles } from '@/styles/pages/read.styles'
import { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { ReaderSetting } from '@/types'
import { AnimationType, ControllerItem } from '../read.type'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { RFValue } from 'react-native-responsive-fontsize'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import { adaptiveSize } from '@/utils'

interface ReaderSettingCompProps {
    handleSetReadStyle: (
        field: ControllerItem['field'] | ControllerItem['field'][],
        value: number | string | Array<string | number>
    ) => void
    settingData: ReaderSetting
    animation: AnimationType
    setReadAnimation: React.Dispatch<React.SetStateAction<AnimationType>>
    close: () => void
}
export default function ReaderSettingComp({
    handleSetReadStyle,
    settingData,
    animation,
    setReadAnimation,
    close
}: ReaderSettingCompProps) {
    const { theme } = useTheme()
    const styles = readerSettingCompStyles(theme)

    const [fontControllerList, setFontControllerList] = useState<ControllerItem[]>([
        { label: '字号', field: 'fontSize', min: 12, max: 32, step: 1, current: settingData.fontSize },
        { label: '字距', field: 'letterSpacing', min: 0, max: 4, step: 0.5, current: settingData.letterSpacing },
        { label: '行高', field: 'lineHeight', min: 20, max: 60, step: 1, current: settingData.lineHeight },
        { label: '段距', field: 'paragraphSpacing', min: 10, max: 20, step: 1, current: settingData.paragraphSpacing }
    ])

    const [marginControllerList, setMarginControllerList] = useState<ControllerItem[]>([
        {
            label: '左右边距',
            field: 'paddingHorizontal',
            min: 0,
            max: 20,
            step: 1,
            current: settingData.paddingHorizontal
        },
        { label: '上下边距', field: 'paddingVertical', min: 0, max: 20, step: 1, current: settingData.paddingVertical }
    ])

    const onSetReadStyle = (raw: ControllerItem, value: number) => {
        if (value < raw.min || value > raw.max) return
        handleSetReadStyle(raw.field, value)
    }

    const bgColorList = [
        { text: '象牙', bgColor: '#eeeadc', textColor: '#181716' },
        { text: '黄河琉璃', bgColor: '#CCC0A6', textColor: '#211500' },
        { text: '月白', bgColor: '#d4e5ef', textColor: '#151717' },
        { text: '茶白', bgColor: '#DED9C3', textColor: '#171200' },
        { text: '竹皇', bgColor: '#b9dec9', textColor: '#000F00' },
        { text: '鱼肚白', bgColor: '#C8D0D4', textColor: '#191919' },
        { text: '暮山紫', bgColor: '#A4AAD8', textColor: '#1F2937' }
    ]

    return (
        <>
            <TouchableOpacity
                onPress={e => {
                    e.stopPropagation()
                    close()
                }}
                activeOpacity={1}
                style={styles.container}
            >
                <TouchableOpacity
                    onPress={e => e.stopPropagation()}
                    activeOpacity={1}
                    style={styles.containerInner}
                >
                    <ScrollView style={{ width: '100%', height: '100%', padding: adaptiveSize(10), paddingTop: 0 }}>
                        {/* 排版 */}
                        <View style={styles.controlItem}>
                            <View style={styles.controlItemHead}>
                                <FontAwesome
                                    name='font'
                                    size={RFValue(16)}
                                    color={theme.textPrimaryColor}
                                />
                                <Text style={styles.controlItemHeadText}>字体排版</Text>
                            </View>
                            <View style={styles.controlItemBody}>
                                {fontControllerList.map((item, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={styles.controlItemBodyItem}
                                        >
                                            <Text style={styles.controlItemBodyItemText}>{item.label}</Text>
                                            <Text
                                                style={[
                                                    styles.controlItemBodyItemText,
                                                    {
                                                        color: theme.textTertiaryColor,
                                                        fontSize: RFValue(10),
                                                        marginLeft: 5
                                                    }
                                                ]}
                                            >{`（${item.min}~${item.max}）`}</Text>
                                            <View style={styles.controlItemBodyItemOperation}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        onSetReadStyle(item, +settingData[item.field] - item.step)
                                                    }}
                                                    style={styles.controlItemBodyItemOperationBtn}
                                                >
                                                    <Feather
                                                        name='minus'
                                                        size={RFValue(16)}
                                                        color={theme.textSecondaryColor}
                                                    />
                                                </TouchableOpacity>
                                                <Text style={[styles.controlItemBodyItemOperationValue]}>
                                                    {settingData[item.field]}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        onSetReadStyle(item, +settingData[item.field] + item.step)
                                                    }}
                                                    style={styles.controlItemBodyItemOperationBtn}
                                                >
                                                    <Feather
                                                        name='plus'
                                                        size={RFValue(16)}
                                                        color={theme.textSecondaryColor}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        {/* 边距 */}
                        <View style={styles.controlItem}>
                            <View style={styles.controlItemHead}>
                                <Feather
                                    name='layout'
                                    size={RFValue(16)}
                                    color={theme.primaryColor}
                                />
                                <Text style={styles.controlItemHeadText}>容器边距</Text>
                            </View>
                            <View style={styles.controlItemBody}>
                                {marginControllerList.map((item, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={styles.controlItemBodyItem}
                                        >
                                            <Text style={styles.controlItemBodyItemText}>{item.label}</Text>
                                            <Text
                                                style={[
                                                    styles.controlItemBodyItemText,
                                                    {
                                                        color: theme.textTertiaryColor,
                                                        fontSize: RFValue(10),
                                                        marginLeft: 5
                                                    }
                                                ]}
                                            >{`（${item.min}~${item.max}）`}</Text>
                                            <View style={styles.controlItemBodyItemOperation}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        onSetReadStyle(item, +settingData[item.field] - item.step)
                                                    }}
                                                    style={styles.controlItemBodyItemOperationBtn}
                                                >
                                                    <Feather
                                                        name='minus'
                                                        size={RFValue(16)}
                                                        color={theme.textSecondaryColor}
                                                    />
                                                </TouchableOpacity>
                                                <Text style={[styles.controlItemBodyItemOperationValue]}>
                                                    {settingData[item.field]}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        onSetReadStyle(item, +settingData[item.field] + item.step)
                                                    }}
                                                    style={styles.controlItemBodyItemOperationBtn}
                                                >
                                                    <Feather
                                                        name='plus'
                                                        size={RFValue(16)}
                                                        color={theme.textSecondaryColor}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        {/* 翻页 */}
                        <View style={styles.controlItem}>
                            <View style={styles.controlItemHead}>
                                <Ionicons
                                    name='settings-outline'
                                    size={RFValue(16)}
                                    color={theme.primaryColor}
                                />
                                <Text style={styles.controlItemHeadText}>翻页模式</Text>
                            </View>
                            <View style={styles.controlItemBtnsBody}>
                                <TouchableOpacity
                                    style={[
                                        styles.controlItemBtnsBodyBtn,
                                        animation === 'none' && { backgroundColor: theme.primaryColor }
                                    ]}
                                    onPress={() => {
                                        setReadAnimation('none')
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.controlItemBtnsBodyBtnText,
                                            animation === 'none' && { color: theme.bgColor }
                                        ]}
                                    >
                                        无动画
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.controlItemBtnsBodyBtn,
                                        animation === 'slide' && { backgroundColor: theme.primaryColor }
                                    ]}
                                    onPress={() => {
                                        setReadAnimation('slide')
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.controlItemBtnsBodyBtnText,
                                            animation === 'slide' && { color: theme.bgColor }
                                        ]}
                                    >
                                        滑动
                                    </Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity
                                    style={[
                                        styles.controlItemBtnsBodyBtn,
                                        animation === 'scroll' && { backgroundColor: theme.primaryColor }
                                    ]}
                                    onPress={() => {
                                        setReadAnimation('scroll')
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.controlItemBtnsBodyBtnText,
                                            animation === 'scroll' && { color: theme.bgColor }
                                        ]}
                                    >
                                        滚动
                                    </Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                        {/* 背景 */}
                        <View
                            style={[
                                styles.controlItem,
                                {
                                    borderBottomWidth: 0
                                }
                            ]}
                        >
                            <View style={styles.controlItemHead}>
                                <Ionicons
                                    name='color-palette-outline'
                                    size={RFValue(16)}
                                    color={theme.primaryColor}
                                />
                                <Text style={styles.controlItemHeadText}>阅读背景</Text>
                            </View>
                            <ScrollView
                                horizontal
                                style={styles.controlItemBgBody}
                            >
                                {bgColorList.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={e => {
                                                handleSetReadStyle(
                                                    ['backgroundColor', 'textColor'],
                                                    [item.bgColor, item.textColor]
                                                )
                                            }}
                                            key={index}
                                            style={[styles.controlItemBgItemBody]}
                                        >
                                            <View
                                                style={[
                                                    styles.controlItemBgItemBodyPreview,
                                                    {
                                                        backgroundColor: item.bgColor
                                                    }
                                                ]}
                                            ></View>
                                            <Text style={styles.controlItemBgItemBodyText}>{item.text}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        </>
    )
}
