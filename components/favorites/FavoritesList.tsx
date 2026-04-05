'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Link,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FavoritesResponse, FavoriteCategory } from '@/types/favorites';
import { BLOG_API } from '@/lib/api/config';

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await fetch(BLOG_API.favorites);
        const data: FavoritesResponse = await response.json();

        if (data.success && data.code === 0) {
          setFavorites(data.data.content);
        } else {
          setError('Failed to load favorites');
        }
      } catch (err) {
        setError('Error fetching favorites');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Bookmarks & Favorites
      </Typography>

      <Grid container spacing={3}>
        {favorites.map((category, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {category.category}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {category.tags.split(', ').map((tag, tagIndex) => (
                    <Chip
                      key={tagIndex}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {category.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{
                        color: 'text.primary',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      • {link.title}
                    </Link>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
