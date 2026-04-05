export interface Music {
  name: string;
  artist: string;
  url: string;
  cover: string;
  album: string;
  filetype: string;
  lrc?: string | null;
  audioList: Music[];
  issueDate?: string;
}

export interface Album {
  album: string;
  audioList: Music[];
}

export interface Artist {
  artist: string;
  audioList: Music[];
}

export interface MusicState {
  current: {
    ix: number;
    data: Music | null;
  };
  storage: Music[];
  albums: Album[];
  artists: Artist[];
  isPlaying: boolean;
  playlist: Music[];
  // Actions
  setMusicData: (musicData: Music[]) => void;
  playMusic: (music: Music, index: number) => void;
  pauseMusic: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setPlaylist: (playlist: Music[]) => void;
}
