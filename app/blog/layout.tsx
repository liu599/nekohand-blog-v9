import Box from '@mui/material/Box';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box sx={{ py: { xs: 1, md: 2 } }}>{children}</Box>;
}
