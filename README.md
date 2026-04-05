# Nekohand Blog v9

A blog system built with Next.js 14, Material UI v5, and Zustand.

## Features

- Next.js 14 App Router
- Material UI v5
- TypeScript
- Zustand state management
- Floating music player with persistent playback across route changes
- Blog pages
- Gallery pages
- Responsive layout

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm

### Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm start:prod
pnpm type-check
pnpm lint
```

`pnpm start:prod` starts the app on port `2222`.

## Docker Deployment

Build and run with Docker:

```bash
docker build -t nekohand-blog-v9 .
docker run -d --name nekohand-blog-v9 --restart unless-stopped -p 2222:2222 nekohand-blog-v9
```

Or use Docker Compose:

```bash
docker compose up -d --build
```

The container serves the app on port `2222`, so Nginx can continue to reverse proxy to `127.0.0.1:2222`.

## Project Structure

```text
nekohand_blog_9/
|- app/
|- components/
|- docs/
|- lib/
|- public/
|- styles/
\- types/
```

## Production Deployment

Production supports both Docker and `pm2 + next start` behind Nginx.

### Build

```bash
pnpm install --frozen-lockfile
pnpm build
```

### Run On Port 2222

```bash
pnpm start:prod
```

### PM2

```bash
pm2 start "pnpm start:prod" --name nekohand-blog-v9
pm2 save
pm2 startup
```

### Nginx

Use the sample config in `docs/nginx.production.conf`.

Notes:

- The upstream application port is `2222`.
- The Nginx sample file is intentionally gitignored because it is server-specific.

### Full Deployment Notes

See [deploy.md](/D:/Project/nekohand_blog_9/docs/deploy.md) for the complete deployment flow.

## API Endpoints

- Blog Posts: `https://kasumi.ecs32.top/api/nekohand/v2/frontend/posts`
- Music List: `https://mltd.ecs32.top/filelist`
- Pictures: `https://mltd.ecs32.top/tag.filelist`
- Friends: `https://api.ecs32.top/service/friends`

## License

GPL-3.0-or-later
