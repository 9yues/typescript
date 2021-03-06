const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//     return val !== null && typeof val === 'object'
// }

/**
 * 返回一个普通对象
 * @param val
 */
export function isPlainObject(val: any): val is Object {
    return toString.call(val) === '[object Object]'
}

/**
 * 混合对象 拷贝 form的原型方法和实例方法到 to
 * @param to
 * @param from
 */
export function extend<T, U>(to: T, from: U): T & U {
    for (const key in from) {
        ;(to as T & U)[key] = from[key] as any
    }

    return to as T & U
}
