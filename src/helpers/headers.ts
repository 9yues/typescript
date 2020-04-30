import { isPlainObject } from './util'

/**
 * 对比 content-type
 * @param headers
 * @param normalizedName
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
    if (!headers) return
    Object.keys(headers).map(name => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name]
            delete headers[name]
        }
    })
}

/**
 * 处理content-type大小写问题
 * @param headers
 * @param data
 */
export function processHeaders(headers: any, data: any): any {
    normalizeHeaderName(headers, 'Content-Type')

    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }

    return headers
}

/**
 * 过滤headers为对象
 * @param headers
 */
export function parseHeaders(headers: string): any {
    let parsed = Object.create(null)
    if (!headers) return parsed

    headers.split('\r\n').map(line => {
        let [key, val] = line.split(':')
        key = key.trim().toLowerCase()

        if (!key) return

        if (val) val = val.trim()

        parsed[key] = val
    })

    return parsed
}
