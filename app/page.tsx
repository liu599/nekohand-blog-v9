'use client';

import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { useMusicStore } from '@/lib/stores/musicStore';

export default function HomePage() {
  const { albums, artists } = useMusicStore();

  return (
    <Box>
      <Grid container spacing={2} sx={{ paddingBottom: 4 }}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} sx={{ paddingTop: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea>
                  <CardMedia component="img" height="300" image="/007MwxDlgy1g5vymokkpkj30rw0ietc9.jpg" alt="Princess Connect" />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Current Playing: Princess Connect! Re:Dive
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Anime RPG.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ paddingTop: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea>
                  <CardMedia component="img" height="300" image="/genshin.png" alt="Genshin Impact" />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Current Playing: Genshin Impact
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Open world action RPG.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container sx={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ position: 'relative', marginBottom: 2 }}>
            Albums
            <Box component="span" sx={{ position: 'absolute', right: 0 }}>
              <Link href="/gallery?albums=1">More albums...</Link>
            </Box>
          </Typography>
          <Divider />
          <Box sx={{ paddingTop: 2 }}>
            {albums.length > 0 && (
              <Grid container spacing={2}>
                {albums.slice(0, 4).map((album, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                      <CardActionArea component={Link} href={`/gallery?album=${encodeURIComponent(album.albumKey || album.album)}`}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={album.audioList[0]?.cover || '/placeholder.jpg'}
                          alt={album.album}
                        />
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
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ marginTop: 2 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Artist
          </Typography>
          <Divider />
          <Box sx={{ paddingTop: 2 }}>
            <Grid container spacing={2}>
              {artists.slice(0, 6).map((artist, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" noWrap>
                        {artist.artist}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {artist.audioList.length} songs
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Topic
          </Typography>
          <Divider />
          <Box sx={{ paddingTop: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="body1">
                  Welcome to Nekohand Blog! Here you can find music albums, blog posts, and more.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
