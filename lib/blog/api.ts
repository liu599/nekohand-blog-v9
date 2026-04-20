import { BLOG_API } from '@/lib/api/config';
import { parseApiJsonResponse } from '@/lib/api/response';
import { Category, Pager, Post } from '@/types/blog';

const DEFAULT_PAGE_SIZE = 10;
const DETAIL_FALLBACK_PAGE_SIZE = 100;

type BlogPostsResponse = Partial<{
  code: number;
  data: Post[] | {
    list?: RawBlogPostItem[];
    total?: string | number;
    current?: string | number;
    pageSize?: string | number;
    pages?: string | number;
  };
  pager: Pager;
  success: boolean;
}>;

type RawBlogPostItem = Partial<{
  pid: number;
  poid: string;
  ptitle: string;
  slug: string;
  category: string;
  template: number;
  status: string;
  author: string;
  body: string;
  password: string;
  createdAt: string | number;
  modifiedAt: string | number;
  plink: string;
  comment: number;
  cid: string;
}>;

type BlogCategoriesResponse = Partial<{
  code: number;
  data: Category[];
  success: boolean;
}>;

type BlogChronologyResponse = Partial<{
  code: number;
  data: string[];
  success: boolean;
}>;

type BlogPostDetailResponse = Partial<{
  code: number;
  data: Post | Post[];
  success: boolean;
}>;

type FetchPostsOptions = {
  pageNumber?: number;
  pageSize?: number;
  chronologyFilter?: string | null;
  categoryId?: string | null;
  cache?: RequestCache;
};

export async function fetchBlogSidebarData(cache: RequestCache = 'no-store') {
  try {
    const [categoriesResponse, chronologyResponse] = await Promise.all([
      fetch(BLOG_API.postByCategory, { cache }),
      fetch(BLOG_API.postChronology, { cache }),
    ]);

    const categoriesData: BlogCategoriesResponse = await categoriesResponse.json();
    const chronologyData: BlogChronologyResponse = await chronologyResponse.json();

    return {
      categories: Array.isArray(categoriesData.data) ? categoriesData.data : [],
      chronology: Array.isArray(chronologyData.data) ? chronologyData.data : [],
    };
  } catch (error) {
    console.error('Failed to fetch blog sidebar data:', error);
    return {
      categories: [],
      chronology: [],
    };
  }
}

export async function fetchBlogPosts(options: FetchPostsOptions = {}) {
  const {
    pageNumber = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    chronologyFilter = null,
    categoryId = null,
    cache = 'no-store',
  } = options;

  try {
    const body = new URLSearchParams();
    body.set('pageNumber', String(pageNumber));
    body.set('pageSize', String(pageSize));

    const isChronologyFilterActive = Boolean(chronologyFilter);
    const isCategoryFilterActive = Boolean(categoryId);

    if (chronologyFilter) {
      body.set('t', String(getChronologyTimestamp(chronologyFilter)));
    }

    if (isChronologyFilterActive) {
      const response = await fetch(BLOG_API.postTime, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
        cache,
      });

      const data = await parseApiJsonResponse<BlogPostsResponse>(response);
      return normalizeLegacyPostsResponse(data, pageNumber, pageSize);
    }

    const response = await fetch(BLOG_API.posts, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify({
        pageNum: pageNumber,
        pageSize,
        status: null,
        categoryId: isCategoryFilterActive ? categoryId : null,
        tagId: null,
        keyword: null,
      }),
      cache,
    });

    const data = await parseApiJsonResponse<BlogPostsResponse>(response);
    return normalizeBlogPostsResponse(data, pageNumber, pageSize);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return {
      posts: [],
      pager: {
        total: 0,
        pageNum: pageNumber,
        pageSize,
      },
    };
  }
}

