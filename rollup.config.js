import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
	input: "src/index.js",
	output: [
		{
			file: "dist/index.js",
			format: "cjs",
			sourcemap: true,
		},
		{
			file: "dist/index.esm.js",
			format: "esm",
			sourcemap: true,
		},
	],
	external: [
		"@lowcode-yunti/utils",
		"@lowcode-yunti/frontend-core",
		"@lowcode-yunti/dom-utils",
	],
	plugins: [nodeResolve(), commonjs()],
};
