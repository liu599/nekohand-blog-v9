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
  message: string;
  success: boolean;
}>;

type BlogChronologyResponse = Partial<{
  code: number;
  data: Array<{
    month?: string;
    postCount?: string | number;
  }>;
  message: string;
  success: boolean;
}>;

type BlogPostDetailResponse = Partial<{
  code: number;
  data: Post | Post[] | RawBlogPostItem;
  success: boolean;
}>;

type FetchPostsOptions = {
  pageNumber?: number;
  pageSize?: number;
  chronologyFilter?: string | null;
  categoryId?: string | null;
  cache?: RequestCache;
};

export async function fetchBlogCategories(cache: RequestCache = 'no-store') {
  try {
    const response = await fetch(BLOG_API.postByCategory, {
      cache,
      method: 'GET',
      headers: {
        Accept: '*/*',
        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
      },
    });

    const payload: BlogCategoriesResponse = await response.json();
    return payload.code === 20000 && Array.isArray(payload.data) ? payload.data : [];
  } catch (error) {
    console.error('Failed to fetch blog categories:', error);
    return [];
  }
}

export async function fetchBlogSidebarData(cache: RequestCache = 'no-store') {
  try {
    const [categoriesResponse, chronologyResponse] = await Promise.all([
      fetchBlogCategories(cache),
      fetch(BLOG_API.postChronology, {
        cache,
        method: 'GET',
        headers: {
          Accept: '*/*',
          'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        },
      }),
    ]);

    const chronologyData: BlogChronologyResponse = await chronologyResponse.json();

    return {
      categories: categoriesResponse,
      chronology:
        chronologyData.code === 20000 && Array.isArray(chronologyData.data)
          ? chronologyData.data
              .map((item) => mapMonthlyCountToChronologyValue(item.month, item.postCount))
              .filter((item): item is string => Boolean(item))
          : [],
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
    const isChronologyFilterActive = Boolean(chronologyFilter);
    const isCategoryFilterActive = Boolean(categoryId);

    if (isChronologyFilterActive) {
      const response = await fetch(BLOG_API.postTime, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        },
        body: JSON.stringify({
          pageNum: pageNumber,
          pageSize,
          createdDate: mapChronologyFilterToCreatedDate(chronologyFilter),
        }),
        cache,
      });

      const data = await parseApiJsonResponse<BlogPostsResponse>(response);
      return normalizeBlogPostsResponse(data, pageNumber, pageSize);
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
  const numericPid = Number(id);
  const directPost = Number.isFinite(numericPid) && numericPid > 0
    ? await tryFetchBlogPostDirectByPid(numericPid, cache)
    : await tryFetchBlogPostDirect(id, cache);
  if (directPost) {
    return directPost;
  }

  const firstPage = await fetchBlogPosts({
    pageNumber: 1,
    pageSize: DETAIL_FALLBACK_PAGE_SIZE,
    cache,
  });

  const firstMatch = firstPage.posts.find((post) => String(post.pid) === id || post.id === id);
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

    const match = result.posts.find((post) => String(post.pid) === id || post.id === id);
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

async function tryFetchBlogPostDirectByPid(pid: number, cache: RequestCache) {
  try {
    const response = await fetch(`${BLOG_API.post}/${pid}`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
      cache,
    });

    if (!response.ok) {
      return null;
    }

    const parsed = await parseApiJsonResponse<BlogPostDetailResponse | RawBlogPostItem>(response);
    return normalizePostDetailResponse(parsed);
  } catch {
    return null;
  }
}

function normalizePostDetailResponse(value: BlogPostDetailResponse | Post | RawBlogPostItem) {
  if (isPost(value)) {
    return value;
  }

  if (isRawBlogPostItem(value)) {
    return mapRawBlogPostItem(value);
  }

  if (Array.isArray(value.data)) {
    const post = value.data.find((item) => isPost(item) || isRawBlogPostItem(item));
    if (post && isRawBlogPostItem(post)) {
      return mapRawBlogPostItem(post);
    }
    return post && isPost(post) ? post : null;
  }

  if (value.data && isPost(value.data)) {
    return value.data;
  }

  if (value.data && isRawBlogPostItem(value.data)) {
    return mapRawBlogPostItem(value.data);
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

function isRawBlogPostItem(value: unknown): value is RawBlogPostItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as RawBlogPostItem;
  return (
    (typeof candidate.pid === 'number' || typeof candidate.pid === 'string') &&
    typeof candidate.ptitle === 'string'
  );
}

function mapMonthlyCountToChronologyValue(month?: string, postCount?: string | number) {
  if (!month) {
    return null;
  }

  const match = month.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, year, monthNumber] = match;
  const count = Number(postCount ?? 0);
  return `${year}${monthNumber}(${Number.isFinite(count) ? count : 0})`;
}

function mapChronologyFilterToCreatedDate(value: string) {
  const match = value.match(/^(\d{4})(\d{2})/);
  if (!match) {
    return value;
  }

  return `${match[1]}-${match[2]}`;
}
