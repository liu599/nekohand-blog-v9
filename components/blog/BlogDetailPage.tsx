'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Post } from '@/types/blog';

type BlogDetailPageProps = {
  id: string | null;
};

export default function BlogDetailPage({ id }: BlogDetailPageProps) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) {
      setPost(null);
      return;
    }

    const cache = readPostCache();
    setPost(cache[id] || null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  if (!id || !post) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Post not found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please open this article from the blog list first.
          </Typography>
          <Button component={Link} href="/blog" variant="outlined">
            Back to Blog
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Button component={Link} href="/blog" variant="text" sx={{ mb: 2, px: 0 }}>
          Back to Blog
        </Button>

        <Typography variant="h3" gutterBottom>
          {post.title}
        </Typography>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 3 }}>
          {post.category && <Chip label={post.category} size="small" color="secondary" variant="outlined" />}
          <Chip
            label={`Created ${formatTimestamp(post.createdAt)}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          {post.modifiedAt && post.modifiedAt !== post.createdAt && (
            <Chip label={`Updated ${formatTimestamp(post.modifiedAt)}`} size="small" variant="outlined" />
          )}
          <Chip label={`Comments ${post.comment ?? 0}`} size="small" variant="outlined" />
        </Stack>

        <Box
          sx={{
            color: 'text.primary',
            lineHeight: 1.85,
            '& img': {
              maxWidth: '100%',
              height: 'auto',
            },
            '& pre': {
              overflowX: 'auto',
              padding: 2,
              borderRadius: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '& code': {
              fontFamily: 'Consolas, Monaco, monospace',
            },
            '& blockquote': {
              margin: '1.5rem 0',
              paddingLeft: 2,
              borderLeft: '4px solid',
              borderColor: 'divider',
              color: 'text.secondary',
            },
            '& p': {
              margin: '0 0 1rem',
            },
            '& a': {
              color: 'primary.main',
            },
          }}
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </CardContent>
    </Card>
  );
}

function formatTimestamp(timestamp?: number) {
  if (!timestamp) {
    return '';
  }

  return new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function readPostCache() {
  try {
    const rawCache = localStorage.getItem('blog-post-cache');
    return rawCache ? (JSON.parse(rawCache) as Record<string, Post>) : {};
  } catch {
    return {};
  }
}
