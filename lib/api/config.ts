export const API_CONFIG = {
  rootUrl: 'https://kasumi.ecs32.top',
  fileRootUrl: 'https://file.ecs32.top/data',
  ossRootUrl: 'https://oss-aimi.ecs32.top',
  oldFileRootUrl: 'https://file.ecs32.top/data/music',
  playerlist: ['https://mltd.ecs32.top/filelist', 'FORM', 'POST'],
  audio: ['https://mltd.ecs32.top/ecs-music', 'FORM', 'POST'],
  audioInfo: ['https://mltd.ecs32.top/ecs-music', 'FORM', 'POST'],
  searchInfo: ['https://api.mlwei.com/music/api/wy/?key=523077333&type=lrc&cache=1', 'FORM', 'GET', 'w'],
  createInfo: ['https://mltd.ecs32.top/ecs-music-create', 'FORM', 'POST'],
  artist: {
    'A_PPP': "Poppin'Party",
    'G_Cover': 'BanG Dream! Girls Band Party Cover Songs',
    'F_Roselia': 'Roselia',
    'H_RAS': 'RAISE A SUILEN',
    'I_Spec': 'Collaboration',
    'B_Char': 'BanG Dream! Character Song',
    'E_PP': 'Pastel*Palettes',
    'InoriMinase': '水濑祈',
  },
};

export const BLOG_API = {
  posts: 'https://kasumi.ecs32.top/api/nekohand/v2/frontend/posts',
  post: 'https://kasumi.ecs32.top/api/nekohand/v2/frontend/post',
  postByCategory: 'https://kasumi.ecs32.top/api/nekohand/v2/frontend/categories',
  postTime: 'https://kasumi.ecs32.top/api/nekohand/v2/frontend/po/t',
  postChronology: 'https://kasumi.ecs32.top/api/nekohand/v2/frontend/posts-chronology',
  aimiPic: 'https://mltd.ecs32.top/tag.filelist',
  aimiPicTags: 'https://mltd.ecs32.top/tags.get',
  friends: 'https://api.ecs32.top/service/friends',
  favorites: 'https://api.ecs32.top/service/favorites',
};
