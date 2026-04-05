# Nekohand Blog 重构计划 - Next.js 14 + Material UI

## 项目概述
将 nekohand_blog_8 (UmiJS 3 + Material-UI v4) 重构为现代化 Next.js 14 应用，使用 Material UI v5 和 App Router。

## 原项目分析

### 技术栈
- **框架**: UmiJS 3.0
- **UI 库**: Material-UI v4
- **状态管理**: DVA (基于 Redux)
- **路由**: UmiJS 约定式路由
- **样式**: LESS + styled-components
- **包管理**: pnpm (已使用)

### 主要功能
1. **首页** (`/`)
   - 展示当前播放的游戏信息（公主连接、原神）
   - 音乐专辑展示
   - 艺术家展示
   - 主题话题展示

2. **博客模块** (`/nekohand/blog`)
   - 博客文章列表
   - 分页功能
   - 分类筛选
   - 时间轴浏览

3. **相册模块** (`/zo/zo-gallery`)
   - 图片展示
   - 相册浏览

4. **其他页面**
   - About (`/about`)
   - Friends (`/friends`)
   - Bookmarks (`/bookmarks`)

5. **音乐功能**
   - 音乐播放列表
   - 艺术家信息
   - 专辑信息
   - 本地缓存（localforage）

6. **国际化**
   - 支持中文/英文切换

## 重构目标

### 技术栈升级
- ✅ Next.js 14 (App Router)
- ✅ React 18+
- ✅ Material UI v5 (最新版本)
- ✅ TypeScript
- ✅ pnpm (保持使用)
- ✅ ESLint + Prettier

### 架构改进
1. **路由系统**: 从 UmiJS 约定式路由迁移到 Next.js App Router
2. **状态管理**: 从 DVA 迁移到 Zustand (轻量级) 或 React Context
3. **数据获取**: 使用 React Server Components + Server Actions
4. **样式方案**: 统一使用 Material UI v5 的 sx prop + styled API
5. **类型安全**: 全面引入 TypeScript

## 实施计划

### Phase 1: 项目初始化 (优先级: 高)
1. 创建 Next.js 14 项目
   - 使用 `create-next-app` 初始化
   - 配置 TypeScript
   - 配置 pnpm

2. 安装核心依赖
   - `@mui/material` v5
   - `@mui/icons-material` v5
   - `@emotion/react` + `@emotion/styled`
   - `zustand` (状态管理)
   - `axios` (API 请求)
   - `localforage` (本地存储)

3. 配置项目结构
   - App Router 目录结构
   - TypeScript 配置
   - ESLint + Prettier 配置

### Phase 2: 核心布局 (优先级: 高)
1. 创建 Root Layout
   - Material UI ThemeProvider 配置
   - CssBaseline 配置
   - 响应式布局

2. 创建 Header 组件
   - 导航栏
   - 语言切换
   - 响应式菜单

3. 创建 Footer 组件
   - Sticky Footer 实现

### Phase 3: 首页实现 (优先级: 高)
1. 实现首页布局
   - 游戏信息卡片
   - 专辑展示区
   - 艺术家展示区
   - 话题展示区

2. 实现组件
   - `CardGallery` - 卡片画廊
   - `ArtistGrid` - 艺术家网格
   - `Topic` - 话题展示

### Phase 4: 博客模块 (优先级: 高)
1. 博客列表页 (`/blog`)
   - 文章列表
   - 分页组件
   - 分类筛选

2. 博客详情页 (`/blog/[id]`)
   - 文章内容渲染
   - 评论系统（待定）

3. 时间轴页 (`/blog/timeline`)
   - 按时间展示文章

### Phase 5: 相册模块 (优先级: 中)
1. 相册列表页 (`/gallery`)
   - 图片网格展示
   - 瀑布流布局

2. 相册详情页 (`/gallery/[id]`)
   - 图片预览
   - Lightbox 效果

### Phase 6: 其他页面 (优先级: 中)
1. About 页面
2. Friends 页面
3. Bookmarks 页面

### Phase 7: 数据层 (优先级: 高)
1. API 集成
   - 迁原项目 API 配置
   - 使用 Server Components 获取数据
   - 实现数据缓存策略

2. 状态管理
   - 音乐播放状态 (Zustand)
   - 用户偏好设置
   - 本地存储同步

