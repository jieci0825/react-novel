import { useEffect, useRef, useState } from 'react'

/**
 * 自定义 Hook，用于创建响应式状态
 * @template T 状态的类型参数
 * @param initialState 初始状态值
 * @returns 返回响应式状态及其更新函数
 */
export default function useReactiveState<T>(initialState: T) {
    const [state, setState] = useState(initialState)
    const stateRef = useRef(state)
    useEffect(() => {
        stateRef.current = state
    }, [state])

    return [stateRef, setState, state] as const
}
