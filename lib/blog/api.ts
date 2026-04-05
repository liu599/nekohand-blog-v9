import { BLOG_API } from '@/lib/api/config';
import { Category, Pager, Post } from '@/types/blog';

const DEFAULT_PAGE_SIZE = 10;
const DETAIL_FALLBACK_PAGE_SIZE = 100;

type BlogPostsResponse = Partial<{
  code: number;
  data: Post[];
  pager: Pager;
  success: boolean;
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

    const requestUrl = isChronologyFilterActive
      ? BLOG_API.postTime
      : isCategoryFilterActive
        ? `${BLOG_API.posts}/${categoryId}`
        : BLOG_API.posts;

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
      cache,
    });

    const data: BlogPostsResponse = await response.json();

    return {
      posts: Array.isArray(data.data) ? data.data : [],
      pager: data.pager || {
        total: 0,
        pageNum: pageNumber,
        pageSize,
      },
    };
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
