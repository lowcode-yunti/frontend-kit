# Frontend Kit

A monorepo containing the frontend component library and utilities.

## Packages

-   **@lowcode-yunti/kit**: The main component library with business logic (`packages/kit`).

## Apps

-   **playground**: A local React app for testing and debugging the kit (`apps/playground`).

## Commands

-   `pnpm install`: Install dependencies.
-   `pnpm build`: Build all packages.
-   `pnpm studio`: Start the local playground for debugging.
-   `pnpm dev`: Run build in watch mode.

## Development

1. Install dependencies: `pnpm install`.
2. Start playground: `pnpm studio`.
3. Edit files in `packages/kit`, changes usually reflect in playground (might need rebuild depending on link setup, but `vite` handles source linking well if configured, otherwise run `pnpm -r dev` to watch).

Note: The `studio` command runs the playground `dev` server.
Top-level `pnpm dev` runs `rollup -w` in packages, enabling live rebuilds.
For best experience, run `pnpm dev` in one terminal (to watch lib) and `pnpm studio` in another (to run app).

cd packages/kit
pnpm link --global

pnpm link --global @lowcode-yunti/kit

pnpm unlink @lowcode-yunti/kit

pnpm unlink --global @lowcode-yunti/kit

rm -rf packages/\*\*/node_modules
rm -rf node_modules
pnpm install

pnpm add "@lowcode-yunti/common@workspace:\*" --filter @lowcode-yunti/kit
