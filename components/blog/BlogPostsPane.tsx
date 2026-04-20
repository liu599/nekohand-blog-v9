'use client';

import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Category, Post } from '@/types/blog';

type BlogPostsPaneProps = {
  posts: Post[];
  categories: Category[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

export default function BlogPostsPane({
  posts,
  categories,
  loading,
  totalPages,
  currentPage,
  onPageChange,
}: BlogPostsPaneProps) {
  const categoryMap = new Map(categories.map((category) => [category.id, category.cname]));

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

      <Box
        sx={{
          '--timeline-axis-xs': '11px',
          '--timeline-axis-md': '133px',
          position: 'relative',
          pl: { xs: 0, md: 3 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 6,
            bottom: 6,
            left: { xs: 'var(--timeline-axis-xs)', md: 'var(--timeline-axis-md)' },
            width: '1px',
            background:
              'linear-gradient(180deg, rgba(255,59,114,0.18), rgba(122,76,255,0.2), rgba(255,59,114,0.1))',
          },
        }}
      >
        {posts.map((post) => {
          const created = formatTimestamp(post.createdAt);
          const categoryName = post.category ? categoryMap.get(post.category) || post.category : null;

          return (
            <Box
              key={post.id || post.pid}
              sx={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: { xs: '22px 1fr', md: '86px 22px 1fr' },
                columnGap: { xs: 1, md: 1.5 },
                alignItems: 'start',
                py: { xs: 2.25, md: 2.75 },
              }}
            >
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  textAlign: 'right',
                  pt: 0.55,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                >
                  {created}
                </Typography>
              </Box>

              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  pt: 0.62,
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,59,114,0.9)',
                    border: '1px solid rgba(255,255,255,0.95)',
                    boxShadow: '0 0 0 1.5px rgba(255,59,114,0.08)',
                  }}
                />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Box
                  component={Link}
                  href={`/blog/post?id=${post.pid}`}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderRadius: 2,
                    px: { xs: 0.25, md: 0.5 },
                    py: 0.25,
                    transition: 'transform 140ms ease, background-color 140ms ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      mb: 0.9,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: 'text.primary',
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      alignItems: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    {categoryName && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'secondary.main',
                          fontWeight: 600,
                        }}
                      >
                        #{categoryName}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

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
