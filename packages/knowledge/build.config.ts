import { defineBuildConfig } from "unbuild";
import { hooks, commonExternals } from "../../build.preset";

export default defineBuildConfig({
    entries: ["./src/index"],

    declaration: true,

    rollup: {
        emitCJS: true,
        // Relative paths handled by shared hooks
    },

    hooks,

    outDir: "../../dist/knowledge",

    // knowledge 依赖 common
    externals: [...commonExternals],

    failOnWarn: false,
    clean: true,
});
