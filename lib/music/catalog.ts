import { API_CONFIG } from '@/lib/api/config';
import { Music } from '@/types/music';

const CACHE_KEY = 'nekohand-music-catalog-v2';

type RawMusicItem = {
  FileNo: number;
  fileName: string;
  fileId: string;
  relativePath: string;
  src: string;
  filetype: string;
};

const artistMap: Record<string, string> = {
  A_PPP: "Poppin'Party",
  G_Cover: 'BanG Dream! Girls Band Party Cover Songs',
  F_Roselia: 'Roselia',
  H_RAS: 'RAISE A SUILEN',
  I_Spec: 'Collaboration',
  B_Char: 'BanG Dream! Character Song',
  E_PP: 'Pastel*Palettes',
  InoriMinase: 'Inori Minase',
};

export async function fetchMusicCatalogClient() {
  const cached = readCatalogCache();
  if (cached.length > 0) {
    return cached;
  }

  const [mp3Items, flacItems] = await Promise.all([fetchFileList('mp3'), fetchFileList('flac')]);
  const merged = dedupeMusic([...mp3Items, ...flacItems]);
  writeCatalogCache(merged);
  return merged;
}

function readCatalogCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Music[]) : [];
  } catch {
    return [];
  }
}

function writeCatalogCache(data: Music[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore cache failures
  }
}

async function fetchFileList(fileType: 'mp3' | 'flac') {
  const response = await fetch('https://mltd.ecs32.top/filelist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `fileType=${fileType}`,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${fileType} list`);
  }

  const data = await response.json();
  const items = Array.isArray(data?.data) ? (data.data as RawMusicItem[]) : [];
  return items.map(mapMusicItem);
}

function mapMusicItem(item: RawMusicItem): Music {
  const musicRootUrl = API_CONFIG.oldFileRootUrl;
  const relativePath = decodeURIComponent(item.relativePath);
  const pathSegments = relativePath.split('/').filter(Boolean);
  const artistKey = pathSegments[pathSegments.length - 2] || '';
  const album = pathSegments[pathSegments.length - 1] || 'Unknown Album';
  const issueDateMatch = album.match(/\[(\d{4})\.(\d{2})\.(\d{2})\]/);

  return {
    name: decodeURIComponent(item.fileName).replace(/\.(mp3|flac)$/i, '').trim() + (item.filetype === 'flac' ? ' [HQ]' : ''),
    artist: artistMap[artistKey] || artistKey,
    url: joinLegacyMusicUrl(musicRootUrl, decodeURIComponent(item.src)),
    cover: joinLegacyMusicUrl(musicRootUrl, `${relativePath}cover.jpg`),
    album,
    albumKey: relativePath,
    filetype: item.filetype,
    fileNo: item.FileNo,
    fileId: item.fileId,
    relativePath,
    lrc: null,
    audioList: [],
    issueDate: issueDateMatch ? `${issueDateMatch[1]}.${issueDateMatch[2]}.${issueDateMatch[3]}` : undefined,
  };
}

function dedupeMusic(items: Music[]) {
  const map = new Map<string, Music>();

  items.forEach((item) => {
    const key = `${item.fileId}-${item.filetype}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  return Array.from(map.values()).sort((a, b) => (a.fileNo || 0) - (b.fileNo || 0));
}

function joinLegacyMusicUrl(root: string, path: string) {
  const normalizedRoot = root.replace(/\/+$/, '');
  const normalizedPath = `/${path.replace(/^\/+/, '')}`;
  return `${normalizedRoot}${normalizedPath}`.replace(/\/music\/music(?=\/)/, '/music');
}
