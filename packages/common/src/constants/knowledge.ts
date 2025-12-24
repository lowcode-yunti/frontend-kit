/**
 * 知识库类型
 */
export enum KnowledgeBaseType {
	// 个人
	PERSONAL = "personal",
	// 部门
	DEPARTMENT = "department",
	// 组织
	ORGANIZATION = "organization",
}

export const KnowledgeBaseTypeName = {
	[KnowledgeBaseType.PERSONAL]: "个人",
	[KnowledgeBaseType.DEPARTMENT]: "部门",
	[KnowledgeBaseType.ORGANIZATION]: "组织",
} as const

export const KnowledgeBaseTypeList = [
	{
		label: KnowledgeBaseTypeName[KnowledgeBaseType.PERSONAL],
		key: KnowledgeBaseType.PERSONAL,
	},
	{
		label: KnowledgeBaseTypeName[KnowledgeBaseType.DEPARTMENT],
		key: KnowledgeBaseType.DEPARTMENT,
	},
	// {
	// 	label: KnowledgeBaseTypeName[KnowledgeBaseType.ORGANIZATION],
	// 	key: KnowledgeBaseType.ORGANIZATION,
	// },
]