### Phase 8: 优化与部署 (优先级: 中)
1. 性能优化
   - 图片优化 (next/image)
   - 字体优化 (next/font)
   - 代码分割

2. SEO 优化
   - Metadata 配置
   - Open Graph 标签
   - Sitemap 生成

3. 部署配置
   - 环境变量配置
   - 构建优化
   - 部署脚本

## 文件结构规划

```
nekohand_blog_9/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # 首页
│   ├── blog/
│   │   ├── page.tsx           # 博客列表
│   │   ├── [id]/
│   │   │   └── page.tsx       # 博客详情
│   │   └── timeline/
│   │       └── page.tsx       # 时间轴
│   ├── gallery/
│   │   ├── page.tsx           # 相册列表
│   │   └── [id]/
│   │       └── page.tsx       # 相册详情
│   ├── about/page.tsx
│   ├── friends/page.tsx
│   └── bookmarks/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── blog/
│   │   ├── BlogList.tsx
│   │   ├── BlogCard.tsx
│   │   └── Pagination.tsx
│   ├── gallery/
│   │   ├── Gallery.tsx
│   │   └── ImageCard.tsx
│   ├── music/
│   │   ├── ArtistGrid.tsx
│   │   ├── AlbumGallery.tsx
│   │   └── TopicCard.tsx
│   └── ui/
│       ├── Loading.tsx
│       └── ErrorBoundary.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts          # API 客户端
│   │   ├── blog.ts            # 博客 API
│   │   └── music.ts           # 音乐 API
│   ├── stores/
│   │   ├── musicStore.ts      # 音乐状态
│   │   └── settingsStore.ts   # 设置状态
│   └── utils/
│       ├── storage.ts         # 本地存储
│       └── format.ts          # 格式化工具
├── types/
│   ├── blog.ts
│   ├── music.ts
│   └── common.ts
├── public/
│   ├── images/
│   └── fonts/
└── styles/
    └── theme.ts               # Material UI 主题配置
```

## 关键技术决策

### 1. 状态管理选择: Zustand
**原因**:
- 比 DVA/Redux 轻量很多
- 无需 Provider 包装
- TypeScript 支持优秀
- 适合中小型应用

### 2. 数据获取策略
**Server Components (主要)**:
- 博客列表/详情 - 服务端渲染，SEO 友好
- 相册列表 - 服务端渲染

**Client Components**:
- 音乐播放器控制
- 用户交互组件
- 实时状态更新

### 3. 样式方案
**Material UI v5 sx prop**:
- 性能优秀
- TypeScript 完整支持
- 响应式设计简便

### 4. API 配置
保留原项目的 API 配置结构，迁移到环境变量：
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_MUSIC_API_URL`
- 其他敏感信息使用 Server Actions

## 迁移注意事项

1. **Material-UI v4 → v5**
   - `makeStyles` → `styled` 或 `sx` prop
   - `withStyles` → `styled`
   - Theme 结构变化
   - Icon 名称变化

2. **DVA → Zustand**
   - Model → Store
   - Effects → Actions
   - Reducers → 直接修改 state

3. **UmiJS → Next.js**
   - 约定式路由 → App Router
   - `umi/link` → `next/link`
   - `umi/router` → `next/navigation`

4. **数据处理**
   - 保持原有的数据格式和转换逻辑
   - 使用 TypeScript 类型定义

## 风险与挑战

1. **API 兼容性**: 需要确保后端 API 仍然可用
2. **图片资源**: 需要处理图片路径和优化
3. **SEO 影响**: 从 SPA 迁移到 SSR，需要测试 SEO 效果
4. **性能对比**: 需要对比重构前后的性能指标

## 测试计划

1. **功能测试**
   - 所有页面路由正常
   - API 数据正确获取
   - 用户交互流畅

2. **性能测试**
   - Lighthouse 评分
   - First Contentful Paint
   - Time to Interactive

3. **兼容性测试**
   - 主流浏览器测试
   - 移动端响应式测试

## 时间估算

- Phase 1-2: 1-2 天
- Phase 3-4: 3-4 天
- Phase 5-6: 2-3 天
- Phase 7: 2-3 天
- Phase 8: 1-2 天

**总计**: 约 10-14 天

## 下一步行动

1. 初始化 Next.js 14 项目
2. 配置 Material UI v5 主题
3. 实现基础布局
4. 逐步迁移核心功能
