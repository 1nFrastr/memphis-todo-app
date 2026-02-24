# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern React template designed for building agent skills and web applications. It uses Vite for fast development, React 19 with TypeScript, Tailwind CSS v4 for styling, shadcn/ui for components, and Lucide React for icons.

**Package Manager**: This project uses `pnpm` exclusively. Always use `pnpm` commands, not `npm` or `yarn`.

## Development Commands

### Essential Commands
```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server on http://localhost:5173
pnpm build            # Build for production (TypeScript check + Vite build)
pnpm preview          # Preview production build locally
pnpm lint             # Run ESLint
pnpm release          # Create distributable tar.gz package in release/ directory
```

## Architecture & Key Patterns

### Path Aliases
The project uses `@/` as an alias for the `src/` directory:
- Configured in both `vite.config.ts` and `tsconfig.app.json`
- Use `@/components/ui/button` instead of relative paths like `../../../components/ui/button`

### Component System (shadcn/ui)
This project uses shadcn/ui's copy-paste component approach:
- Components live in `src/components/ui/` and are owned by this project (not imported from npm)
- Components use the `cn()` utility from `@/lib/utils` for conditional class merging
- Configuration in `components.json` defines style, aliases, and Tailwind settings
- To add new shadcn/ui components: `pnpm dlx shadcn@latest add <component-name>`
- Alternatively, manually copy component code from ui.shadcn.com into `src/components/ui/`

### Styling Approach
- Tailwind CSS v4 with CSS variables for theming
- Global styles and CSS variables in `src/index.css`
- Uses `clsx` and `tailwind-merge` via the `cn()` utility for dynamic class names
- Components use Tailwind utility classes, not separate CSS modules

### Component Patterns
- All components use functional components with TypeScript
- UI components follow shadcn/ui patterns with `React.forwardRef` for proper ref handling
- Components use `cva` (class-variance-authority) for variant-based styling
- Lucide React icons are imported on-demand: `import { IconName } from "lucide-react"`

## File Structure

```
src/
├── components/
│   └── ui/              # shadcn/ui components (button, card, etc.)
├── lib/
│   └── utils.ts         # cn() utility for class merging
├── App.tsx              # Main application component
├── index.css            # Global styles with Tailwind directives and CSS variables
└── main.tsx             # React app entry point
```

## Release System

The `pnpm release` command creates a timestamped tar.gz archive:
- Excludes: `node_modules`, `dist`, `release`, `.git`, `.claude`, `pnpm-lock.yaml`, logs
- Output: `release/webapp-react-template-{version}-{timestamp}.tar.gz`
- Implemented in `scripts/release.js` using Node.js and tar command

## TypeScript Configuration

- Uses project references with separate configs:
  - `tsconfig.json` - Root config with references
  - `tsconfig.app.json` - App code configuration with path aliases
  - `tsconfig.node.json` - Build tooling configuration
- Strict mode enabled
- Path alias `@/*` maps to `./src/*`
- **`verbatimModuleSyntax: true`** - Enforces explicit type imports/exports:
  - Use `import type { Type } from 'module'` for type-only imports
  - Use `import { value } from 'module'` for runtime imports
  - Cannot mix type and value imports in the same statement
  - Example: `import { type ButtonProps, Button } from './button'` (inline type import is allowed)

## Build System (Vite)

- Vite 7.x with React plugin
- Development server runs on port 5173 by default
- Production builds output to `dist/` directory
- Fast HMR (Hot Module Replacement) during development
