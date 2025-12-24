cd packages/kit
pnpm link --global

pnpm link --global @lowcode-yunti/kit

pnpm unlink @lowcode-yunti/kit

pnpm unlink --global @lowcode-yunti/kit

rm -rf packages/\*\*/node_modules
rm -rf node_modules
pnpm install

pnpm add "@lowcode-yunti/common@workspace:\*" --filter @lowcode-yunti/kit

其他项目使用方式:

1. 创建 .npmrc 文件
2. 增加 ```shell
 @lowcode-yunti:registry=<https://npm.pkg.github.com>
 //npm.pkg.github.com/:_authToken=ghp_xxx

 ```

3. 其他项目安装 pnpm add @lowcode-yunti/frontend-kit
4. import { xxx } from  "@lowcode-yunti/frontend-kit"
