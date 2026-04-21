# Nekohand Blog v9 Development Guidelines

## Project Overview
Nekohand Blog v9 is a modern blog system built with Next.js 14, Material UI v5, and TypeScript. It features a music player, blog system, gallery, and responsive design with static export capability.

## Design System

### Visual Identity
- **Aesthetic**: Modern Material Design with Japanese content focus
- **Colors**: Primary orange (#ff7043), Secondary purple (#4a148c), Clean light theme
- **Typography**: System font stack with Material Design font weights
- **Theme**: Material UI v5 custom theme configuration
- **Language**: Japanese primary language support (lang="ja")

### Component Architecture

#### File Structure
```
nekohand_blog_9/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with MUI providers
│   ├── page.tsx           # Homepage
│   ├── blog/              # Blog pages
│   ├── gallery/           # Gallery pages
│   ├── about/             # About page
│   ├── friends/           # Friends page
│   └── favorites/         # Favorites/Bookmarks page
├── components/            # React components
│   ├── layout/           # Layout components (Header, Footer, MainLayout)
│   ├── music/            # Music player components
│   └── favorites/        # Favorites list components
├── lib/                  # Utilities and configuration
│   ├── api/             # API configuration and endpoints
│   └── stores/          # Zustand state stores
├── types/               # TypeScript type definitions
│   ├── music.ts        # Music-related types
│   └── blog.ts         # Blog-related types
├── styles/             # Theme and global styles
│   └── theme.ts       # MUI theme configuration
└── public/            # Static assets
```

### Component Guidelines

#### Layout Components
The app uses a consistent layout structure:
- `MainLayout.tsx` wraps all pages with Header and Footer
- `Header.tsx` provides navigation
- `Footer.tsx` contains site information
- Music player is fixed at bottom when active

#### Material UI Integration
- Use MUI components as primary UI building blocks
- Theme provider wraps entire application in `app/layout.tsx`
- `AppRouterCacheProvider` from `@mui/material-nextjs` handles SSR
- `CssBaseline` normalizes styles across browsers

**Example:**
```tsx
import { Button, Card, CardContent } from '@mui/material';

// Prefer MUI components for consistency
<Button variant="contained" color="primary">
  Click Me
</Button>
```

### Next.js App Router Patterns

#### Static Export Configuration
The project is configured for static export:
```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};
```

**Important:**
- All pages must be statically generatable
- No server-side rendering or API routes in app directory
- Use `trailingSlash: true` for clean URLs
- Images are unoptimized for static hosting

#### Page Component Pattern
```tsx
// app/blog/page.tsx
export default async function BlogPage() {
  // Fetch data at build time
  const data = await fetchBlogPosts();

  return (
    <Container>
      {/* Page content */}
    </Container>
  );
}
```

#### Metadata Pattern
```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nekohand Blog - Music & Life',
  description: 'A modern blog about music, games, and life',
};
```

### State Management

#### Zustand Store
The project uses Zustand for client-side state management.

**Primary Store:** `useMusicStore` (lib/stores/musicStore.ts)

**State Structure:**
```typescript
interface MusicState {
  current: { ix: number; data: Music | null };
  storage: Music[];
  albums: Album[];
  artists: Artist[];
  isPlaying: boolean;
  playlist: Music[];
  // Actions
  setMusicData: (musicData: Music[]) => void;
  playMusic: (music: Music, index: number) => void;
  pauseMusic: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setPlaylist: (playlist: Music[]) => void;
}
```

**Usage Pattern:**
```tsx
'use client';

import { useMusicStore } from '@/lib/stores/musicStore';

function MusicComponent() {
  const { current, isPlaying, togglePlay } = useMusicStore();

  // Always use store actions, never mutate directly
  togglePlay(); // ✅ Correct
  // isPlaying = !isPlaying; // ❌ Wrong

  return <div>{current.data?.name}</div>;
}
```

### Data Fetching

#### API Configuration
API endpoints are centralized in `lib/api/config.ts`:

**Main APIs:**
- Blog Posts: `https://kasumi.ecs32.top/api/nekohand/v2/frontend/posts`
- Music List: `https://mltd.ecs32.top/filelist`
- Pictures: `https://mltd.ecs32.top/tag.filelist`
- Friends: `https://api.ecs32.top/service/friends`
- Favorites/Bookmarks: `https://api.ecs32.top/service/favorites`

**Configuration Pattern:**
```typescript
export const API_CONFIG = {
  rootUrl: 'https://kasumi.ecs32.top',
  fileRootUrl: 'https://file.ecs32.top/data',
  // ... other endpoints
};

export const BLOG_API = {
  posts: 'https://kasumi.ecs32.top/api/nekohand/v2/frontend/posts',
  // ... other blog endpoints
};
```

#### Fetch Pattern
For static pages, fetch data at build time:
```tsx
async function fetchBlogPosts() {
  const response = await fetch(BLOG_API.posts);
  const data: BlogListResponse = await response.json();
  return data;
}

export default async function BlogPage() {
  const { posts, pager } = await fetchBlogPosts();

  return <BlogList posts={posts} pager={pager} />;
}
```

For client-side interactions:
```tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

function ClientComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(API_CONFIG.rootUrl + '/endpoint')
      .then(response => setData(response.data));
  }, []);

  return <div>{/* render data */}</div>;
}
```

### TypeScript Guidelines

#### Type Definitions
All types are defined in the `types/` directory:

**Music Types (types/music.ts):**
```typescript
export interface Music {
  name: string;
  artist: string;
  url: string;
  cover: string;
  album: string;
  filetype: string;
  lrc?: string | null;
  audioList: Music[];
  issueDate?: string;
}

export interface Album {
  album: string;
  audioList: Music[];
}

export interface Artist {
  artist: string;
  audioList: Music[];
}
```

**Blog Types (types/blog.ts):**
```typescript
export interface Post {
  pid: number;
  title: string;
  content: string;
  createTime: string;
  modifyTime?: string;
  categoryName?: string;
  tags?: string[];
  views?: number;
}

export interface Pager {
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPage: number;
}

export interface BlogListResponse {
  posts: Post[];
  pager: Pager;
}
```

**Favorites Types (types/favorites.ts):**
```typescript
export interface FavoriteLink {
  link: string;
  title: string;
}

export interface FavoriteCategory {
  category: string;
  links: FavoriteLink[];
  tags: string;
}

export interface FavoritesResponse {
  code: number;
  data: {
    content: FavoriteCategory[];
    description: string;
    info: {
      data: InfoData[];
      meta: {
        app: string;
        description: string;
        version: string;
      };
    };
    version: string;
  };
  success: boolean;
}
```

The favorites API returns categorized bookmarks with:
- Categories like "Golang", "FEND", "ElasticSearch", etc.
- Links with titles and URLs
- Tags for each category
- Additional info data (events, TV appearances, etc.)

#### Strict Typing
Always use proper types for props, state, and function parameters:
```tsx
// ✅ Correct
import { Post } from '@/types/blog';

interface BlogCardProps {
  post: Post;
  onReadMore: (pid: number) => void;
}

function BlogCard({ post, onReadMore }: BlogCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{post.title}</Typography>
        <Button onClick={() => onReadMore(post.pid)}>
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Styling Guidelines

#### Material UI Theme
Custom theme in `styles/theme.ts`:
```typescript
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff7043',
      light: '#ff8e64',
      dark: '#c43e00',
    },
    secondary: {
      main: '#4a148c',
      light: '#7c43bd',
      dark: '#12005e',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    // ... other typography variants
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: '8px' },
      },
    },
  },
});
```

#### Component Styling
Prefer MUI's `sx` prop for inline styles:
```tsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
    bgcolor: 'background.paper',
  }}
