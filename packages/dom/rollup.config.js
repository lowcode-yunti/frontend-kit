import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

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
	external: ["@lowcode-yunti/utils"],
	plugins: [
		nodeResolve(),
		commonjs(),
		copy({
			targets: [{ src: "dist/*", dest: "../../dist/dom" }],
		}),
	],
};
