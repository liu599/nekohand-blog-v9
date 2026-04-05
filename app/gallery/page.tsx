'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
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

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const isAlbumsMode = searchParams.get('albums') === '1';
  const albumKey = searchParams.get('album');

  useEffect(() => {
    setCurrentPage(1);
    setPictures([]);

    if (isAlbumsMode || albumKey) {
      void fetchMusicData();
    } else {
      void fetchPictures(1, true);
    }
  }, [isAlbumsMode, albumKey]);

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
    if (isAlbumsMode || albumKey || currentPage === 1) {
      return;
    }

    void fetchPictures(currentPage, false);
  }, [albumKey, currentPage, isAlbumsMode]);

  async function fetchMusicData() {
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
  }

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
      }));

      setPictures((prev) => (replace ? processedData : [...prev, ...processedData]));
      setError(null);

      const total = Number(data.pager?.total || 0);
      const nextCount = existingCount + processedData.length;
      setHasMore(total > 0 ? nextCount < total : processedData.length === PAGE_SIZE);
    } catch (fetchError) {
      console.error('Failed to fetch pictures:', fetchError);
      setError('Failed to load gallery.');
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

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
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" height="200" image={picture.src} alt={picture.title || `Picture ${picture.id}`} sx={{ objectFit: 'cover' }} loading="lazy" />
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
