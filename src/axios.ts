import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'

function createInstance(): AxiosInstance {
    const context = new Axios()
    const instance = Axios.prototype.request.bind(context)

    // 混合content中的原型方法和实例方法
    extend(instance, context)

    // 无法正确推断instance 类型，直接断言 AxiosInstance 类型
    return instance as AxiosInstance
}

const axios = createInstance()

export default axios
