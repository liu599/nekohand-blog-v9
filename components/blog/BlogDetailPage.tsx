import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Post } from '@/types/blog';

type BlogDetailPageProps = {
  id: string | null;
  post: Post | null;
  categoryName?: string | null;
};

export default function BlogDetailPage({ id, post, categoryName }: BlogDetailPageProps) {
  if (!id || !post) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Post not found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The requested article could not be loaded.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 1, md: 2 } }}>
      <Typography variant="h3" gutterBottom>
        {post.title}
      </Typography>

      <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap" sx={{ mb: 3 }}>
        {categoryName && (
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              backgroundColor: 'rgba(123, 97, 255, 0.10)',
              color: 'secondary.main',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {categoryName}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
            backgroundColor: 'rgba(255, 99, 132, 0.10)',
            color: 'error.main',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Created {formatTimestamp(post.createdAt)}
          </Typography>
        </Box>
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
        dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(post.body) }}
      />
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

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  };

  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
    .replace(/&([a-zA-Z]+);/g, (match, entity) => namedEntities[entity] ?? match);
}
