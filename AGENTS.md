# AGENTS.md

This file provides guidance for agentic coding agents working in this repository.

## Project Overview

Modern React template with Vite, TypeScript, Tailwind CSS v4, and shadcn/ui. Uses `pnpm` as package manager exclusively.

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server on http://localhost:5173
pnpm build            # Build for production (TypeScript check + Vite build)
pnpm lint             # Run ESLint on entire codebase
pnpm preview          # Preview production build locally
pnpm release          # Create timestamped tar.gz in release/
```

## Build/Lint/Test Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start Vite development server |
| `pnpm build` | Full production build with TypeScript compilation |
| `pnpm lint` | Run ESLint across all TS/TSX files |
| `pnpm preview` | Preview the built application |
| `pnpm release` | Generate distributable archive |

## Code Style Guidelines

### Imports

- Use path alias `@/` for `src/` directory (e.g., `@/components/ui/button`)
- Use named imports for UI components and utilities
- Import types separately when using `verbatimModuleSyntax`:

```typescript
import { type ButtonProps, Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconName } from "lucide-react"
```

### TypeScript

- **Strict mode enabled**: No implicit `any`, strict null checks
- **verbatimModuleSyntax**: Enforces explicit type/value import separation
  - Type-only imports use `import type { Foo } from 'module'`
  - Value imports use `import { foo } from 'module'`
  - Cannot mix type and value imports in the same statement
  - **Exception**: Inline type import is allowed: `import { type Foo, Bar } from 'module'`
  - Example: `import { type ButtonProps, Button } from "@/components/ui/button"`
- **noUnusedLocals/noUnusedParameters**: Remove unused declarations
- Use interfaces for object shapes, types for unions/primitives
- Component props extend native HTML attributes with `React.ButtonHTMLAttributes`, etc.

### Component Patterns

All UI components follow shadcn/ui conventions:

```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva("base classes", {
  variants: {
    variant: { default: "...", secondary: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
})

interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"

export { Component, componentVariants }
```

- Use `React.forwardRef` for components accepting refs
- Always set `displayName` for named components
- Use `cva` for variant-based styling
- Apply classes via `cn()` utility (merges clsx + tailwind-merge)

### Styling

- Use Tailwind CSS utility classes exclusively
- Apply dynamic classes through `cn()` utility function
- Use CSS variables from `src/index.css` for theming (e.g., `bg-primary`, `text-muted-foreground`)
- Prefix shadcn/ui components with base styles in `className`

### Naming Conventions

- **Components**: PascalCase (e.g., `CardHeader`, `Button`)
- **Files**: kebab-case for non-components, PascalCase for components
- **Variables/functions**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Props interfaces**: `{ComponentName}Props` (e.g., `ButtonProps`)

### File Structure

```
src/
├── components/ui/          # shadcn/ui components (owned by this project)
├── lib/utils.ts            # cn() utility for class merging
├── App.tsx                 # Main application component
├── index.css               # Global styles + CSS variables
└── main.tsx                # Entry point
```

### Error Handling

- Use TypeScript types to prevent runtime errors
- Handle null/undefined with optional chaining and nullish coalescing
- Component props should include proper TypeScript types for all HTML attributes
- No explicit try/catch unless handling async operations

### Adding New Components

Run: `pnpm dlx shadcn@latest add <component-name>`

Or manually copy from ui.shadcn.com to `src/components/ui/`, then export from barrel file.

### Key Dependencies

- React 19, React DOM 19
- TypeScript 5.9 with strict mode
- Vite 7.x for bundling
- Tailwind CSS v4 with PostCSS
- class-variance-authority for variants
- clsx + tailwind-merge for class utilities
- Lucide React for icons
