import { createContext, useContext } from "react"
import type { AxiosInstance } from "@lowcode-yunti/common"

export interface KnowledgeContextType {
	request?: AxiosInstance
}

export const KnowledgeContext = createContext<KnowledgeContextType>({})

export function useKnowledgeContext() {
	const context = useContext(KnowledgeContext)
	return context
}
