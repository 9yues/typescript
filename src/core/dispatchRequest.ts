import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders } from '../helpers/headers'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    processConfig(config)
    return xhr(config).then(res => {
        // 默认将data数据做成json格式返回出去
        return transformResponseData(res)
    })
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    config.headers = transformHeaders(config)
    config.data = transformRequestData(config)
}

/**
 * 拼接url参数
 * @param config
 */
function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config
    // url! 代表类型断言不为空
    return buildURL(url!, params)
}

/**
 * 尝试转换data为对象
 * @param config
 */
function transformRequestData(config: AxiosRequestConfig): any {
    return transformRequest(config.data)
}

/**
 * 将headers转换为对象
 * @param config
 */
function transformHeaders(config: AxiosRequestConfig): any {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transformResponse(res.data)
    return res
}
