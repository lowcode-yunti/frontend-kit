# Frontend Kit 构建指南

## ✅ 已完成的改造

1. **全面迁移到 unbuild** - 所有包都使用 unbuild 替代 rollup
2. **统一打包出口** - 只发布主包 `@lowcode-yunti/frontend-kit`
3. **相对路径引用** - 各包之间使用相对路径，按需加载
4. **可配置打包** - 可以选择哪些包需要打包，哪些跳过
5. **Playground 无感知** - 开发调试继续直接引用源码

## 📁 打包后目录结构

```
dist/
├── common/
│   ├── index.cjs
│   ├── index.mjs
│   └── index.d.ts
├── knowledge/
│   ├── index.cjs
│   ├── index.mjs
│   └── index.d.ts
├── kit/
│   ├── index.cjs
│   ├── index.mjs
│   └── index.d.ts
├── index.cjs         # 主入口，re-export 所有子包
├── index.mjs         # 使用相对路径：export * from './common/index'
└── index.d.ts
```

## 📦 使用方式

### 方式 1：统一导入（推荐）

```typescript
import { Button, greet, formatString } from "@lowcode-yunti/frontend-kit";
```

### 方式 2：子包导入（更精确的按需加载）

```typescript
import { Button } from "@lowcode-yunti/frontend-kit/kit";
import { greet } from "@lowcode-yunti/frontend-kit/knowledge";
import { formatString } from "@lowcode-yunti/frontend-kit/common";
```

## 🔧 配置说明

### 1. 控制哪些包需要打包

编辑 `build.packages.config.js`：

```javascript
// 需要打包的包列表
export const packagesToBuild = [
    "common",
    "knowledge",
    "kit",
    // 'demo', // ❌ demo 包只作为模板，不打包到最终产物
];
```

或者直接修改 `package.json` 的 build 脚本：

```json
{
    "scripts": {
        "build": "pnpm --filter @lowcode-yunti/common build && pnpm --filter @lowcode-yunti/knowledge build && pnpm --filter @lowcode-yunti/kit build && unbuild"
    }
}
```

### 2. 主包配置 (build.config.ts)

关键配置项：

```typescript
{
  clean: false,  // ❗重要：不清理 dist，避免删除子包输出

  rollup: {
    output: {
      paths: {  // ❗重要：将包名映射为相对路径
        '@lowcode-yunti/common': './common/index',
        '@lowcode-yunti/knowledge': './knowledge/index',
        '@lowcode-yunti/kit': './kit/index',
      }
    }
  },

  externals: [  // ❗重要：标记为 external 不内联
    '@lowcode-yunti/common',
    '@lowcode-yunti/knowledge',
    '@lowcode-yunti/kit',
  ]
}
```

### 3. 子包配置 (packages/\*/build.config.ts)

```typescript
{
  outDir: '../../dist/xxx',  // 输出到根目录 dist
  externals: ['react', 'react-dom', '@lowcode-yunti/xxx'],
}
```

## 🚀 新增包流程

### 第 1 步：复制 demo 包

```bash
cp -r packages/demo packages/my-new-pkg
```

### 第 2 步：修改 package.json

```json
{
    "name": "@lowcode-yunti/my-new-pkg",
    "dependencies": {
        "@lowcode-yunti/common": "workspace:*" // 按需添加依赖
    }
}
```

### 第 3 步：修改 build.config.ts

```typescript
{
  outDir: '../../dist/my-new-pkg',  // 改为对应的包名
  externals: [
    'react',
    'react-dom',
    '@lowcode-yunti/common',  // 添加依赖的包
  ]
}
```

### 第 4 步（可选）：如果要在 playground 中调试

编辑 `tsconfig.json`：

```json
{
    "paths": {
        "@lowcode-yunti/my-new-pkg": ["packages/my-new-pkg/src"]
    }
}
```

编辑 `apps/playground/package.json`：

