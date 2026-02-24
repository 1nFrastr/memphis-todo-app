# 快速开始指南

## 安装依赖

```bash
pnpm install
```

## 开发

```bash
pnpm dev
```

访问 http://localhost:5173

## 构建

```bash
pnpm build
```

## 预览生产构建

```bash
pnpm preview
```

## 发布

创建发布包（tar.gz）：

```bash
pnpm release
```

发布包将保存在 `release/` 目录中。

## 添加更多组件

使用 shadcn CLI 添加组件：

```bash
pnpm dlx shadcn@latest add <component-name>
```

示例：

```bash
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add input
```

## 技术栈

- React 19 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React (图标)
- pnpm

## 项目结构

```
src/
├── components/
│   └── ui/              # shadcn/ui 组件
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   └── utils.ts         # 工具函数
├── App.tsx              # 主应用组件
├── index.css            # 全局样式
└── main.tsx             # 入口文件
```

## 发布说明

`pnpm release` 命令会：
- 排除 node_modules、dist、release 等目录
- 创建带时间戳的 tar.gz 压缩包
- 保存到 release/ 目录
- 显示压缩包大小

接收者只需：
1. 解压压缩包
2. 运行 `pnpm install`
3. 开始开发
