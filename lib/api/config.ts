export const API_CONFIG = {
  rootUrl: 'https://kasumi.ecs32.top',
  fileRootUrl: 'https://file.ecs32.top/data',
  ossRootUrl: 'https://oss-aimi.ecs32.top',
  oldFileRootUrl: 'https://file.ecs32.top/data/music',
  playerlist: ['https://mltd.ecs32.top/filelist', 'FORM', 'POST'],
  audio: ['https://mltd.ecs32.top/ecs-music', 'FORM', 'POST'],
  audioInfo: ['https://mltd.ecs32.top/ecs-music', 'FORM', 'POST'],
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
  posts: 'https://ws.ecs32.top/hyancie/api/v1/blog/posts/list',
  post: 'https://ws.ecs32.top/hyancie/api/v1/blog/posts',
  postByCategory: 'https://ws.ecs32.top/hyancie/api/v1/blog/categories',
  postTime: 'https://ws.ecs32.top/hyancie/api/v1/blog/posts/list',
  postChronology: 'https://ws.ecs32.top/hyancie/api/v1/blog/posts/monthly-count',
  aimiPic: 'https://mltd.ecs32.top/tag.filelist',
  aimiPicTags: 'https://mltd.ecs32.top/tags.get',
  friends: 'https://ws.ecs32.top/hyancie/api/v1/resource/files/friends.json',
  favorites: 'https://ws.ecs32.top/hyancie/api/v1/resource/files/favorites.json',
};
