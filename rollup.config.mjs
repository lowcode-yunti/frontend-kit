import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import { readFileSync } from "fs"

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"))

export default [
	{
		input: "src/index.ts",
		output: [
			{
				file: packageJson.main,
				format: "cjs",
				sourcemap: true,
			},
			{
				file: packageJson.module,
				format: "esm",
				sourcemap: true,
			},
		],
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: "./tsconfig.json",
			}),
		],
		external: [
			"react",
			"react-dom",
			"@lowcode-yunti/common",
			"@lowcode-yunti/demo-pkg",
			"@lowcode-yunti/knowledge",
			"@lowcode-yunti/kit",
		],
	},
	{
		input: "src/index.ts",
		output: [{ file: packageJson.types, format: "es" }],
		plugins: [dts()],
		external: [
			"react",
			"react-dom",
			"@lowcode-yunti/common",
			"@lowcode-yunti/demo-pkg",
			"@lowcode-yunti/knowledge",
			"@lowcode-yunti/kit",
		],
	},
]
