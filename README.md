# Frontend Kit

一个基于pnpm monorepo的前端工具包集合，支持分包开发但统一导出。

## 项目结构

```
frontend-kit/
├── common/
│   └── utils/              # 通用工具包
├── packages/
│   ├── core/               # 核心库包
│   └── dom/                # DOM工具包
├── dist/                   # 统一导出目录
│   ├── core/               # core包的独立构建
│   ├── dom/                # dom包的独立构建
│   └── index.js            # 统一导出入口
├── src/                    # 统一导出的源码
└── example/                # 使用示例
```

## 功能模块

### @lowcode-yunti/utils (common/utils)

- `formatString`: 字符串格式化工具
- `deepClone`: 对象深拷贝功能

### @lowcode-yunti/frontend-core (packages/core)

- `greet`: 问候函数
- `createUserProfile`: 创建用户档案

### @lowcode-yunti/dom-utils (packages/dom)

- `addClass`: 添加CSS类
- `removeClass`: 移除CSS类
- `createElement`: 创建DOM元素

## 使用方法

### 分别使用各包

```javascript
import { greet } from '@lowcode-yunti/frontend-core';
import { addClass } from '@lowcode-yunti/dom-utils';
import { formatString } from '@lowcode-yunti/utils';
```

### 统一入口使用

```javascript
import { greet, addClass, formatString } from './dist/index.js';
```

## 构建命令

- `pnpm build`: 构建所有包并生成统一导出
- `pnpm build:core`: 仅构建core包
- `pnpm build:dom`: 仅构建dom包
- `pnpm build:all`: 构建所有包并生成统一导出

构建后的文件会同时存在于各包的`dist/`目录中以及根目录的`dist/`目录中。
