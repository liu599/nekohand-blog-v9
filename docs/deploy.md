# Production Deployment

This project runs as a Node.js service behind Nginx, managed by `pm2`.

## Runtime

- App server: `next start`
- Production port: `2222`
- Process manager: `pm2`
- Reverse proxy: `nginx`

## Install And Build

```bash
pnpm install --frozen-lockfile
pnpm build
```

## Start Manually

```bash
pnpm start:prod
```

## PM2 Commands

Start:

```bash
pm2 start "pnpm start:prod" --name nekohand-blog-v9
```

Common operations:

```bash
pm2 status
pm2 logs nekohand-blog-v9
pm2 restart nekohand-blog-v9
pm2 save
pm2 startup
```

## Nginx

Reference the local sample file:

```text
docs/nginx.production.conf
```

Notes:

- The upstream service port is `2222`.
- That Nginx file is intentionally gitignored because it is environment-specific.

## Update Flow

```bash
cd /home/wwwroot/blog.ecs32.top/nekohand_blog_9
git pull
pnpm install --frozen-lockfile
pnpm build
pm2 restart nekohand-blog-v9
```

## Why `output: 'export'` Was Removed

`next start` requires a normal Next.js server build. Static export mode does not match the `pm2 + next start` deployment path.