function normalizeLegacyPostsResponse(
  payload: BlogPostsResponse,
  pageNumber: number,
  pageSize: number
) {
  return {
    posts: Array.isArray(payload.data) ? payload.data : [],
    pager: payload.pager || {
      total: 0,
      pageNum: pageNumber,
      pageSize,
    },
  };
}

function normalizeBlogPostsResponse(
  payload: BlogPostsResponse,
  pageNumber: number,
  pageSize: number
) {
  if (Array.isArray(payload.data)) {
    return normalizeLegacyPostsResponse(payload, pageNumber, pageSize);
  }

  const list = Array.isArray(payload.data?.list) ? payload.data.list.map(mapRawBlogPostItem) : [];

  return {
    posts: list,
    pager: {
      total: Number(payload.data?.total ?? list.length ?? 0),
      pageNum: Number(payload.data?.current ?? pageNumber),
      pageSize: Number(payload.data?.pageSize ?? pageSize),
    },
  };
}

function mapRawBlogPostItem(item: RawBlogPostItem): Post {
  return {
    pid: Number(item.pid || 0),
    id: item.poid || '',
    title: item.ptitle || '',
    slug: item.slug || '',
    category: item.category,
    template: item.template,
    status: item.status,
    author: item.author,
    body: item.body || '',
    password: item.password,
    createdAt: Number(item.createdAt || 0),
    modifiedAt: item.modifiedAt ? Number(item.modifiedAt) : undefined,
    plink: item.plink,
    comment: item.comment,
    cid: item.cid,
  };
}

export async function fetchBlogPostById(id: string, cache: RequestCache = 'no-store') {
  const directPost = await tryFetchBlogPostDirect(id, cache);
  if (directPost) {
    return directPost;
  }

  const firstPage = await fetchBlogPosts({
    pageNumber: 1,
    pageSize: DETAIL_FALLBACK_PAGE_SIZE,
    cache,
  });

  const firstMatch = firstPage.posts.find((post) => post.id === id);
  if (firstMatch) {
    return firstMatch;
  }

  const totalPages = Math.max(1, Math.ceil(firstPage.pager.total / DETAIL_FALLBACK_PAGE_SIZE));

  for (let page = 2; page <= totalPages; page += 1) {
    const result = await fetchBlogPosts({
      pageNumber: page,
      pageSize: DETAIL_FALLBACK_PAGE_SIZE,
      cache,
    });

    const match = result.posts.find((post) => post.id === id);
    if (match) {
      return match;
    }
  }

  return null;
}

async function tryFetchBlogPostDirect(id: string, cache: RequestCache) {
  const strategies: Array<() => Promise<Response>> = [
    () =>
      fetch(BLOG_API.post, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ id }).toString(),
        cache,
      }),
    () => fetch(`${BLOG_API.post}?id=${encodeURIComponent(id)}`, { cache }),
  ];

  for (const request of strategies) {
    try {
      const response = await request();
      if (!response.ok) {
        continue;
      }

      const rawText = await response.text();
      if (!rawText) {
        continue;
      }

      const parsed = JSON.parse(rawText) as BlogPostDetailResponse | Post;
      const normalized = normalizePostDetailResponse(parsed);
      if (normalized) {
        return normalized;
      }
    } catch {
      // Ignore invalid strategy and try the next one.
    }
  }

  return null;
}

function normalizePostDetailResponse(value: BlogPostDetailResponse | Post) {
  if (isPost(value)) {
    return value;
  }

  if (Array.isArray(value.data)) {
    return value.data.find(isPost) || null;
  }

  if (value.data && isPost(value.data)) {
    return value.data;
  }

  return null;
}

function isPost(value: unknown): value is Post {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Post>;
  return typeof candidate.id === 'string' && typeof candidate.title === 'string';
}

function getChronologyTimestamp(value: string) {
  const match = value.match(/^(\d{4})(\d{2})/);
  if (!match) {
    return 0;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  return Math.floor(Date.UTC(year, monthIndex, 1, -8, 0, 0) / 1000);
}
