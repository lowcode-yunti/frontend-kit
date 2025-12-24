import { defineBuildConfig } from "unbuild"
import { hooks, commonExternals, getPackageBaseOutDir } from "../../build.preset"

// const outDir = "../../dist/kit";
export default defineBuildConfig({
	entries: [
		// ① 统一出口（JS + d.ts）
		"src/index",

		{
			input: "./src/components/",
			outDir: getPackageBaseOutDir("kit", "components"),
			declaration: true,
			// emitCJS: false,
			format: "esm",
		},
	],

	declaration: true,
	clean: true,

	rollup: {
		emitCJS: true,

		// 支持 PostCSS 处理 CSS
		esbuild: {
			target: "es2020",
		},
		output: {
			preserveModules: true,
			// preserveModulesRoot: "src",
		},
	},

	hooks,

	outDir: getPackageBaseOutDir("kit"),

	// kit 依赖 common 和 knowledge
	externals: [...commonExternals],

	failOnWarn: false,
})
