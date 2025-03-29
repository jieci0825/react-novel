import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import { LightVariable } from '@/styles/variable'
import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

function TabBarBotton(props: any) {
    // console.log('🚢 ~ 当前打印的内容 ~ props:', props)

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
                tabBarActiveTintColor: LightVariable.primaryColor,
                tabBarButton: (props: any) => <TabBarBotton {...props} />,
                headerShown: false
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    tabBarLabel: '首页1',
                    tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => {
                        return (
                            <FontAwesome
                                name='home'
                                size={24}
                                color={focused ? color : LightVariable.textTertiaryColor}
                            />
                        )
                    }
                }}
            />
            <Tabs.Screen
                name='user'
                options={{
                    tabBarLabel: '用户1',
                    tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => {
                        return (
                            <FontAwesome
                                name='user'
                                size={24}
                                color={focused ? color : LightVariable.textTertiaryColor}
                            />
                        )
                    }
                }}
            />
        </Tabs>
    )
}
