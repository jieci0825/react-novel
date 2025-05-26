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
    handleSetReadStyle: (data: ControllerItem, value: number) => void
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
        { label: '字号', field: 'fontSize', min: 12, max: 32, current: settingData.fontSize },
        { label: '字距', field: 'letterSpacing', min: 0, max: 4, current: settingData.letterSpacing },
        { label: '行高', field: 'lineHeight', min: 20, max: 40, current: settingData.lineHeight },
        { label: '段距', field: 'paragraphSpacing', min: 10, max: 20, current: settingData.paragraphSpacing }
    ])

    const [marginControllerList, setMarginControllerList] = useState<ControllerItem[]>([
        { label: '左右边距', field: 'paddingHorizontal', min: 0, max: 20, current: settingData.paddingHorizontal },
        { label: '上下边距', field: 'paddingVertical', min: 0, max: 20, current: settingData.paddingVertical }
    ])

    const onSetReadStyle = (raw: ControllerItem, value: number) => {
        if (value < raw.min || value > raw.max) return
        handleSetReadStyle(raw, value)
    }

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
                                            <View style={styles.controlItemBodyItemOperation}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        onSetReadStyle(item, +settingData[item.field] - 1)
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
                                                        onSetReadStyle(item, +settingData[item.field] + 1)
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
                                            <View style={styles.controlItemBodyItemOperation}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        onSetReadStyle(item, +settingData[item.field] - 1)
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
                                                        onSetReadStyle(item, +settingData[item.field] + 1)
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
                                <TouchableOpacity
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
                                </TouchableOpacity>
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
                                <TouchableOpacity style={[styles.controlItemBgItemBody]}>
                                    <View style={styles.controlItemBgItemBodyPreview}></View>
                                    <Text style={styles.controlItemBgItemBodyText}>天水碧</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.controlItemBgItemBody]}>
                                    <View style={styles.controlItemBgItemBodyPreview}></View>
                                    <Text style={styles.controlItemBgItemBodyText}>天水碧</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.controlItemBgItemBody]}>
                                    <View style={styles.controlItemBgItemBodyPreview}></View>
                                    <Text style={styles.controlItemBgItemBodyText}>天水碧</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.controlItemBgItemBody]}>
                                    <View style={styles.controlItemBgItemBodyPreview}></View>
                                    <Text style={styles.controlItemBgItemBodyText}>天水碧</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.controlItemBgItemBody]}>
                                    <View style={styles.controlItemBgItemBodyPreview}></View>
                                    <Text style={styles.controlItemBgItemBodyText}>天水碧</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.controlItemBgItemBody]}>
                                    <View style={styles.controlItemBgItemBodyPreview}></View>
                                    <Text style={styles.controlItemBgItemBodyText}>天水碧</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        </>
    )
}
