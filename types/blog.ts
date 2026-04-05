export interface Post {
  pid: number;
  id: string;
  title: string;
  slug: string;
  category?: string;
  template?: number;
  status?: string;
  author?: string;
  body: string;
  password?: string;
  createdAt: number;
  modifiedAt?: number;
  plink?: string;
  comment?: number;
  cid?: string;
}

export interface Pager {
  total: number;
  pageNum: number;
  pageSize: number;
}

export interface BlogListResponse {
  code: number;
  data: Post[];
  pager: Pager;
  success: boolean;
}

export interface Category {
  cid: number;
  id: string;
  cname: string;
  clink: string;
  cinfo?: string;
}
