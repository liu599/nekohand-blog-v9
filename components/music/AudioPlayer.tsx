'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import Container from '@mui/material/Container';
import { useMusicStore } from '@/lib/stores/musicStore';
import { Music } from '@/types/music';

interface AudioPlayerProps {
  playlist?: Music[];
}

export default function AudioPlayer({ playlist }: AudioPlayerProps) {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [muted, setMuted] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    current,
    isPlaying,
    playMusic,
    setCurrentMusic,
    togglePlay,
    nextTrack,
    prevTrack,
    setPlaylist,
  } = useMusicStore();

  useEffect(() => {
    if (playlist && playlist.length > 0) {
      setPlaylist(playlist);
      if (!current.data) {
        setCurrentMusic(playlist[0], 0);
      }
    }
  }, [playlist]);

  useEffect(() => {
    if (audioRef.current && current.data) {
      if (isPlaying) {
        setLoading(true);
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
        setLoading(false);
      }
    }
  }, [isPlaying, current]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [muted, volume]);

  useEffect(() => {
    if (pathname !== '/' && current.data) {
      setMinimized(true);
    }
  }, [pathname, current.data]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setLoading(Boolean(current.data && isPlaying));
  }, [current.data?.url]);

  const handlePlayPause = () => {
    if (!current.data && playlist && playlist.length > 0) {
      playMusic(playlist[0], 0);
    } else {
      togglePlay();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleCanPlay = () => {
    setLoading(false);
  };

  const handleWaiting = () => {
    if (isPlaying) {
      setLoading(true);
    }
  };

  const handlePlaying = () => {
    setLoading(false);
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    const time = newValue as number;
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const vol = newValue as number;
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 12, left: 0, right: 0, zIndex: 1000, pointerEvents: 'none' }}>
      <Container maxWidth="lg" sx={{ pointerEvents: 'auto', px: { xs: 1, md: 2 } }}>
        <Card
          sx={{
            width: minimized ? 260 : '100%',
            ml: minimized ? 0 : 'auto',
            mr: minimized ? 'auto' : 'auto',
            overflow: 'hidden',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.22)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0.12))',
            backdropFilter: 'blur(18px) saturate(140%)',
            boxShadow: '0 18px 45px rgba(31, 38, 135, 0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.24,
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '8px 8px, 8px 8px',
              mixBlendMode: 'soft-light',
            },
          }}
        >
          <audio
            ref={audioRef}
            src={current.data?.url}
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onWaiting={handleWaiting}
            onPlaying={handlePlaying}
            onEnded={nextTrack}
          />

          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            {minimized ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={handlePlayPause} size="small" sx={iconSx}>
                  {loading ? <CircularProgress size={16} thickness={5} /> : isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                </IconButton>
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography variant="subtitle2" noWrap>
                    {current.data?.name || 'Music Player'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {current.data?.artist || 'Ready'}
                  </Typography>
                </Box>
                <IconButton onClick={() => setMinimized(false)} size="small" sx={iconSx}>
                  <UnfoldMoreIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Stack spacing={2}>
                <Grid container spacing={{ xs: 2, md: 1.5 }} alignItems="center" justifyContent="center">
                  <Grid item xs={12} md={3}>
                    {current.data && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img
                          src={current.data.cover}
                          alt={current.data.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.24)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                          }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle1" noWrap>
                            {current.data.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {current.data.artist}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={4.5}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={() => setMinimized(true)} sx={iconSx}>
                          <UnfoldLessIcon />
                        </IconButton>
                        <IconButton onClick={prevTrack} sx={iconSx}>
                          <SkipPreviousIcon />
                        </IconButton>
                        <IconButton onClick={handlePlayPause} size="large" sx={iconPrimarySx}>
                          {loading ? <CircularProgress size={24} thickness={5} /> : isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton onClick={nextTrack} sx={iconSx}>
                          <SkipNextIcon />
                        </IconButton>
                        <IconButton onClick={() => setShowPlaylist((value) => !value)} sx={iconSx}>
                          <QueueMusicIcon />
                        </IconButton>
                      </Box>
                      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption">{formatTime(currentTime)}</Typography>
                        <Slider value={currentTime} max={duration} onChange={handleSeek} size="small" sx={{ flexGrow: 1 }} />
                        <Typography variant="caption">{formatTime(duration)}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={2.5}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: { xs: 'flex-start', md: 'center' },
                        minWidth: 0,
                      }}
                    >
                      <IconButton onClick={handleMuteToggle} sx={iconSx}>
                        {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                      </IconButton>
                      <Box
                        sx={{
                          width: { xs: '100%', md: 120 },
                          maxWidth: 120,
                          minWidth: 0,
                          px: 1,
                          boxSizing: 'border-box',
                          flexShrink: 1,
                        }}
                      >
                        <Slider
                          value={muted ? 0 : volume}
                          onChange={handleVolumeChange}
                          min={0}
                          max={1}
                          step={0.01}
                          size="small"
                          sx={{ width: '100%' }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

              </Stack>
            )}
          </CardContent>
        </Card>

        {showPlaylist && !minimized && playlist && playlist.length > 0 && (
          <Box
            sx={{
              mb: 1.5,
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.22)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0.12))',
              backdropFilter: 'blur(18px) saturate(140%)',
              boxShadow: '0 18px 45px rgba(31, 38, 135, 0.18)',
              p: 2,
              maxHeight: 260,
              overflowY: 'auto',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Playlist
            </Typography>
            <Stack spacing={0.5}>
              {playlist.map((track, index) => {
                const active =
                  current.data?.fileId === track.fileId && current.data?.filetype === track.filetype;
                return (
                  <Box
                    key={`${track.fileId}-${track.filetype}-${index}`}
                    onClick={() => playMusic(track, index)}
                    sx={{
                      px: 1.25,
                      py: 0.85,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 2,
                      backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.12)',
                      },
                    }}
                  >
                    <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>
                      {track.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                      {track.filetype.toUpperCase()}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}

const iconSx = {
  backgroundColor: 'rgba(255,255,255,0.14)',
  backdropFilter: 'blur(8px)',
};

const iconPrimarySx = {
  backgroundColor: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(8px)',
};
