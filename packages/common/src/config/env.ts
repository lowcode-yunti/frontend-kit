interface EnvConfig {
	/**
	 * 基础的api
	 */
	BASE_API: string
}

const GlobalEnvConfig: EnvConfig = {
	BASE_API: import.meta.env.VITE_API || "",
}

export { GlobalEnvConfig }
