import { isDate, isPlainObject } from './util'

function encode(val: string): string {
    // 将编码过后的特殊字符装换成可视度高的字符
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params: any): string {
    if (!params) return url

    const parts: string[] = []

    // 遍历对象key
    Object.keys(params).map(key => {
        // 拿到key的val
        const val = params[key]

        if (val === null || typeof val === 'undefined') return

        let values: string[]

        // 判断是否是数组
        if (Array.isArray(val)) {
            values = val
            key += '[]'
        } else {
            values = [val]
        }

        // 遍历val为数组的情况
        values.map(val => {
            // 使用 ISO 标准 `2020-04-25T09:09:48.550Z`
            if (isDate(val)) {
                val = val.toISOString()
            } else if (isPlainObject(val)) {
                val = JSON.stringify(val)
            }
            parts.push(`${encode(key)}=${encode(val)}`)
        })
    })

    // 转换成字符串并且以 & 符号分割
    let serializedParams = parts.join('&')

    if (serializedParams) {
        // 是否
        const marIndex = url.indexOf('#')
        if (marIndex !== -1) {
            // 截取url `#` 号之前的地址
            url = url.slice(0, marIndex)
        }
        // 拼接 ? &
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }
    return url
}
