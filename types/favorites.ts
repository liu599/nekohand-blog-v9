export interface FavoriteLink {
  link: string;
  title: string;
}

export interface FavoriteCategory {
  category: string;
  links: FavoriteLink[];
  tags: string;
}

export interface EventItem {
  name: string;
  time: string;
}

export interface TVItem {
  name: string;
  row: string;
  time: string;
}

export interface InfoData {
  data: EventItem[] | TVItem[];
  id: string;
  name: string;
  update: string;
}

export interface FavoritesResponse {
  code?: number;
  data?: {
    content: FavoriteCategory[];
    description: string;
    info: {
      data: InfoData[];
      meta: {
        app: string;
        description: string;
        version: string;
      };
    };
    version: string;
  };
  content?: FavoriteCategory[];
  description?: string;
  version?: string;
  success?: boolean;
}
