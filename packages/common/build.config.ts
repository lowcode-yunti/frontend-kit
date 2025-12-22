import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    entries: ["./src/index"],

    // 保留目录结构，支持按需加载
    declaration: true,

    // 输出多种格式
    rollup: {
        emitCJS: true,
    },

    // 输出到根目录的 dist
    outDir: "../../dist/common",

    // 外部依赖
    externals: ["react", "react-dom"],

    failOnWarn: false,
});
