#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const version = packageJson.version;
const name = packageJson.name;

// 生成发布包文件名
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const releaseFileName = `${name}-${version}-${timestamp}.tar.gz`;
const releasePath = path.join(rootDir, 'release', releaseFileName);

// 创建 release 目录
if (!fs.existsSync(path.join(rootDir, 'release'))) {
  fs.mkdirSync(path.join(rootDir, 'release'), { recursive: true });
}

console.log('📦 Creating release package...');
console.log(`📄 Package: ${releaseFileName}`);

// 需要排除的文件和目录
const excludePatterns = [
  'node_modules',
  'dist',
  'release',
  '.git',
  '.claude',
  'pnpm-lock.yaml',
  '*.log',
  '.DS_Store',
];

try {
  // 使用 tar 命令创建压缩包
  const excludeArgs = excludePatterns.map(pattern => `--exclude='${pattern}'`).join(' ');
  const command = `tar -czf "${releasePath}" ${excludeArgs} -C "${rootDir}" .`;

  execSync(command, { stdio: 'inherit' });

  console.log('✅ Release package created successfully!');
  console.log(`📍 Location: ${releasePath}`);

  // 显示文件大小
  const stats = fs.statSync(releasePath);
  const fileSizeInKB = (stats.size / 1024).toFixed(2);
  console.log(`📊 Size: ${fileSizeInKB} KB`);

} catch (error) {
  console.error('❌ Error creating release package:', error.message);
  process.exit(1);
}
