/**
 * @description Axios 混合增强封装
 * - 拦截器统一处理 token 注入、业务错误、401 登录跳转
 * - request 函数支持泛型，直接返回业务 data
 * - 方便维护与类型安全
 */

import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/stores'

// ======================== 基础配置 ========================
export const baseURL = 'https://x9zmst6evg.sealoshzh.site/admin'

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
})

// ======================== 类型定义 ========================

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// ======================== 拦截器 ========================

// 请求拦截器：注入 token
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.set('Authorization', userStore.token)
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：统一处理业务逻辑
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message } = response.data
    if (code === 200) {
      return response // 这里返回原始 response，用外层 request 统一解耦
    }
    ElMessage.error(message || '服务异常')
    return Promise.reject(new Error(message || '接口异常'))
  },
  (error) => {
    const msg = error.response?.data?.message || error.message || '服务异常'
    ElMessage.error(msg)

    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.clearToken?.()
      router.push('/login')
    }

    return Promise.reject(error)
  },
)

// ======================== request 函数 ========================

/**
 * @description 类型安全请求函数
 * @template T 返回业务数据类型
 * @param config AxiosRequestConfig
 * @returns Promise<T>
 */
export async function request<T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await instance.request<ApiResponse<T>>(config)
    // ✅ 返回整个 response.data，包括 code / message / data
    return response.data
  } catch (error) {
    throw error
  }
}
