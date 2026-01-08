import type { AxiosInstance, AxiosRequestConfig } from "axios"

/**
 * SSE消息事件
 */
export interface SSEMessageEvent {
	/**
	 * 事件类型
	 */
	type?: string
	/**
	 * 消息数据
	 */
	data: string
	/**
	 * 事件ID
	 */
	id?: string
	/**
	 * 重连时间
	 */
	retry?: number
}

/**
 * SSE连接选项
 */
export interface SSEConnectionOptions {
	/**
	 * 请求配置
	 */
	requestConfig: AxiosRequestConfig

	/**
	 * 收到消息时的回调
	 */
	onMessage?: (event: SSEMessageEvent) => void

	/**
	 * 连接打开时的回调
	 */
	onOpen?: () => void

	/**
	 * 发生错误时的回调
	 */
	onError?: (error: Error) => void

	/**
	 * 连接关闭时的回调
	 */
	onClose?: () => void
}

/**
 * SSE连接控制器
 */
export interface SSEConnection {
	/**
	 * 关闭连接
	 */
	close: () => void
}

/**
 * 解析SSE数据流
 */
function parseSSEMessage(chunk: string): SSEMessageEvent | null {
	const lines = chunk.split("\n")
	const event: Partial<SSEMessageEvent> = {}

	for (const line of lines) {
		if (line.startsWith("data: ")) {
			event.data = line.substring(6)
		} else if (line.startsWith("event: ")) {
			event.type = line.substring(7)
		} else if (line.startsWith("id: ")) {
			event.id = line.substring(4)
		} else if (line.startsWith("retry: ")) {
			event.retry = Number.parseInt(line.substring(7), 10)
		}
	}

	return event.data !== undefined ? (event as SSEMessageEvent) : null
}

/**
 * 创建SSE连接
 * @param axiosInstance - axios实例
 * @param options - 连接选项
 * @returns SSE连接控制器
 */
export function createSSEConnection(
	axiosInstance: AxiosInstance,
	options: SSEConnectionOptions,
): SSEConnection {
	const { requestConfig, onMessage, onOpen, onError, onClose } = options

	let isClosed = false
	const abortController = new AbortController()

	// 发起请求
	axiosInstance
		.request({
			...requestConfig,
			responseType: "stream",
			adapter: "fetch",
			signal: abortController.signal,
			headers: {
				...requestConfig.headers,
				Accept: "text/event-stream",
			},
		})
		.then(async (response) => {
			if (isClosed) return

			onOpen?.()

			const reader = response.data.getReader()
			const decoder = new TextDecoder()
			let buffer = ""

			try {
				while (!isClosed) {
					const { done, value } = await reader.read()

					if (done) break

					// 解码数据
					buffer += decoder.decode(value, { stream: true })

					// 按双换行符分割消息
					const messages = buffer.split("\n\n")
					buffer = messages.pop() || ""

					// 处理每条消息
					for (const message of messages) {
						if (message.trim()) {
							const event = parseSSEMessage(message)
							if (event && onMessage) {
								onMessage(event)
							}
						}
					}
				}
			} catch (error) {
				if (!isClosed) {
					onError?.(error instanceof Error ? error : new Error(String(error)))
				}
			} finally {
				reader.releaseLock()
				if (!isClosed) {
					onClose?.()
				}
			}
		})
		.catch((error) => {
			if (!isClosed) {
				onError?.(error)
				onClose?.()
			}
		})

	return {
		close: () => {
			if (!isClosed) {
				isClosed = true
				abortController.abort()
				onClose?.()
			}
		},
	}
}

/**
 * 使用原生EventSource创建SSE连接（备选方案）
 * @param url - SSE端点URL
 * @param options - 连接选项（简化版）
 * @returns SSE连接控制器
 */
export function createSSEConnectionWithEventSource(
	url: string,
	options: {
		onMessage?: (event: MessageEvent) => void
		onOpen?: () => void
		onError?: (error: Event) => void
		onClose?: () => void
		withCredentials?: boolean
	} = {},
): SSEConnection {
	const { onMessage, onOpen, onError, onClose, withCredentials = false } = options

	const eventSource = new EventSource(url, { withCredentials })

	if (onOpen) {
		eventSource.addEventListener("open", onOpen)
	}

	if (onMessage) {
		eventSource.addEventListener("message", onMessage)
	}

	if (onError) {
		eventSource.addEventListener("error", (event) => {
			onError(event)
		})
	}

	return {
		close: () => {
			eventSource.close()
			onClose?.()
		},
	}
}
