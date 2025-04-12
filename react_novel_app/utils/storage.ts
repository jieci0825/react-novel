// storage.ts
import { MMKV } from 'react-native-mmkv'
import { isArray, isObject } from './check-type'

export class NovelStorage {
    private static instance: MMKV

    public static getInstance(): MMKV {
        if (!NovelStorage.instance) {
            NovelStorage.instance = new MMKV({
                id: 'novel-storage'
            })
        }
        return NovelStorage.instance
    }

    // 存储
    public static setItem(key: string, value: any) {
        const storage = NovelStorage.getInstance()
        if (isObject(value)) {
            value = JSON.stringify(value)
        }
        storage.set(key, value)
    }

    // 获取
    public static getItem(key: string) {
        const storage = NovelStorage.getInstance()
        const value: any = storage.getString(key)
        if (!value) {
            return null
        }
        try {
            return JSON.parse(value)
        } catch (e) {
            return value
        }
    }

    // 移除指定的数据
    public static removeItem(key: string) {
        const storage = NovelStorage.getInstance()
        const keys = isArray(key) ? key : [key]
        for (const k of keys) {
            storage.delete(k)
        }
    }

    // 清空所有数据
    public static clear() {
        const storage = NovelStorage.getInstance()
        storage.clearAll()
    }
}

export const storage = NovelStorage.getInstance()
