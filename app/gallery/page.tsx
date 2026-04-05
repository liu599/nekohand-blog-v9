'use client';

import { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { API_CONFIG, BLOG_API } from '@/lib/api/config';

const GALLERY_TAG_ID = '5e50152d58adfe5f36e095f5';
const PAGE_SIZE = 40;

interface Picture {
  id: number;
  src: string;
  title?: string;
  tags?: string[];
}

interface GalleryApiItem {
  fileId: string | number;
  relativePath: string;
  fileName: string;
  tags?: string[];
}

interface GalleryApiResponse {
  data?: GalleryApiItem[];
  pager?: {
    pagenum?: string | number;
    pagesize?: string | number;
    total?: string | number;
  };
}

export default function GalleryPage() {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void fetchPictures(1, true);
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading || loadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: '800px 0px',
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, loadingMore, pictures.length]);

  useEffect(() => {
    if (currentPage === 1) {
      return;
    }

    void fetchPictures(currentPage, false);
  }, [currentPage]);

  async function fetchPictures(page: number, replace: boolean) {
    if (replace) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const body = new URLSearchParams({
        pagenum: String(page),
        pagesize: String(PAGE_SIZE),
        tagid: GALLERY_TAG_ID,
      });

      const response = await fetch(BLOG_API.aimiPic, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data: GalleryApiResponse = await response.json();
      const items = data.data || [];
      const existingCount = replace ? 0 : pictures.length;
      const processedData = items.map((item, index) => ({
        id: Number(item.fileId) || index + (page - 1) * PAGE_SIZE,
        src: `${API_CONFIG.ossRootUrl}${item.relativePath}${item.fileName}`,
        title: item.fileName,
        tags: item.tags || [],
      }));

      setPictures((prev) => (replace ? processedData : [...prev, ...processedData]));
      setError(null);

      const total = Number(data.pager?.total || 0);
      const nextCount = existingCount + processedData.length;
      setHasMore(total > 0 ? nextCount < total : processedData.length === PAGE_SIZE);
    } catch (error) {
      console.error('Failed to fetch pictures:', error);
      setError('Failed to load gallery.');
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function renderStatus() {
    if (loading) {
      return (
        <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      );
    }

    if (error && pictures.length === 0) {
      return (
        <Box sx={{ padding: 4 }}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      );
    }

    return null;
  }

  const status = renderStatus();

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ marginBottom: 4 }}>
        Gallery
      </Typography>

      {status}

      <Grid container spacing={2}>
        {pictures.map((picture) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={picture.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={picture.src}
                alt={picture.title || `Picture ${picture.id}`}
                sx={{ objectFit: 'cover' }}
                loading="lazy"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                {picture.title && (
                  <Typography variant="subtitle2" noWrap>
                    {picture.title}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        ref={loadMoreRef}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 72, mt: 4 }}
      >
        {loadingMore && <CircularProgress size={28} color="primary" />}
        {!hasMore && pictures.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            No more pictures.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
