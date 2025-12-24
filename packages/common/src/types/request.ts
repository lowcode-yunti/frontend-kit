export type RequestResponse<T = unknown, O = unknown> = {
	code: number
	success: boolean
	data: T
	msg?: string
	message?: string
	// access_token?: string;
	// // Bearer
	// token_type?: string;
	// // 是否是第一次登录
	// rows?: boolean;
} & O

export interface PageResponse<T = unknown> {
	rows: T[]
	pageNum: number
	pageSize: number
	total: number
	hasNext: boolean
}
