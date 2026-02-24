# React Vite Template

A modern React template for building agent skills with Vite, TypeScript, Tailwind CSS, shadcn/ui, and Lucide icons.

## ✨ Features

- ⚡️ **Vite** - Lightning fast development server and build tool
- ⚛️ **React 19** - Latest React with TypeScript support
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful, accessible components
- 🎭 **Lucide React** - Beautiful & consistent icon toolkit
- 📦 **pnpm** - Fast, disk space efficient package manager
- 🔧 **TypeScript** - Type safety and better DX

## 📦 What's Included

```
src/
├── components/
│   └── ui/              # shadcn/ui components
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   └── utils.ts         # Utility functions (cn)
├── App.tsx              # Main app component
├── index.css            # Global styles with Tailwind
└── main.tsx             # App entry point
```

## 🚀 Quick Start

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Release

Create a release package (tar.gz) of the source code:

```bash
pnpm release
```

This will create a compressed archive in the `release/` directory with:
- All source code
- Excluding: `node_modules`, `dist`, `release`, `.git`, etc.

## 📚 Adding Components

This template includes a basic setup with Button and Card components. To add more shadcn/ui components:

### Option 1: Manual Installation

Copy component code from [ui.shadcn.com](https://ui.shadcn.com) and paste into `src/components/ui/`.

### Option 2: Using shadcn CLI

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
# ... and more
```

## 🎨 Customization

### Tailwind Configuration

Edit `tailwind.config.js` to customize your theme:

```js
theme: {
  extend: {
    colors: {
      // Add your custom colors
    },
  },
}
```

### CSS Variables

Modify CSS variables in `src/index.css` to change the color scheme:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... more variables */
}
```

## 🔧 Project Structure

- **`src/components/ui/`** - Reusable UI components (shadcn/ui style)
- **`src/lib/utils.ts`** - Utility functions (e.g., `cn()` for class merging)
- **`src/App.tsx`** - Main application component
- **`public/`** - Static assets
- **`scripts/release.js`** - Release script for packaging

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm release` | Create release package |

## 🌐 Path Aliases

This template uses path aliases configured in `tsconfig.json` and `vite.config.ts`:

```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

## 📦 Release Package

The `pnpm release` command creates a distributable package:

1. Excludes development files (`node_modules`, `dist`, etc.)
2. Creates a timestamped tar.gz archive
3. Saves to `release/` directory
4. Shows package size

Perfect for distributing your agent skill template!

## 🛠️ Tech Stack

- [Vite](https://vite.dev/) - Build tool
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Components
- [Lucide](https://lucide.dev/) - Icons
- [pnpm](https://pnpm.io/) - Package manager

## 📄 License

MIT
