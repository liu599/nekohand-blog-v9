'use client';

import { useEffect } from 'react';
import AudioPlayer from '@/components/music/AudioPlayer';
import { fetchMusicCatalogClient } from '@/lib/music/catalog';
import { useMusicStore } from '@/lib/stores/musicStore';

export default function GlobalAudioPlayer() {
  const { storage, setMusicData } = useMusicStore();

  useEffect(() => {
    if (storage.length > 0) {
      return;
    }

    let active = true;

    const loadCatalog = async () => {
      try {
        const catalog = await fetchMusicCatalogClient();
        if (!active) {
          return;
        }
        setMusicData(catalog);
      } catch (error) {
        console.error('Failed to fetch global music catalog:', error);
      }
    };

    void loadCatalog();

    return () => {
      active = false;
    };
  }, [setMusicData, storage.length]);

  if (storage.length === 0) {
    return null;
  }

  return <AudioPlayer playlist={storage} />;
}
