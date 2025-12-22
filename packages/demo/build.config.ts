import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    entries: ["./src/index"],

    declaration: true,

    rollup: {
        emitCJS: true,
    },

    outDir: "../../dist/demo",

    externals: ["react", "react-dom", "@lowcode-yunti/common"],

    failOnWarn: false,
});
