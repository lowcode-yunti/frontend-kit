import { GlobalEnvConfig } from "@/config/env"
import { STORAGE_KEYS } from "@/constants/storageKeys"
import type { RequestResponse } from "@/types/request"
import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosError,
	type AxiosRequestHeaders,
	type InternalAxiosRequestConfig,
	type AxiosResponse,
} from "axios"

// Define callback types
export interface AxiosCallbacks {
	onRefreshToken: () => Promise<{ token: string }>
	onRedirectToLogin: () => void
	onSkipAuthCheck?: () => boolean
	onSetUserInfo?: (userInfo: any) => void
	onClearAuth?: () => void
}

type RequestQueueItem = {
	resolve: (value: Promise<AxiosResponse<any, any>>) => void
	reject: (reason?: unknown) => void
	config: InternalAxiosRequestConfig
}

// Extend Axios types for our custom config
declare module "axios" {
	interface AxiosRequestConfig<D = any> {
		skipAuthRefresh?: boolean
		showError?: boolean
		defaultMessage?: string
		_retry?: boolean
		skipRedirect?: boolean
	}
}

// Create axios instance factory
export function createAxiosInstance(
	callbacks: AxiosCallbacks,
	config: AxiosRequestConfig = {},
): {
	axiosInstance: AxiosInstance
	axiosRequest: <T = unknown, O = unknown>(
		config: AxiosRequestConfig,
		options?: {
			showError?: boolean
			defaultMessage?: string
			skipRedirect?: boolean
		},
	) => Promise<RequestResponse<T, O>>
	getLocalStorageToken: () => string | null
	setLocalStorageToken: (token: string) => void
	removeLocalStorageToken: () => void
	processQueue: (error: unknown, token: string | null) => void
	onErrorStatusResolve: (error: {
		config: AxiosError["config"]
		response: AxiosError["response"]
	}) => Promise<AxiosResponse<any, any>>
} {
	// Default configuration
	const defaultConfig: AxiosRequestConfig = {
		baseURL: GlobalEnvConfig.BASE_API,
		timeout: 1000 * 60 * 60,
		headers: {
			"Content-Type": "application/json",
		},
		adapter: "fetch",
		...config,
	}

	// Create axios instance
	const axiosInstance: AxiosInstance = axios.create(defaultConfig)

	// State for refresh token
	let isRefreshing = false
	let failedQueue: RequestQueueItem[] = []

	// Process all queued items
	const processQueue = (error: unknown, token: string | null = null): void => {
		// Process all queued items
		const queue = [...failedQueue]
		failedQueue = []

		for (const item of queue) {
			if (error) {
				item.reject(error)
			} else if (token) {
				// Create a new config with the fresh token
				const newConfig = {
					...item.config,
					headers: {
						...item.config.headers,
						Authorization: `${token}`,
					} as AxiosRequestHeaders,
				}
				item.resolve(axiosInstance(newConfig))
			}
		}
	}

	// Request interceptor
	axiosInstance.interceptors.request.use(
		(config) => {
			if (!config.headers.Authorization) {
				const token = getLocalStorageToken()
				if (token) {
					config.headers = config.headers || {}
					config.headers.Authorization = `${token}`
				}
			}

			return config
		},
		(error) => Promise.reject(error),
	)

	// 无权限 以及 用户 vip 过期 都是403
	// 但是 用户过期会 增加msg 提示 vip expired
	// 目前应该是用不到上边这些 直接加上了 403
	const noneAuthCodes = [401, 403]

	async function onErrorStatusResolve(error: {
		config: AxiosError["config"]
		response: AxiosError["response"]
	}): Promise<AxiosResponse<any, any>> {
		const originalRequest = error.config as
			| (InternalAxiosRequestConfig & { _retry?: boolean })
			| undefined

		// console.log('error.config')
		// console.log(error.config)
		// console.log('originalRequest?._retry')
		// console.log(originalRequest?._retry)
		// console.log('originalRequest?.skipRedirect')
		// console.log(originalRequest?.skipRedirect)
		// console.log('error.response?.status')
		// console.log(error.response?.status)
		// console.log('error.response?.data')
		// console.log(error.response?.data)

		if (
			!originalRequest ||
			(!noneAuthCodes.includes(error.response?.status ?? 0) &&
				!noneAuthCodes.includes(
					(error.response?.data as RequestResponse)?.code ?? 0,
				)) ||
			originalRequest._retry
			// ||
			// originalRequest.skipRedirect
		) {
			return Promise.reject(error)
		}

		if (callbacks.onSetUserInfo) {
			callbacks.onSetUserInfo(null)
		}

		// If we're already refreshing, add to queue
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject, config: originalRequest })
			})
		}

		// Start refresh process
		isRefreshing = true
		originalRequest._retry = true
		// const refreshToken = getLocalStorageToken()
		const refreshToken = ""

		if (!refreshToken && !isSkipAndUseNoAnyAuthLogin()) {
			// No refresh token available, redirect to login
			callbacks.onRedirectToLogin()
			return Promise.reject(new Error("No refresh token available"))
		}

		try {
			// Attempt to refresh the token
			const response = await callbacks.onRefreshToken()

			let { token: access_token } = response
			access_token = `Bearer ${access_token}`

			// Store the new tokens
			setLocalStorageToken(access_token)
			// if (refresh_token) {
			// 	localStorage.setItem('refresh_token', refresh_token)
			// }

			// Update default headers
			if (axiosInstance.defaults.headers.common) {
				axiosInstance.defaults.headers.common.Authorization = `${access_token}`
			}

			// Update the original request
			originalRequest.headers = {
				...originalRequest.headers,
				Authorization: `${access_token}`,
			} as AxiosRequestHeaders

			// Process queued requests
			processQueue(null, access_token)

			// Retry the original request
			return axiosInstance(originalRequest)
		} catch (refreshError) {
			// Clear tokens and redirect on failure
			removeLocalStorageToken()
			localStorage.removeItem("refresh_token")

			if (callbacks.onSetUserInfo) {
				callbacks.onSetUserInfo(null)
			} else {
				userStore.setUserInfo(null)
			}

			// Process queued requests with error
			processQueue(refreshError, null)

			// Redirect to login
			callbacks.onRedirectToLogin()

			return Promise.reject(refreshError)
		} finally {
			isRefreshing = false
		}
	}

	// Response interceptor
	axiosInstance.interceptors.response.use(
		async (response) => {
			if (
				response.data.code === 401 ||
				(noneAuthCodes.includes(response.data.code) &&
					response.data.msg !== "vip expired")
			) {
				return onErrorStatusResolve({
					config: response.config,
					response: response,
				})
			}

			if (
				(response.data.msg || "").includes("vip expired") &&
				response.data.code === 403
			) {
			}

			return response
		},
		async (error: AxiosError) => {
			await onErrorStatusResolve({
				config: error.config,
				response: error.response,
			})
		},
	)

	// Helper to redirect to login with current path
	const redirectToLogin = (): void => {
		if (typeof window === "undefined") return

		const currentPath = window.location.pathname + window.location.search
		if (
			(
				[paths.auth.login.path, paths.auth.wxLoginCallback.path] as string[]
			).includes(window.location.pathname)
		)
			return

		window.location.href = paths.auth.login.getHref(currentPath)
	}

	// Helper function to handle API errors with configurable options
	const handleApiError = (
		error: unknown,
		options: { showError?: boolean; defaultMessage?: string } = {},
	): Promise<never> => {
		const { showError = true, defaultMessage = "An error occurred" } = options

		let message = defaultMessage

		if (axios.isAxiosError(error)) {
			message = error.response?.data?.message || error.message || defaultMessage
		} else if (error instanceof Error) {
			message = error.message || defaultMessage
		}

		if (showError && typeof window !== "undefined") {
			console.error("API Error:", message)
		}

		return Promise.reject(error)
	}

	// Wrapper around axios instance with error handling
	const axiosRequest = async <T = unknown, O = unknown>(
		config: AxiosRequestConfig,
		options: {
			showError?: boolean
			defaultMessage?: string
			skipRedirect?: boolean
		} = {},
	): Promise<RequestResponse<T, O>> => {
		try {
			const response = await axiosInstance({
				...config,
				headers: {
					...config.headers,
				} as AxiosRequestHeaders,
				skipRedirect: options.skipRedirect,
			})

			return response.data
		} catch (error) {
			return handleApiError(error, options)
		}
	}

	return {
		axiosInstance,
		axiosRequest,
		getLocalStorageToken,
		setLocalStorageToken,
		removeLocalStorageToken,
		processQueue,
		onErrorStatusResolve,
	}
}

// Helper functions that can be used outside the factory
export function getLocalStorageToken() {
	return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export function setLocalStorageToken(token: string) {
	localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
}

export function removeLocalStorageToken() {
	localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
}
