'use client';

import Link from 'next/link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/blog': 'Blog',
  '/blog/post': 'Post',
  '/favorites': 'Favorites',
  '/friends': 'Friends',
  '/gallery': 'Gallery',
};

export default function GlobalBreadcrumbs() {
  const pathname = usePathname();
  const normalizedPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;

  if (normalizedPath === '/') {
    return null;
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  const items = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    return {
      href,
      label: routeLabels[href] ?? formatSegmentLabel(segment),
    };
  });

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        <Typography
          component={Link}
          href="/"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': {
              color: 'text.primary',
            },
          }}
        >
          Home
        </Typography>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast) {
            return (
              <Typography key={item.href} color="text.primary">
                {item.label}
              </Typography>
            );
          }

          return (
            <Typography
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              {item.label}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}

function formatSegmentLabel(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
