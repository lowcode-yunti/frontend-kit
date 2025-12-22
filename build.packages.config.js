/**
 * 构建配置
 * 控制哪些包需要打包
 */

// 需要打包的包列表
export const packagesToBuild = [
	"common",
	"knowledge",
	"kit",
	// 'demo', // demo 包只作为模板，不打包
]

// 包之间的依赖关系（用于 external 配置）
export const packageDependencies = {
	common: [],
	knowledge: ["common"],
	kit: ["common", "knowledge"],
	demo: ["common"],
}