>
  {/* content */}
</Box>
```

### Path Aliases

#### TypeScript Path Mapping
Use `@/*` alias for imports:
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Usage:**
```tsx
import { useMusicStore } from '@/lib/stores/musicStore';
import { Post } from '@/types/blog';
import theme from '@/styles/theme';
import MainLayout from '@/components/layout/MainLayout';
```

## Common Patterns

### Music Player Integration
```tsx
'use client';

import { useMusicStore } from '@/lib/stores/musicStore';
import { Box, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

function MusicPlayer() {
  const { current, isPlaying, togglePlay, nextTrack, prevTrack } = useMusicStore();

  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <IconButton onClick={togglePlay}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <Typography>{current.data?.name}</Typography>
      {/* More controls */}
    </Box>
  );
}
```

### Card Component Pattern
```tsx
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Post } from '@/types/blog';

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={post.cover || '/placeholder.jpg'}
        alt={post.title}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.createTime}
        </Typography>
      </CardContent>
    </Card>
  );
}
```

### Pagination Pattern
```tsx
import { Pagination, Box } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function BlogPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
      />
    </Box>
  );
}
```

### Favorites/Bookmarks Pattern
The favorites API provides categorized bookmarks with tags:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Chip, Link, Grid } from '@mui/material';
import { FavoritesResponse, FavoriteCategory } from '@/types/favorites';
import { BLOG_API } from '@/lib/api/config';

function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteCategory[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      const response = await fetch(BLOG_API.favorites);
      const data: FavoritesResponse = await response.json();

      if (data.success && data.code === 0) {
        setFavorites(data.data.content);
      }
    }

    fetchFavorites();
  }, []);

  return (
    <Grid container spacing={3}>
      {favorites.map((category, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {category.category}
              </Typography>
              {category.tags.split(', ').map((tag, i) => (
                <Chip key={i} label={tag} size="small" />
              ))}
              {category.links.map((link, i) => (
                <Link key={i} href={link.link} target="_blank">
                  {link.title}
                </Link>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
```

