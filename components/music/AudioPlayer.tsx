'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useMusicStore } from '@/lib/stores/musicStore';
import { Music } from '@/types/music';

interface AudioPlayerProps {
  playlist?: Music[];
}

export default function AudioPlayer({ playlist }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const {
    current,
    isPlaying,
    playMusic,
    togglePlay,
    nextTrack,
    prevTrack,
    setPlaylist,
  } = useMusicStore();

  useEffect(() => {
    if (playlist && playlist.length > 0) {
      setPlaylist(playlist);
    }
  }, [playlist]);

  useEffect(() => {
    if (audioRef.current && current.data) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, current]);

  const handlePlayPause = () => {
    if (!current.data && playlist && playlist.length > 0) {
      playMusic(playlist[0], 0);
    } else {
      togglePlay();
    }
  };

  const handleNext = () => {
    nextTrack();
  };

  const handlePrev = () => {
    prevTrack();
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
    <Card
      sx={{
        position: 'fixed',
        bottom: 12,
        left: { xs: 8, md: 16 },
        right: minimized ? 'auto' : { xs: 8, md: 16 },
        width: minimized ? 220 : 'auto',
        zIndex: 1000,
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.22)',
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0.12))',
        backdropFilter: 'blur(18px) saturate(140%)',
        boxShadow:
          '0 18px 45px rgba(31, 38, 135, 0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.24,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '8px 8px, 8px 8px',
          mixBlendMode: 'soft-light',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: '-20% 30% auto -10%',
          height: 90,
          borderRadius: 999,
          background: 'radial-gradient(circle, rgba(255,255,255,0.28), transparent 70%)',
          filter: 'blur(18px)',
          pointerEvents: 'none',
        },
      }}
    >
      <audio
        ref={audioRef}
        src={current.data?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        {minimized ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handlePlayPause}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            </IconButton>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {current.data?.name || 'Music Player'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {current.data?.artist || 'Ready'}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setMinimized(false)}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)' }}
            >
              <ExpandLessIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
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
                <Box>
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

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => setMinimized(true)}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)' }}
                >
                  <ExpandMoreIcon />
                </IconButton>
                <IconButton
                  onClick={handlePrev}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)' }}
                >
                  <SkipPreviousIcon />
                </IconButton>
                <IconButton
                  onClick={handlePlayPause}
                  size="large"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)' }}
                >
                  <SkipNextIcon />
                </IconButton>
              </Box>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption">{formatTime(currentTime)}</Typography>
                <Slider
                  value={currentTime}
                  max={duration}
                  onChange={handleSeek}
                  aria-label="time-slider"
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Typography variant="caption">{formatTime(duration)}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={handleMuteToggle}
                sx={{ backgroundColor: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)' }}
              >
                {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
              <Slider
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                min={0}
                max={1}
                step={0.01}
                aria-label="volume-slider"
                size="small"
                sx={{ width: 100 }}
              />
            </Box>
          </Grid>
        </Grid>
        )}
      </CardContent>
    </Card>
  );
}
