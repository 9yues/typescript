import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url, method = 'get', headers, responseType, timeout } = config

        const request = new XMLHttpRequest()

        // 这里接受用户端传递responseType，xhr会帮我们将 response 设置为对应的json格式
        if (responseType) request.responseType = responseType

        // 这里接收超时时间
        if (timeout) request.timeout = timeout

        request.open(method.toUpperCase(), url!, true)

        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) return

            if (request.status === 0) return

            // 处理headers为对象
            const responseHeaders = parseHeaders(request.getAllResponseHeaders())

            // 这里根据用户端传递的responseType 决定返回的数据类型
            const responseData = responseType !== 'text' ? request.response : request.responseText

            // 返回我们自定义组装response对象
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                test: request,
                config,
                request
            }

            // 判断状态码resolve出去
            handleResponse(response)
        }

        // 网络错误
        request.onerror = function handleError() {
            reject(createError('Network Error', config, null, request))
        }

        // 超时处理
        request.ontimeout = function handleTimeout() {
            reject(
                createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request)
            )
        }

        Object.keys(headers).map(name => {
            // 没有数据时，设置content-type没有意义
            if (data === null && name.toUpperCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }
        })

        request.send(data)

        function handleResponse(response: AxiosResponse): void {
            if (response.status >= 200 && response.status < 300) {
                resolve(response)
            } else {
                reject(
                    createError(
                        `Request failed with status code ${response.status}`,
                        config,
                        null,
                        request,
                        response
                    )
                )
            }
        }
    })
}
