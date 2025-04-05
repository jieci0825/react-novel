import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { RFValue } from "react-native-responsive-fontsize";
import React from "react";

function TabBarButton(props: any) {
  return (
    <>
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={props.onPress}
      >
        {props.children}
      </TouchableOpacity>
    </>
  );
}

export default function TabLayout() {
  const { theme } = useTheme();

  const screenHeight = useWindowDimensions().height;
  const height = Math.max(screenHeight * 0.09, 60);
  const mt = screenHeight > 800 ? Math.max(screenHeight * 0.008, 2) : 0;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primaryColor, // 激活的颜色
        tabBarInactiveTintColor: theme.tertiaryColor, // 未激活的颜色
        tabBarButton: (props: any) => <TabBarButton {...props} />, // 自定义 tabbar 的按钮
        headerShown: false, // 隐藏顶部导航栏
        tabBarStyle: {
          height,
        },
        tabBarLabelStyle: {
          marginTop: mt,
          fontSize: RFValue(10),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "书架",
          tabBarIcon: ({ color }: { color: string; focused: boolean }) => {
            return (
              <FontAwesome5 name="book" size={RFValue(24)} color={color} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarLabel: "发现",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => {
            return (
              // 也可以根据 focused 来单独设置 icon 不同状态下的颜色
              // <MaterialCommunityIcons
              //     name='compass'
              //     size={26}
              //     color={focused ? color : theme.tertiaryColor}
              // />
              <MaterialCommunityIcons
                name="compass"
                size={RFValue(26)}
                color={color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          tabBarLabel: "我的",
          tabBarIcon: ({ color }: { color: string; focused: boolean }) => {
            return <FontAwesome name="user" size={RFValue(24)} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
