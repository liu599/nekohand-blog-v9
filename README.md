# Nekohand Blog v9

Nekohand Blog v9 is a personal blog application built with Next.js 16 App Router, React 19, Material UI v5, TypeScript, and Zustand.

## Tech Stack

- Next.js 16.2
- React 19.2
- Material UI v5
- TypeScript
- Zustand
- Axios 1.15
- pnpm

## Features

- App Router based blog pages
- Gallery pages with album mode and image preview
- Favorites page
- Friends page
- Persistent floating music player across route changes
- Responsive layout

## Requirements

- Node.js 20.9+ recommended
- pnpm 10+

## Quick Start

Install dependencies:

```bash
pnpm install
```

Start local development:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm start:prod
pnpm type-check
pnpm lint
```

Notes:

- `pnpm start:prod` starts the app on port `2222`.
- `pnpm lint` uses the ESLint CLI with the flat config in `eslint.config.mjs`.

## Production Notes

This project now runs on a normal Next.js server build with `next start`.

- `/blog` and `/blog/post` are dynamic routes because they fetch live remote data.
- `/gallery` remains statically generated, with client-side search param handling wrapped for Next.js 16 compatibility.

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

The container serves the app on port `2222`, so Nginx can reverse proxy to `127.0.0.1:2222`.

## Manual Production Deployment

Install and build:

```bash
pnpm install --frozen-lockfile
pnpm build
```

Run on port `2222`:

```bash
pnpm start:prod
```

PM2 example:

```bash
pm2 start "pnpm start:prod" --name nekohand-blog-v9
pm2 save
pm2 startup
```

Full deployment notes are in [deploy.md](./docs/deploy.md).

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

## External APIs

- Blog Posts: `https://kasumi.ecs32.top/api/nekohand/v2/frontend/posts`
- Music List: `https://mltd.ecs32.top/filelist`
- Pictures: `https://mltd.ecs32.top/tag.filelist`
- Friends: `https://api.ecs32.top/service/friends`

## License

GPL-3.0-or-later
