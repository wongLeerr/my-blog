import axios from 'axios'

const request = axios.create({
    baseURL:'/'
})

// 请求拦截器
request.interceptors.request.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use((response) => {
    if (response.status === 200) {
        return response.data
    } else {
        return {
            code: -1,
            msg: "未知错误",
            data:null
        }
    }
}, (error) => {
    return Promise.reject(error)
})


export default request