'use client';

import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import AudioPlayer from '@/components/music/AudioPlayer';
import { useMusicStore } from '@/lib/stores/musicStore';
import { Music } from '@/types/music';
import { API_CONFIG } from '@/lib/api/config';

export default function HomePage() {
  const { albums, artists, setMusicData } = useMusicStore();
  const [musicList, setMusicList] = useState<Music[]>([]);

  useEffect(() => {
    // Fetch music data on mount
    fetchMusicData();
  }, []);

  async function fetchMusicData() {
    try {
      const response = await fetch('https://mltd.ecs32.top/filelist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'fileType=mp3',
      });
      const data = await response.json();
      // Process and store music data
      const processedData = processMusicData(data.data || []);
      setMusicData(processedData);
      setMusicList(processedData);
    } catch (error) {
      console.error('Failed to fetch music data:', error);
    }
  }

  function processMusicData(rawData: any[]) {
    const musicRootUrl = API_CONFIG.oldFileRootUrl;
    const artistMap: Record<string, string> = {
      'A_PPP': "Poppin'Party",
      'G_Cover': 'BanG Dream! Girls Band Party Cover Songs',
      'F_Roselia': 'Roselia',
      'H_RAS': 'RAISE A SUILEN',
      'I_Spec': 'Collaboration',
      'B_Char': 'BanG Dream! Character Song',
      'E_PP': 'Pastel*Palettes',
      'InoriMinase': '水濑祈',
    };

    return rawData.map((item: any) => {
      const nm = decodeURIComponent(item.fileName).split(`.${item.filetype}`)[0].trim();
      const relativePath = decodeURIComponent(item.relativePath);
      const rp = relativePath.split('/');

      return {
        name: nm + (item.filetype !== 'flac' ? '' : ' [HQ]'),
        artist: artistMap[rp[rp.length - 3]] || rp[rp.length - 3],
        url: `${musicRootUrl}${decodeURIComponent(item.src)}`,
        cover: `${musicRootUrl}${relativePath}cover.jpg`,
        album: rp[rp.length - 2],
        filetype: item.filetype,
        lrc: null,
        audioList: [],
      };
    });
  }

  return (
    <Box>
      {/* Game Info Cards */}
      <Grid container spacing={2} sx={{ paddingBottom: 4 }}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} sx={{ paddingTop: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="300"
                    image="/007MwxDlgy1g5vymokkpkj30rw0ietc9.jpg"
                    alt="Princess Connect"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Current Playing: プリンセスコネクト！Re:Dive
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Anime RPG: それは、どこまでも非現実的な、美しく尊い夢―美しき大地アストライア大陸。その中心にあるのは、
                      いくつもの種族―獣人(ビースト)、エルフ、魔族、人間(ヒューマン)が助け合って暮らす街、王都『ランドソル』。
                    </Typography>
                    <Typography variant="button">
                      <a href="https://priconne-redive.jp/" target="_blank" rel="noopener noreferrer">
                        Read more...
                      </a>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sx={{ paddingTop: 4 }}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="300"
                    image="/genshin.png"
                    alt="Genshin Impact"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Current Playing: 原神
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      オープンワールド RPG: 主人公である双子の兄妹（空と蛍）は、多くの世界を渡り歩いていた。
                      幻想世界テイワットに訪れた際、謎の神《天理の調停者》との戦いに敗北した主人公は...
                    </Typography>
                    <Typography variant="button">
                      <a href="https://genshin.hoyoverse.com/ja/home" target="_blank" rel="noopener noreferrer">
                        Read more...
                      </a>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Albums Section */}
      <Grid container sx={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ position: 'relative', marginBottom: 2 }}>
            Albums
            <Box component="span" sx={{ position: 'absolute', right: 0 }}>
              <a href="/gallery?albums=1">More albums...</a>
            </Box>
          </Typography>
          <Divider />
          <Box sx={{ paddingTop: 2 }}>
            {albums.length > 0 && (
              <Grid container spacing={2}>
                {albums.slice(0, 4).map((album, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
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
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Artist & Topic Section */}
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

      {/* Audio Player */}
      {musicList.length > 0 && <AudioPlayer playlist={musicList} />}
    </Box>
  );
}
