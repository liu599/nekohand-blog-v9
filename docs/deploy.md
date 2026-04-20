# Production Deployment

This project can run either with Docker or as a plain Node.js service behind Nginx.

## Recommended

Use Docker for production unless you specifically need `pm2` on the host.

## Runtime

- App server: `next start`
- Production port: `2222`
- Container port: `2222`
- Reverse proxy: `nginx`

## Docker

### Build Image

```bash
docker build -t nekohand-blog-v9 .
```

### Run Container

```bash
docker run -d \
  --name nekohand-blog-v9 \
  --restart unless-stopped \
  -p 2222:2222 \
  nekohand-blog-v9
```

### Run Remote Image

```bash
docker run -d -p 2222:2222 --name my-nextjs-app crpi-wl61u5kndq0f4th8.cn-shanghai.personal.cr.aliyuncs.com/eddie32/g1:1.0.0
```

### Docker Compose

```bash
docker compose up -d --build
```

Common operations:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

Nginx can continue to proxy to `127.0.0.1:2222`.

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

Use this only if you are not deploying with Docker.

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
docker compose up -d --build
```

For host-based `pm2` deployment:

```bash
cd /home/wwwroot/blog.ecs32.top/nekohand_blog_9
git pull
pnpm install --frozen-lockfile
pnpm build
pm2 restart nekohand-blog-v9
```

## Why `output: 'export'` Was Removed

`next start` requires a normal Next.js server build. Static export mode does not match the `pm2 + next start` deployment path.
