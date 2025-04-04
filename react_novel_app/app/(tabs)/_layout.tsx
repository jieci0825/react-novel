import FontAwesome from '@expo/vector-icons/FontAwesome'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Tabs } from 'expo-router'
import { LightVariable } from '@/styles/variable'
import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

function TabBarBotton(props: any) {
    return (
        <>
            <TouchableOpacity
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={props.onPress}
            >
                {props.children}
            </TouchableOpacity>
        </>
    )
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: LightVariable.primaryColor, // 激活的颜色
                tabBarInactiveTintColor: LightVariable.tertiaryColor, // 未激活的颜色
                tabBarButton: (props: any) => <TabBarBotton {...props} />, // 自定义 tabbar 的按钮
                headerShown: false // 隐藏顶部导航栏
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    tabBarLabel: '书架',
                    tabBarIcon: ({ color }: { color: string; focused: boolean }) => {
                        return (
                            <FontAwesome5
                                name='book'
                                size={24}
                                color={color}
                            />
                        )
                    }
                }}
            />
            <Tabs.Screen
                name='discover'
                options={{
                    tabBarLabel: '发现',
                    tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => {
                        return (
                            // 也可以根据 focused 来单独设置 icon 不同状态下的颜色
                            // <MaterialCommunityIcons
                            //     name='compass'
                            //     size={26}
                            //     color={focused ? color : LightVariable.tertiaryColor}
                            // />
                            <MaterialCommunityIcons
                                name='compass'
                                size={26}
                                color={color}
                            />
                        )
                    }
                }}
            />
            <Tabs.Screen
                name='user'
                options={{
                    tabBarLabel: '我的',
                    tabBarIcon: ({ color }: { color: string; focused: boolean }) => {
                        return (
                            <FontAwesome
                                name='user'
                                size={24}
                                color={color}
                            />
                        )
                    }
                }}
            />
        </Tabs>
    )
}
