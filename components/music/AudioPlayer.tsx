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

  const {
    current,
    isPlaying,
    playMusic,
    pauseMusic,
    togglePlay,
    nextTrack,
    prevTrack,
    setPlaylist,
  } = useMusicStore();

  useEffect(() => {
    if (playlist && playlist.length > 0) {
      setPlaylist(playlist);
      if (!current.data) {
        playMusic(playlist[0], 0);
      }
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
    <Card sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
      <audio
        ref={audioRef}
        src={current.data?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            {current.data && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img
                  src={current.data.cover}
                  alt={current.data.name}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
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
                <IconButton onClick={handlePrev}>
                  <SkipPreviousIcon />
                </IconButton>
                <IconButton onClick={handlePlayPause} size="large">
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton onClick={handleNext}>
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
              <IconButton onClick={handleMuteToggle}>
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
      </CardContent>
    </Card>
  );
}
