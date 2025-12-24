import type { AgentType } from "@/api/agent/type"
import { AgentNameEnum, CommonActionNameEnum } from "@/types"

import AgentChatLottie from "@assets/lottie/agent-chat.json"
import AgentCompareLottie from "@assets/lottie/agent-compare.json"
import AgentDocumentLottie from "@assets/lottie/agent-document-read.json"
import AgentReviewLottie from "@assets/lottie/agent-review.json"
import RuleLottie from "@assets/lottie/agent-rule.json"
import KnowledgeLottie from "@assets/lottie/knowledge.json"
import TechnicalAndEconomicReviewLottie from "@assets/lottie/left-panel-tool-2.json"
import EvaluatedAndCalculatedLottie from "@assets/lottie/left-panel-tool-3.json"

import IndicatorCalculation from "@assets/lottie/left-panel-tool-1.json"
export const CustomDefineAgents: (AgentType & {
	agentName: string
	iconPositive?: boolean
})[] = [
	{
		id: "0161139B502F9987620F151FBF2213EF",
		icon: AgentDocumentLottie as unknown as string,
		name: AgentNameEnum.Read,
		agentName: "文档阅读",
		description: "",
		extend: {
			assistantId: AgentNameEnum.Read,
		},
	},
	{
		id: "0161139B502F9987620F151FBF2216EF",
		icon: AgentChatLottie as unknown as string,
		name: AgentNameEnum.Chat,
		agentName: "智能问答",
		description: "",
		extend: {
			assistantId: AgentNameEnum.Chat,
		},
	},
]

export const CommonActions: (AgentType & {
	agentName: string
	iconPositive?: boolean
})[] = [
	{
		id: "0161139B502F9987620F151FBF2217EF",
		icon: KnowledgeLottie as unknown as string,
		name: CommonActionNameEnum.KnowledgeBase,
		agentName: "知识库",
		description: "",
		iconPositive: true,
		extend: {
			assistantId: CommonActionNameEnum.KnowledgeBase,
		},
	},
	{
		id: "0161139B502F9987620F151FBF2237EF",
		icon: RuleLottie as unknown as string,
		name: CommonActionNameEnum.RuleBased,
		agentName: "规则库",
		description: "",
		iconPositive: true,
		extend: {
			assistantId: CommonActionNameEnum.RuleBased,
		},
	},
]

export const AgentToolActions: (AgentType & {
	agentName: string
	iconPositive?: boolean
})[] = [
	{
		id: "0161139B502F9987620F151FBF2211EF",
		icon: AgentReviewLottie as unknown as string,
		name: AgentNameEnum.Review,
		agentName: "智能审查",
		description: "",
		extend: {
			assistantId: AgentNameEnum.Review,
		},
	},
	{
		id: "0161139B502F9987620F151FBF2212EF",
		icon: AgentCompareLottie as unknown as string,
		name: AgentNameEnum.Compare,
		agentName: "文档对比",
		description: "",
		extend: {
			assistantId: AgentNameEnum.Compare,
		},
	},
	{
		id: "0161139B502F9987620F151FBF2236EF",
		icon: EvaluatedAndCalculatedLottie as unknown as string,
		name: CommonActionNameEnum.EvaluatedAndCalculated,
		agentName: "经评测算",
		description: "",
		extend: {
			assistantId: CommonActionNameEnum.EvaluatedAndCalculated,
		},
	},
	{
		id: "0161139B502F9987620F151FBF2237EF",
		icon: IndicatorCalculation as unknown as string,
		name: CommonActionNameEnum.IndicatorCalculated,
		agentName: "指标计算",
		description: "",
		extend: {
			assistantId: CommonActionNameEnum.IndicatorCalculated,
		},
	},
	{
		id: "0161139B502F9987620F151FBF2337EF",
		icon: TechnicalAndEconomicReviewLottie as unknown as string,
		name: CommonActionNameEnum.TechnicalAndEconomicReview,
		agentName: "技经评审",
		description: "",
		extend: {
			assistantId: CommonActionNameEnum.TechnicalAndEconomicReview,
		},
	},
]
