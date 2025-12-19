# @lowcode-yunti/kit

A logic-enabled business component library built with React and TypeScript.

## Features

- **Components**: Pre-styled, business-ready React components (e.g., `Button`).
- **Utils**: Helper functions for common tasks (`formatString`, `deepClone`).
- **Logic**: Shared business logic (`createUserProfile`, `greet`).
- **Tree Shaking**: Fully supports on-demand loading (ESM).
- **TypeScript**: First-class type definitions.

## Installation

```bash
npm install @lowcode-yunti/kit
# or
pnpm add @lowcode-yunti/kit
```

## Usage

### Components

```tsx
import { Button } from "@lowcode-yunti/kit";

function App() {
  return <Button label="Click Me" variant="primary" />;
}
```

### Utils

```ts
import { formatString, deepClone } from "@lowcode-yunti/kit";

const msg = formatString("Hello {0}", "World");
const clone = deepClone({ a: 1 });
```

## Local Development & Debugging

### Internal Debugging (Playground)

We provide a local playground to debug components instantly.

1. Run from the root directory:
   ```bash
   pnpm studio
   ```
2. Open `http://localhost:5173` (or the port shown).
3. Modify code in `packages/kit/src` and see changes live (thanks to HMR/watch).

### Debugging in External Projects

To debug this library in another local project:

1. **In this repo**:

   ```bash
   cd packages/kit
   pnpm link --global
   ```

2. **In your target project**:

   ```bash
   pnpm link --global @lowcode-yunti/kit
   ```

   _Tip: After linking, you may need to rebuild `kit` on changes, or run `pnpm dev` in `packages/kit` to watch for changes._

## Build

```bash
pnpm build
```
