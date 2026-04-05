import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ padding: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ marginBottom: 4 }}>
        Blog Posts
      </Typography>
      {children}
    </Box>
  );
}
