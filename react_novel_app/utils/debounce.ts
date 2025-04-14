export type DebouncedFunction = {
    (...args: any[]): any
    cancel: () => void
}

export function debounce(fn: Function, delay: number, immediate: boolean = false): DebouncedFunction {
    let timerId: ReturnType<typeof setTimeout> | null = null

    const cancel = () => {
        if (timerId) {
            clearTimeout(timerId)
            timerId = null
        }
    }

    const debounced = function (this: any, ...args: any[]) {
        const context = this

        if (timerId) cancel()

        if (immediate && !timerId) {
            fn.apply(context, args)
        }

        timerId = setTimeout(() => {
            if (!immediate) {
                fn.apply(context, args)
            }
            timerId = null
        }, delay)
    }

    ;(debounced as any).cancel = cancel

    return debounced as unknown as DebouncedFunction
}
