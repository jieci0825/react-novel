import AsyncStorage from '@react-native-async-storage/async-storage'
import { isString } from './check-type'

// 存储数据
export const storeData = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error('存储失败:', e)
    }
}

// 读取数据
export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key)
        return value ? JSON.parse(value) : null
    } catch (e) {
        console.error('读取失败:', e)
    }
}

// 删除数据
export const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e) {
        console.error('删除失败:', e)
    }
}
