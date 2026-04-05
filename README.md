# Nekohand Blog v9

A modern blog system built with Next.js 14 and Material UI v5.

## 🎉 Features

- **Next.js 14** - App Router, React Server Components
- **Material UI v5** - Modern component library with beautiful design
- **TypeScript** - Full type safety
- **Zustand** - Lightweight state management
- **Music Player** - Complete audio player with playlist support
- **Blog System** - Post list with pagination and categories
- **Gallery** - Image gallery with pagination
- **Responsive Design** - Works on desktop and mobile
- **Static Export** - Can be deployed to any static hosting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Export as static site
pnpm export
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
nekohand_blog_9/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── blog/              # Blog pages
│   ├── gallery/           # Gallery pages
│   ├── about/             # About page
│   └── friends/           # Friends page
├── components/            # React components
│   ├── layout/           # Layout components
│   └── music/            # Music player components
├── lib/                   # Utilities and stores
│   ├── api/              # API configuration
│   └── stores/           # Zustand stores
├── types/                 # TypeScript type definitions
├── styles/                # Theme and global styles
└── public/               # Static assets
```

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety

### UI & Styling
- **Material UI v5** - Component library
- **Emotion** - CSS-in-JS

### State Management
- **Zustand** - Lightweight state management

### Data Fetching
- **Axios** - HTTP client (ready for future use)
- **Fetch API** - Native browser API

### Storage
- **LocalForage** - Local storage for offline data

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "@mui/material": "^5.14.17",
    "@mui/icons-material": "^5.14.16",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "next": "14.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "localforage": "^1.10.0"
  }
}
```

## 🎨 Pages

### Homepage (`/`)
- Game information cards
- Music albums showcase
- Artists display
- Topic section
- Audio player (fixed at bottom)

### Blog (`/blog`)
- Blog post list
- Pagination
- Category filtering
- Post previews with metadata

### Gallery (`/gallery`)
- Image grid display
- Pagination
- Responsive layout

### About (`/about`)
- Project information
- Technology stack
- Version history

### Friends (`/friends`)
- Friends links
- Avatar display
- External links

## 🎵 Music Player Features

- Play/Pause control
- Next/Previous track
- Seek bar
- Volume control
- Mute toggle
- Display album art
- Show track information
- Playlist support

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://kasumi.ecs32.top
NEXT_PUBLIC_MUSIC_API_URL=https://mltd.ecs32.top
```

### Static Export Configuration

The project is configured for static export in `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

## 📝 API Endpoints

The application uses the following API endpoints:

- **Blog Posts**: `https://kasumi.ecs32.top/api/nekohand/v2/frontend/posts`
- **Music List**: `https://mltd.ecs32.top/filelist`
- **Pictures**: `https://mltd.ecs32.top/tag.filelist`
- **Friends**: `https://api.ecs32.top/service/friends`

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

The static files will be generated in the `out/` directory.

### Deploy to Static Hosting

You can deploy the `out/` directory to any static hosting service:

- **Vercel**: Automatic deployment
- **Netlify**: Drag and drop `out/` folder
- **GitHub Pages**: Push `out/` contents
- **Any web server**: Upload `out/` directory

## 📄 License

GPL-3.0-or-later

## 👤 Author

Tokei <970228409@qq.com>

## 🙏 Acknowledgments

- Original project: nekohand_blog_8 (UmiJS 3 + Material-UI v4)
- Migrated to Next.js 14 + Material UI v5

## 🗺️ Roadmap

- [ ] Add internationalization (i18n)
- [ ] Implement blog post detail page
- [ ] Add comment system
- [ ] Improve music player (playlist management, lyrics)
- [ ] Add search functionality
- [ ] Implement user preferences
- [ ] Add dark mode
- [ ] Performance optimizations
- [ ] Add unit tests
