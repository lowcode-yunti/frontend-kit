import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
	type AxiosError,
} from "axios"
import { GlobalEnvConfig } from "../config/env"
import { STORAGE_KEYS } from "../constants/storageKeys"

/**
 * 默认axios配置
 */
export const defaultAxiosConfig: AxiosRequestConfig = {
	baseURL: GlobalEnvConfig.BASE_API,
	timeout: 1000 * 60 * 60,
	headers: {
		"Content-Type": "application/json",
	},
	adapter: "fetch",
}

/**
 * 获取本地存储的token
 */
export function getLocalStorageToken(): string | null {
	return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * 设置本地存储的token
 */
export function setLocalStorageToken(token: string): void {
	localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
}

/**
 * 移除本地存储的token
 */
export function removeLocalStorageToken(): void {
	localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * 请求拦截器回调
 */
export interface RequestInterceptorCallbacks {
	/**
	 * 请求成功前的处理，可以修改请求配置
	 * @param config - 请求配置
	 * @returns 修改后的请求配置
	 */
	onRequestSuccess?: (
		config: InternalAxiosRequestConfig,
	) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>

	/**
	 * 请求失败时的处理
	 * @param error - 错误对象
	 * @returns 错误处理结果
	 */
	onRequestError?: (error: Error) => Promise<never>
}

/**
 * 响应拦截器回调
 */
export interface ResponseInterceptorCallbacks {
	/**
	 * 响应成功时的处理
	 * @param response - 响应对象
	 * @returns 处理后的响应
	 */
	onResponseSuccess?: <T = unknown>(
		response: AxiosResponse<T>,
	) => AxiosResponse<T> | Promise<AxiosResponse<T>>

	/**
	 * 响应失败时的处理
	 * @param error - 错误对象
	 * @returns 错误处理结果
	 */
	onResponseError?: (error: AxiosError) => Promise<never>
}

/**
 * Token刷新相关回调
 */
export interface TokenRefreshCallbacks {
	/**
	 * 判断是否需要刷新token（例如401/403错误）
	 * @param error - 错误对象
	 * @returns 是否需要刷新token
	 */
	shouldRefreshToken?: (error: AxiosError) => boolean

	/**
	 * 执行token刷新的逻辑
	 * @returns 刷新成功返回true，失败返回false
	 */
	refreshToken?: () => Promise<boolean>

	/**
	 * token刷新失败后的处理（例如跳转登录页）
	 * @param error - 错误对象
	 */
	onRefreshTokenFailed?: (error: AxiosError) => void
}

/**
 * 创建axios实例的配置选项
 */
export interface CreateAxiosInstanceOptions {
	/**
	 * axios基础配置
	 */
	axiosConfig?: AxiosRequestConfig

	/**
	 * 请求拦截器回调
	 */
	requestInterceptor?: RequestInterceptorCallbacks

	/**
	 * 响应拦截器回调
	 */
	responseInterceptor?: ResponseInterceptorCallbacks

	/**
	 * Token刷新相关回调
	 */
	tokenRefresh?: TokenRefreshCallbacks
}

/**
 * 失败请求队列项
 */
interface FailedRequestQueueItem {
	resolve: (value: unknown) => void
	reject: (reason?: unknown) => void
	config: InternalAxiosRequestConfig
}

/**
 * 创建axios实例
 * @param options - 配置选项
 * @returns axios实例
 */
export function createAxiosInstance(
	options: CreateAxiosInstanceOptions = {},
): AxiosInstance {
	const {
		axiosConfig = defaultAxiosConfig,
		requestInterceptor = {},
		responseInterceptor = {},
		tokenRefresh = {},
	} = options

	// 合并默认配置和用户配置
	const mergedConfig = {
		...defaultAxiosConfig,
		...axiosConfig,
		headers: {
			...defaultAxiosConfig.headers,
			...axiosConfig.headers,
		},
	}

	// 创建axios实例
	const instance = axios.create(mergedConfig)

	// Token刷新状态管理
	let isRefreshing = false
	let failedQueue: FailedRequestQueueItem[] = []

	/**
	 * 处理失败队列中的请求
	 */
	const processQueue = (error: AxiosError | null) => {
		failedQueue.forEach((item) => {
			if (error) {
				item.reject(error)
			} else {
				item.resolve(instance(item.config))
			}
		})
		failedQueue = []
	}

	// 请求拦截器
	instance.interceptors.request.use(
		(config) => {
			if (requestInterceptor.onRequestSuccess) {
				return requestInterceptor.onRequestSuccess(config)
			}
			return config
		},
		(error: Error) => {
			if (requestInterceptor.onRequestError) {
				return requestInterceptor.onRequestError(error)
			}
			return Promise.reject(error)
		},
	)

	// 响应拦截器
	instance.interceptors.response.use(
		(response) => {
			if (responseInterceptor.onResponseSuccess) {
				return responseInterceptor.onResponseSuccess(response)
			}
			return response
		},
		async (error: AxiosError) => {
			const { shouldRefreshToken, refreshToken, onRefreshTokenFailed } =
				tokenRefresh

			// 如果配置了token刷新逻辑且需要刷新token
			if (
				shouldRefreshToken &&
				refreshToken &&
				shouldRefreshToken(error) &&
				error.config
			) {
				const originalRequest = error.config

				// 如果正在刷新token，将请求加入队列
				if (isRefreshing) {
					return new Promise((resolve, reject) => {
						failedQueue.push({
							resolve,
							reject,
							config: originalRequest,
						})
					})
				}

				isRefreshing = true

				try {
					// 执行token刷新
					const success = await refreshToken()

					if (success) {
						// 刷新成功，处理队列中的请求
						processQueue(null)
						// 重试原始请求
						return instance(originalRequest)
					}
					// 刷新失败
					processQueue(error)
					if (onRefreshTokenFailed) {
						onRefreshTokenFailed(error)
					}
					return Promise.reject(error)
				} catch (refreshError) {
					// 刷新过程出错
					processQueue(error)
					if (onRefreshTokenFailed) {
						onRefreshTokenFailed(error)
					}
					return Promise.reject(refreshError)
				} finally {
					isRefreshing = false
				}
			}

			// 如果配置了响应错误处理
			if (responseInterceptor.onResponseError) {
				return responseInterceptor.onResponseError(error)
			}

			return Promise.reject(error)
		},
	)

	return instance
}

/**
 * 导出axios类型供外部使用
 */
export type {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
	AxiosError,
}

/**
 * 导出SSE相关功能
 */
export {
	createSSEConnection,
	createSSEConnectionWithEventSource,
	type SSEMessageEvent,
	type SSEConnectionOptions,
	type SSEConnection,
} from "./sse"
