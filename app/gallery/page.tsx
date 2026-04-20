'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { API_CONFIG, BLOG_API } from '@/lib/api/config';
import { fetchMusicCatalogClient } from '@/lib/music/catalog';
import { Music } from '@/types/music';

const GALLERY_TAG_ID = '5e50152d58adfe5f36e095f5';
const PAGE_SIZE = 40;

type AlbumGroup = Music & { audioList: Music[] };

interface Picture {
  id: number;
  src: string;
  title?: string;
}

interface GalleryApiItem {
  fileId: string | number;
  relativePath: string;
  fileName: string;
}

interface GalleryApiResponse {
  data?: GalleryApiItem[];
  pager?: {
    total?: string | number;
  };
}

type GalleryPageContentProps = {
  albumKey: string | null;
  isAlbumsMode: boolean;
};

function GalleryPageContent({ albumKey, isAlbumsMode }: GalleryPageContentProps) {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [selectedPicture, setSelectedPicture] = useState<Picture | null>(null);
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchMusicData = useCallback(async () => {
    setLoading(true);
    try {
      const catalog = await fetchMusicCatalogClient();
      setMusicList(catalog);
      setError(null);
    } catch (fetchError) {
      console.error('Failed to fetch music catalog:', fetchError);
      setError('Failed to load albums.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPictures = useCallback(async (page: number, replace: boolean) => {
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
      const processedData = items.map((item, index) => ({
        id: Number(item.fileId) || index + (page - 1) * PAGE_SIZE,
        src: `${API_CONFIG.ossRootUrl}${item.relativePath}${item.fileName}`,
        title: item.fileName,
      }));

      let nextCount = 0;
      setPictures((prev) => {
        const merged = replace ? processedData : [...prev, ...processedData];
        nextCount = merged.length;
        return merged;
      });
      setError(null);

      const total = Number(data.pager?.total || 0);
      setHasMore(total > 0 ? nextCount < total : processedData.length === PAGE_SIZE);
    } catch (fetchError) {
      console.error('Failed to fetch pictures:', fetchError);
      setError('Failed to load gallery.');
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (isAlbumsMode || albumKey) {
      queueMicrotask(() => {
        if (!cancelled) {
          void fetchMusicData();
        }
      });
    } else {
      queueMicrotask(() => {
        if (!cancelled) {
          void fetchPictures(1, true);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [albumKey, fetchMusicData, fetchPictures, isAlbumsMode]);

  useEffect(() => {
    if (isAlbumsMode || albumKey || !loadMoreRef.current || !hasMore || loading || loadingMore) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setCurrentPage((prev) => prev + 1);
      }
    }, { rootMargin: '800px 0px' });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [albumKey, hasMore, isAlbumsMode, loading, loadingMore, pictures.length]);

  useEffect(() => {
    let cancelled = false;

    if (isAlbumsMode || albumKey || currentPage === 1) {
      return;
    }

    queueMicrotask(() => {
      if (!cancelled) {
        void fetchPictures(currentPage, false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [albumKey, currentPage, fetchPictures, isAlbumsMode]);

  const albums = useMemo(() => groupAlbums(musicList), [musicList]);
  const currentAlbum = useMemo(
    () => albums.find((album) => (album.albumKey || album.album) === albumKey) || null,
    [albumKey, albums]
  );

  if (loading) {
    return (
      <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (albumKey && currentAlbum) {
    return (
      <Box sx={{ padding: 4 }}>
        <Button component={Link} href="/gallery?albums=1" sx={{ mb: 2, px: 0 }}>
          Back to Albums
        </Button>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardMedia component="img" image={currentAlbum.cover} alt={currentAlbum.album} />
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" color="primary" gutterBottom>
              {currentAlbum.name}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Album
            </Typography>
            <Grid container spacing={2} sx={{ maxWidth: 540 }}>
              <Grid item xs={6}>
                <Typography variant="h6">收录曲数</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">收录{currentAlbum.audioList.length}曲</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">发行日期</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">{currentAlbum.issueDate || 'Unknown'}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Typography variant="h4" gutterBottom>
          Content
        </Typography>

        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Album</TableCell>
                <TableCell>Quality</TableCell>
                <TableCell>Issue Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentAlbum.audioList.map((track) => (
                <TableRow key={`${track.fileId}-${track.filetype}`}>
                  <TableCell>{track.fileNo}</TableCell>
                  <TableCell>{track.name}</TableCell>
                  <TableCell>{currentAlbum.album}</TableCell>
                  <TableCell>{track.filetype.toUpperCase()}</TableCell>
                  <TableCell>{track.issueDate || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  if (isAlbumsMode) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ marginBottom: 4 }}>
          Albums
        </Typography>

        <Grid container spacing={3}>
          {albums.map((album) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={album.albumKey || album.album}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea component={Link} href={`/gallery?album=${encodeURIComponent(album.albumKey || album.album)}`}>
                  <CardMedia component="img" height="260" image={album.cover} alt={album.album} sx={{ objectFit: 'cover' }} />
                  <CardContent>
                    <Typography variant="subtitle1" noWrap>
                      {album.album}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {album.audioList.length} tracks
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ marginBottom: 4 }}>
        Gallery
      </Typography>

      <Grid container spacing={2}>
        {pictures.map((picture) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={picture.id}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea onClick={() => setSelectedPicture(picture)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={picture.src}
                  alt={picture.title || `Picture ${picture.id}`}
                  sx={{ objectFit: 'cover' }}
                  loading="lazy"
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(selectedPicture)}
        onClose={() => setSelectedPicture(null)}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundImage: 'none',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            m: 2,
          },
        }}
      >
        {selectedPicture && (
          <Box
            component="img"
            src={selectedPicture.src}
            alt={selectedPicture.title || `Picture ${selectedPicture.id}`}
            sx={{
              display: 'block',
              maxWidth: 'calc(100vw - 32px)',
              maxHeight: 'calc(100vh - 32px)',
              objectFit: 'contain',
            }}
          />
        )}
      </Dialog>

      <Box ref={loadMoreRef} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 72, mt: 4 }}>
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

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      }
    >
      <GalleryPageShell />
    </Suspense>
  );
}

function GalleryPageShell() {
  const searchParams = useSearchParams();
  const isAlbumsMode = searchParams.get('albums') === '1';
  const albumKey = searchParams.get('album');
  const viewKey = `${isAlbumsMode ? 'albums' : 'gallery'}:${albumKey || ''}`;

  return (
    <GalleryPageContent key={viewKey} albumKey={albumKey} isAlbumsMode={isAlbumsMode} />
  );
}

function groupAlbums(arr: Music[]): AlbumGroup[] {
  const keyMap: Record<string, number> = {};
  const ret: AlbumGroup[] = [];

  arr.forEach((item) => {
    const key = item.albumKey || item.album;
    if (!key) {
      return;
    }

    if (keyMap.hasOwnProperty(key)) {
      ret[keyMap[key]].audioList.push(item);
      return;
    }

    keyMap[key] = ret.length;
    ret.push({ ...item, audioList: [item] });
  });

  return ret;
}
