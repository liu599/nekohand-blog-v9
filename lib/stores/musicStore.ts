import { create } from 'zustand';
import { Music, MusicState } from '@/types/music';

export const useMusicStore = create<MusicState>((set, get) => ({
  current: {
    ix: 0,
    data: null,
  },
  storage: [],
  albums: [],
  artists: [],
  isPlaying: false,
  playlist: [],

  // Actions
  setMusicData: (musicData: Music[]) => {
    const albums = keyNameFilter('album', musicData);
    const artists = keyNameFilter('artist', musicData);
    set({
      storage: musicData,
      albums,
      artists,
    });
  },

  playMusic: (music: Music, index: number) => {
    set({
      current: {
        ix: index,
        data: music,
      },
      isPlaying: true,
    });
  },

  pauseMusic: () => {
    set({ isPlaying: false });
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  nextTrack: () => {
    const { current, playlist } = get();
    if (playlist.length === 0) return;
    const nextIndex = (current.ix + 1) % playlist.length;
    set({
      current: {
        ix: nextIndex,
        data: playlist[nextIndex],
      },
    });
  },

  prevTrack: () => {
    const { current, playlist } = get();
    if (playlist.length === 0) return;
    const prevIndex = current.ix === 0 ? playlist.length - 1 : current.ix - 1;
    set({
      current: {
        ix: prevIndex,
        data: playlist[prevIndex],
      },
    });
  },

  setPlaylist: (playlist: Music[]) => {
    set({ playlist });
  },
}));

function keyNameFilter(keyName: string, arr: Music[]) {
  const keyMap: Record<string, number> = {};
  const ret: any[] = [];

  for (let i = 0; i < arr.length; i++) {
    const key = arr[i][keyName as keyof Music] as string;
    if (key && keyMap.hasOwnProperty(key)) {
      const existingIndex = keyMap[key];
      ret[existingIndex].audioList.push(arr[i]);
      continue;
    }
    if (key) {
      keyMap[key] = i;
      ret.push({ ...arr[i], audioList: [arr[i]] });
    }
  }

  return ret;
}
