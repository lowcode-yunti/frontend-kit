import { defineBuildConfig } from "unbuild"
import {
	commonExternals,
	getPackageBaseOutDir,
	getSrcPath,
	hooks,
} from "../../build.preset"

export default defineBuildConfig({
	entries: [
		"src/index",
		{
			builder: "rollup",
			input: "./src/axios/",
			outDir: getPackageBaseOutDir("common", "axios"),
			declaration: true,
			name: "axios/index",
			// emitCJS: false,
			// format: "esm",
		},
		{
			input: "./src/types/",
			outDir: getPackageBaseOutDir("common", "types"),
			declaration: true,
			// emitCJS: false,
			format: "esm",
		},
		{
			input: "./src/constants/",
			outDir: getPackageBaseOutDir("common", "constants"),
			declaration: true,
			// emitCJS: false,
			format: "esm",
		},
		{
			input: "./src/config/",
			outDir: getPackageBaseOutDir("common", "config"),
			declaration: true,
			// emitCJS: false,
			format: "esm",
		},
		{
			input: "./src/styles/",
			outDir: getPackageBaseOutDir("common", "styles"),
			// declaration: false,
		},
	],

	// 保留目录结构，支持按需加载
	declaration: true,
	clean: true,

	// 输出多种格式
	rollup: {
		emitCJS: true,

		// 支持 PostCSS 处理 CSS
		esbuild: {
			target: "es2020",
		},
		dts: {
			respectExternal: true,
		},
		// resolve: {},
		alias: {
			entries: {
				// "@/": getSrcPath("common"),
				"@/": "./src/",
			},
		},
		output: {
			preserveModules: true,
			// preserveModulesRoot: "src",
		},
	},

	hooks,

	// 输出到根目录的 dist
	outDir: getPackageBaseOutDir("common"),

	// 外部依赖
	externals: [...commonExternals],

	failOnWarn: false,
})
