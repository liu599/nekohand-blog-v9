'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Nekohand Blog. Built with '}
          <Link color="inherit" href="https://nextjs.org/">
            Next.js
          </Link>
          {' & '}
          <Link color="inherit" href="https://mui.com/">
            Material UI
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
