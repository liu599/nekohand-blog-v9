'use client';

import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { Post } from '@/types/blog';

type BlogPostsPaneProps = {
  posts: Post[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

export default function BlogPostsPane({
  posts,
  loading,
  totalPages,
  currentPage,
  onPageChange,
}: BlogPostsPaneProps) {
  return (
    <Box sx={{ position: 'relative', minHeight: 240 }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(1px)',
            borderRadius: 2,
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}

      <Grid container spacing={3}>
        {posts.map((post) => {
          const excerpt = getExcerpt(post.body || '');

          return (
            <Grid item xs={12} key={post.id || post.pid}>
              <Card>
                <CardActionArea
                  component={Link}
                  href={`/blog/post?id=${post.id}`}
                  sx={{ alignItems: 'stretch' }}
                >
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {post.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, marginBottom: 2, flexWrap: 'wrap' }}>
                      {post.category && (
                        <Chip label={post.category} size="small" color="secondary" variant="outlined" />
                      )}
                      <Chip
                        label={`Created ${formatTimestamp(post.createdAt)}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {post.modifiedAt && post.modifiedAt !== post.createdAt && (
                        <Chip
                          label={`Updated ${formatTimestamp(post.modifiedAt)}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      <Chip label={`Comments ${post.comment ?? 0}`} size="small" variant="outlined" />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {excerpt.substring(0, 200)}
                      {excerpt.length > 200 ? '...' : ''}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', marginTop: 1.5 }}
                    >
                      {post.slug}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {!loading && posts.length === 0 && (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No posts found.
          </Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
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

function getExcerpt(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}
