'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export default function AboutPage() {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ marginBottom: 4 }}>
        About
      </Typography>

      <Box
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.58)',
          padding: { xs: 3, md: 4 },
          backdropFilter: 'blur(2px)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Nekohand Blog v9
        </Typography>
        <Typography paragraph>
          Welcome to Nekohand Blog! This is a modern blog system built with Next.js 14 and Material
          UI v5.
        </Typography>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.58)' }} />

        <Typography variant="h6" gutterBottom>
          Technology Stack
        </Typography>
        <Typography component="div">
          <ul>
            <li>Next.js 14 (App Router)</li>
            <li>React 18</li>
            <li>Material UI v5</li>
            <li>TypeScript</li>
            <li>Zustand (State Management)</li>
            <li>pnpm (Package Manager)</li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
          Features
        </Typography>
        <Typography component="div">
          <ul>
            <li>Blog posts with pagination</li>
            <li>Music album gallery</li>
            <li>Artist information</li>
            <li>Responsive design</li>
            <li>Static export support</li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
          Version History
        </Typography>
        <Typography component="div" sx={{ '& ul': { margin: 0, paddingLeft: 3 } }}>
          <ul>
            <li>
              <strong>WordPress</strong>
              <ul>
                <li>2014.09.28 Version 1.0 Scarlet</li>
                <li>2015.01.21 Version 2.0 Scarlet Gai 2</li>
                <li>2015.03.20 Version 3.0 Scarlet Gai 3</li>
                <li>2015.06.20 Version 4.0 White Day</li>
              </ul>
            </li>
            <li>
              <strong>Jekyll Static</strong>
              <ul>
                <li>2017.02.12 Version 5.0 Nekohand&apos;s Jekyll Blog</li>
              </ul>
            </li>
            <li>
              <strong>ReactJS</strong>
              <ul>
                <li>2017.11.12 Version 6.0 Poppin&apos; Party with React</li>
                <li>2018.10.07 Version 7.0 Kasumi with UmiJS</li>
                <li>2019.09.14 Version 7.2 Kasumi-Symphjoy with React-Symphjoy</li>
                <li>2020.10.03 Version 7.4 Kasumi-Symphjoy with React-Symphjoy</li>
                <li>2021.01.03 v8.0.0 UmiJS 3.0 + Material-UI v4</li>
                <li>2026.04.05 v9.0.0 Next.js 14 + Material UI v5 complete rewrite with claude code</li>
              </ul>
            </li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
          Author
        </Typography>
        <Typography paragraph>Tokei</Typography>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
          License
        </Typography>
        <Typography paragraph>GPL-3.0-or-later</Typography>
      </Box>
    </Box>
  );
}