## Environment Variables

### Configuration
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_URL=https://kasumi.ecs32.top
NEXT_PUBLIC_MUSIC_API_URL=https://mltd.ecs32.top
```

### Usage
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Deployment

### Build Process
```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Output in ./out directory
```

### Static Hosting
The `out/` directory can be deployed to:
- Vercel (automatic deployment)
- Netlify (drag and drop)
- GitHub Pages (push contents)
- Any static web server

## Development Workflow

### Scripts
```bash
# Development
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Production build
pnpm build

# Start production server
pnpm start
```

### Before Committing
- [ ] Run `pnpm type-check` to ensure no TypeScript errors
- [ ] Run `pnpm lint` to fix linting issues
- [ ] Test static export builds correctly: `pnpm build`
- [ ] Check responsive design on mobile and desktop
- [ ] Verify music player functionality
- [ ] Ensure all images have proper alt text
- [ ] Confirm no console errors in browser

## Best Practices

### Do's
✅ Use MUI components for consistency
✅ Follow TypeScript strict typing
✅ Use Zustand actions for state updates
✅ Implement proper error handling for API calls
✅ Keep components modular and reusable
✅ Use path aliases (`@/*`) for imports
✅ Add proper TypeScript types for all props
✅ Handle loading and error states
✅ Ensure responsive design
✅ Use semantic HTML elements

### Don'ts
❌ Don't mutate Zustand state directly
❌ Don't use server-side features incompatible with static export
❌ Don't skip TypeScript types
❌ Don't create components without proper typing
❌ Don't fetch data client-side when build-time fetch is possible
❌ Don't use raw `<a>` tags for internal navigation - use Next.js `Link`
❌ Don't forget `'use client'` directive for client components
❌ Don't hardcode API URLs - use config files

## Key Dependencies

### Frontend Framework
- **Next.js 14**: App Router, static export
- **React 18**: UI library
- **TypeScript**: Type safety

### UI & Styling
- **Material UI v5**: Component library
- **Emotion**: CSS-in-JS

### State Management
- **Zustand**: Lightweight state management

### Data Handling
- **Axios**: HTTP client
- **LocalForage**: Browser storage

### Utilities
- **Lodash**: Utility functions

## Music Player Features

The music player is a core feature with these capabilities:
- Play/Pause control
- Next/Previous track
- Playlist management
- Album and artist grouping
- Display album art and track info
- Fixed bottom position on active

## Known Limitations

### Static Export Constraints
- No server-side rendering
- No API routes in app directory
- No dynamic server features
- Images must be unoptimized
- All data must be fetchable at build time or client-side

### Pages Overview

#### Homepage (`/`)
- Game information cards
- Music albums showcase
- Artists display
- Topic section
- Audio player (fixed at bottom)

#### Blog (`/blog`)
- Blog post list
- Pagination
- Category filtering
- Post previews with metadata

#### Gallery (`/gallery`)
- Image grid display
- Pagination
- Responsive layout

#### About (`/about`)
- Project information
- Technology stack
- Version history

#### Friends (`/friends`)
- Friends links
- Avatar display
- External links

#### Favorites (`/favorites`)
- Categorized bookmarks
- Tags display
- External resource links
- Organized by category (Golang, FEND, ElasticSearch, Devops, etc.)

## Migration Context

This project was migrated from:
- **Source**: nekohand_blog_8 (UmiJS 3 + Material-UI v4)
- **Target**: Next.js 14 + Material UI v5

Key migration changes:
- UmiJS → Next.js App Router
- Material-UI v4 → v5
- Improved TypeScript coverage
- Static export capability
- Modern React patterns

### API Response Patterns

#### Success Response
All APIs follow a consistent response structure:
```typescript
{
  code: 0,        // 0 indicates success
  success: true,
  data: {
    // Response data
  }
}
```

#### Error Handling
Always check both `success` flag and `code` value:
```typescript
const response = await fetch(API_ENDPOINT);
const data = await response.json();

if (data.success && data.code === 0) {
  // Handle success
  setData(data.data);
} else {
  // Handle error
  setError('Failed to load data');
}
```

#### Favorites API Special Fields
The favorites API (`BLOG_API.favorites`) includes additional metadata:
- `data.info.data`: Event and TV appearance data
- `data.info.meta`: Application metadata
- `data.content`: Array of categorized bookmarks

## Troubleshooting

### Common Issues

**Build fails with static export:**
- Ensure no server-side only features are used
- Check all images are unoptimized
- Verify all data fetching works at build time

**Material UI styles not working:**
- Ensure `AppRouterCacheProvider` wraps the app
- Check `ThemeProvider` is properly configured
- Verify `CssBaseline` is included

**Music player state issues:**
- Always use Zustand actions, never mutate directly
- Check that `'use client'` directive is present
- Verify store initialization

**TypeScript errors:**
- Run `pnpm type-check` for detailed errors
- Ensure all imports use correct path aliases
- Check that types are properly exported/imported

## Questions or Issues?

Refer to:
- Project README.md for quick start and features
- MIGRATION_SUMMARY.md for migration details
- REFACTOR_PLAN.md for refactoring notes
- Codebase examples in similar components

When in doubt, follow established patterns in the existing codebase.

## Release Workflow Notes

- The release branch is used to publish builds. Pushing to `release` or `release/**` triggers the repository workflow that reads `package.json.version` and creates or updates a tag in the form `release-vX.Y.Z`.
- A repository tag named `release-v1.2.3` is the default release trigger. When cloud build infrastructure watches that tag, it should build and publish the Docker image as version `1.2.3`.
- If there is also a custom tag named exactly `1.2.3`, that custom rule takes precedence over `release-v1.2.3`.
- For manual release publishing, use this exact order:
- First push the desired code changes to `main`.
- Then fetch or inspect the latest remote `main` commit, because the version bump workflow may have already advanced `package.json.version`.
- Read `origin/main:package.json` and use that remote version as the release version.
- Create a new tag in the form `release-v<version>` on the latest remote `main` commit and push that tag.
- Do not reuse or move an older release tag when the version has already advanced; publish a new tag such as `release-v9.1.5`.
