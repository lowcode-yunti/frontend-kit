import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    entries: ["./src/index"],

    declaration: true,

    // 禁用清理，避免删除子包的输出
    clean: false,

    rollup: {
        emitCJS: true,

        // 输出配置，映射包名到相对路径
        output: {
            paths: {
                "@lowcode-yunti/common": "./common/index",
                "@lowcode-yunti/knowledge": "./knowledge/index",
                "@lowcode-yunti/kit": "./kit/index",
            },
        },
    },

    outDir: "./dist",

    // 标记子包为 external，不内联代码
    externals: [
        "react",
        "react-dom",
        "@lowcode-yunti/common",
        "@lowcode-yunti/knowledge",
        "@lowcode-yunti/kit",
    ],

    failOnWarn: false,
});