```json
{
    "dependencies": {
        "@lowcode-yunti/my-new-pkg": "workspace:*"
    }
}
```

### 第 5 步：如果要打包到最终产物

**方式 A：** 修改 `package.json` build 脚本：

```json
{
    "scripts": {
        "build": "pnpm --filter @lowcode-yunti/common build && ... && pnpm --filter @lowcode-yunti/my-new-pkg build && unbuild"
    }
}
```

**方式 B：** 修改 `src/index.ts` 添加导出：

```typescript
export * from "@lowcode-yunti/my-new-pkg";
```

并更新 `build.config.ts`：

```typescript
{
  rollup: {
    output: {
      paths: {
        '@lowcode-yunti/my-new-pkg': './my-new-pkg/index',
      }
    }
  },
  externals: ['@lowcode-yunti/my-new-pkg']
}
```

## ❌ 删除包流程

### 第 1 步：删除包目录

```bash
rm -rf packages/my-pkg
```

### 第 2 步：从 build 脚本移除

编辑 `package.json`，移除对应的 build 命令。

### 第 3 步：从主入口移除

编辑 `src/index.ts`，删除对应的 export 语句。

编辑 `build.config.ts`，从 `output.paths` 和 `externals` 中移除。

### 第 4 步（可选）：清理 tsconfig

如果之前添加了 paths 映射，从 `tsconfig.json` 中移除。

## 🎯 Playground 调试

Playground 通过 `workspace:*` + TypeScript paths 直接引用源码：

```typescript
// apps/playground/src/App.tsx
import { Button, greet } from "@lowcode-yunti/frontend-kit";
```

**原理：**

1. `package.json` 中 `"@lowcode-yunti/frontend-kit": "workspace:*"` 指向根目录
2. TypeScript 的 `paths` 配置解析到 `packages/*/src`
3. Vite 直接读取源码，支持热更新
4. **完全不依赖打包产物**

启动开发服务器：

```bash
pnpm studio  # 或 pnpm --filter playground dev
```

## 📝 常用命令

```bash
# 打包所有（不包含 demo）
pnpm build

# 开发模式（子包 watch 模式）
pnpm dev

# Playground 开发
pnpm studio

# 清理所有 dist 和 node_modules
pnpm clean

# 重新安装依赖
pnpm install
```

## ⚙️ CSS 和样式处理

unbuild 默认支持：

-   ✅ PostCSS
-   ✅ Tailwind CSS (需要配置 postcss.config.js)
-   ✅ CSS Modules
-   ✅ Emotion / styled-components (作为 peer dependencies)

如果需要处理 CSS，在子包的 `build.config.ts` 中会自动处理，无需额外配置。

## 🎉 优势总结

1. **统一工具** - 所有包使用 unbuild，配置一致
2. **按需加载** - 相对路径引用，支持 tree-shaking
3. **开发友好** - Playground 直接用源码，热更新秒级
4. **模板化** - demo 包作为模板，复制改名即用
5. **自动化** - unbuild 自动处理依赖、类型、多格式
6. **灵活性** - 可配置哪些包打包，哪些跳过

## ❓ 常见问题

**Q: 为什么打包后还有 @lowcode-yunti/xxx 的警告？**  
A: 这是正常的，说明使用了相对路径。可以在 `build.config.ts` 中添加 `failOnWarn: false` 忽略。

**Q: 如何只打包某些包？**  
A: 修改 `package.json` 的 build 脚本，只包含需要的包的 build 命令。

**Q: Demo 包会被打包吗？**  
A: 不会，已经从 build 脚本中排除。

**Q: 如何支持 Tailwind CSS？**  
A: 在对应的包目录添加 `postcss.config.js` 和 `tailwind.config.js` 即可。

**Q: Playground 为什么不需要打包？**  
A: Vite 通过 TypeScript paths 直接读取源码，完全不依赖打包产物。
