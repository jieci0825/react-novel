import PageHeader from '@/components/page-header/page-header'
import { Theme, useTheme } from '@/hooks/useTheme'
import { menuListStyles, userContentStyles, userDataStyles, userStyles } from '@/styles/tabs/user.style'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import TextOverflowHidden from '@/components/text-overflow-hidden/text-overflow-hidden'
import Ionicons from '@expo/vector-icons/Ionicons'
import Entypo from '@expo/vector-icons/Entypo'
import React from 'react'
import { isFunction } from '@/utils'
import { Switch } from '@/components/ui/switch'
import PageToast from '@/components/page-toast/page-toast'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

// 用户头部
function UserHeader() {
    const { theme } = useTheme()

    const goToEditProfile = () => {
        console.log('edit profile')
    }

    const slots = {
        right: () => (
            <TouchableOpacity onPress={goToEditProfile}>
                <Feather
                    name='edit'
                    size={RFValue(20)}
                    color={theme.tertiaryColor}
                />
            </TouchableOpacity>
        )
    }

    return (
        <>
            <PageHeader
                title='个人中心'
                slots={slots}
            />
        </>
    )
}

// 用户内容
function UserContent() {
    const { theme } = useTheme()

    const styles = userContentStyles(theme)

    return (
        <View style={styles.userContentWrap}>
            <View style={styles.avatarWrap}>
                <FontAwesome5
                    name='user-alt'
                    size={RFValue(20)}
                    color={theme.tertiaryColor}
                />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>用户名</Text>
                <TextOverflowHidden style={styles.userSign}>这个人很懒，什么都没留下~</TextOverflowHidden>
            </View>
        </View>
    )
}

// 个人数据
function UserData() {
    const { theme } = useTheme()

    const styles = userDataStyles(theme)

    return (
        <>
            <View style={styles.userDataWrap}>
                <View style={styles.userDataItem}>
                    <Text style={styles.dataValue}>0</Text>
                    <Text style={styles.dataLabel}>阅读时长</Text>
                </View>
                <View style={styles.userDataItem}>
                    <Text style={styles.dataValue}>0</Text>
                    <Text style={styles.dataLabel}>书签</Text>
                </View>
                <View style={styles.userDataItem}>
                    <Text style={styles.dataValue}>0</Text>
                    <Text style={styles.dataLabel}>已读书籍</Text>
                </View>
            </View>
        </>
    )
}

interface MenuItem {
    icon: React.ReactNode
    title: string
    right?: React.ReactNode
    click?: Function
}

interface MenuListProps {
    list: MenuItem[]
}

// 菜单列表
function MenuList(props: MenuListProps) {
    const { theme } = useTheme()

    const styles = menuListStyles(theme)

    return (
        <ScrollView style={styles.menuWrap}>
            {props.list.map((menu, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            isFunction(menu.click) && menu.click()
                        }}
                    >
                        <View style={styles.menuItem}>
                            <View style={styles.menuIcon}>{menu.icon}</View>
                            <Text style={styles.menuText}>{menu.title}</Text>
                            <View style={styles.menuAct}>
                                {menu.right || (
                                    <TouchableOpacity
                                        onPress={() => {
                                            isFunction(menu.click) && menu.click()
                                        }}
                                    >
                                        <Entypo
                                            name='chevron-thin-right'
                                            size={RFValue(16)}
                                            color={theme.tertiaryColor}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
}

// 生成菜单列表
function generateMenuListData(theme: Theme): MenuItem[] {
    const menuList: MenuItem[] = [
        {
            icon: (
                <FontAwesome5
                    name='history'
                    size={RFValue(15)}
                    color={theme.tertiaryColor}
                />
            ),
            title: '阅读历史',
            click: () => {
                console.log('阅读历史')
            }
        },
        {
            icon: (
                <MaterialCommunityIcons
                    name='cloud-refresh'
                    size={RFValue(18)}
                    color={theme.tertiaryColor}
                />
            ),
            title: '数据备份',
            click: () => {
                // 因为书源的不稳定性，所以并不会将用户的书架数据、阅读进度、书签等信息同步到云端
                //  - 但是你可以在更换设备的时候，进行数据备份，此时系统会自动将书架数据、阅读进度、书签等信息备份到云端
                //  - 当你使用新设备之后，可以通过数据恢复功能，将之前的数据恢复到新设备上
                console.log('数据备份')
            }
        },
        {
            icon: (
                <Ionicons
                    name='bookmark'
                    size={RFValue(18)}
                    color={theme.tertiaryColor}
                />
            ),
            title: '我的书签',
            click: () => {
                console.log('我的书签')
            }
        },
        {
            icon: (
                <Ionicons
                    name='moon'
                    size={RFValue(18)}
                    color={theme.tertiaryColor}
                />
            ),
            title: '夜间模式',
            right: (
                <>
                    <Switch
                        size='sm'
                        trackColor={{ false: theme.switch.track.falseColor, true: theme.switch.track.trueColor }}
                        thumbColor={theme.switch.thumb.color}
                        /* @ts-ignore */
                        activeThumbColor={theme.switch.thumb.color}
                    />
                </>
            )
        },
        {
            icon: (
                <FontAwesome5
                    name='font'
                    size={RFValue(18)}
                    color={theme.tertiaryColor}
                />
            ),
            title: '字体设置',
            right: (
                <PageToast
                    options={{
                        message: '字体设置功能开发中，敬请期待...'
                    }}
                >
                    <Entypo
                        name='chevron-thin-right'
                        size={RFValue(16)}
                        color={theme.tertiaryColor}
                    />
                </PageToast>
            )
        },
        {
            icon: (
                <Entypo
                    name='info-with-circle'
                    size={RFValue(18)}
                    color={theme.tertiaryColor}
                />
            ),
            title: '关于我们',
            click: () => {
                console.log('关于我们')
            }
        },
        {
            icon: (
                <Entypo
                    name='download'
                    size={RFValue(20)}
                    color={theme.tertiaryColor}
                />
            ),
            title: '检查更新',
            right: (
                <PageToast
                    options={{
                        message: '检查更新功能开发中，敬请期待...'
                    }}
                >
                    <Entypo
                        name='chevron-thin-right'
                        size={RFValue(16)}
                        color={theme.tertiaryColor}
                    />
                </PageToast>
            )
        }
    ]
    return menuList
}

export default function User() {
    const { theme } = useTheme()

    const styles = userStyles(theme)

    const menuList = generateMenuListData(theme)

    return (
        <View style={styles.container}>
            <UserHeader />
            <View style={styles.content}>
                <UserContent />
                <UserData />
                <MenuList list={menuList} />
            </View>
        </View>
    )
}
