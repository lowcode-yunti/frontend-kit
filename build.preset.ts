import path from "path";

/**
 * Rollup plugin to post-process generated chunks:
 * 1. Replaces @lowcode-yunti/xxx imports with correct relative paths.
 * 2. Removes side-effect imports of 'common/index' in entry files to keep bundles clean.
 */
export const relativePathsPlugin = {
    name: "relative-paths-output",
    renderChunk(code, chunk) {
        // 1. Match imports like "@lowcode-yunti/common"
        const regex = /(['"])@lowcode-yunti\/([^/'"]+)(['"])/g;

        code = code.replace(regex, (match, quote1, pkgName, quote2) => {
            const chunkDir = path.dirname(chunk.fileName);
            // Calculate path from current chunk's directory to the package root (dist/pkg)
            const relativeToRoot = path.relative(chunkDir, ".");

            // Construct path: current -> root -> .. (dist) -> targetPkg -> index
            const targetPath = path.join(
                relativeToRoot,
                "..",
                pkgName,
                "index"
            );

            let normalizedPath = targetPath.split(path.sep).join("/");

            if (!normalizedPath.startsWith(".")) {
                normalizedPath = "./" + normalizedPath;
            }

            return `${quote1}${normalizedPath}${quote2}`;
        });

        // 2. CLEANUP: Remove all external dependency imports/requires in index files
        // Index files should only re-export, actual dependencies are handled by component files
        if (chunk.fileName.startsWith("index")) {
            const externalPackages = [
                "react",
                "react-dom",
                "common/index",
                "@lowcode-yunti/",
            ];

            // // Remove side-effect imports: import "..."
            // code = code.replace(
            //     /^\s*import\s+['"]([^'"]+)['"];?\s*$/gm,
            //     (match, p1) => {
            //         const shouldRemove = externalPackages.some((pkg) =>
            //             p1.includes(pkg)
            //         );
            //         if (shouldRemove) {
            //             return `// ${match}`;
            //         }
            //         return match;
            //     }
            // );

            // // Remove side-effect requires: require("...")
            // code = code.replace(
            //     /^\s*require\(['"]([^'"]+)['"]\);?\s*$/gm,
            //     (match, p1) => {
            //         const shouldRemove = externalPackages.some((pkg) =>
            //             p1.includes(pkg)
            //         );
            //         if (shouldRemove) {
            //             return `// ${match}`;
            //         }
            //         return match;
            //     }
            // );
        }

        return code;
    },
};

export const commonExternals = ["react", "react-dom", "@lowcode-yunti/common"];

export const hooks = {
    "rollup:options": (ctx, options) => {
        options.plugins = options.plugins || [];
        options.plugins.unshift(relativePathsPlugin);
    },
};

export const PackageBaseOutDir = "../../dist";
export const getPackageBaseOutDir = (name: string, other?: string) =>
    `../../dist/${name}${other ? `/${other}` : ""}`;
