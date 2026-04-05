'use client';

import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Category, Pager, Post } from '@/types/blog';
import { BLOG_API } from '@/lib/api/config';
import BlogPostsPane from '@/components/blog/BlogPostsPane';
import BlogSidebar from '@/components/blog/BlogSidebar';

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

const DEFAULT_PAGE_SIZE = 10;

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [chronology, setChronology] = useState<string[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeChronology, setActiveChronology] = useState<string | null>(null);
  const [expandedYears, setExpandedYears] = useState<string[]>([]);
  const [pager, setPager] = useState<Pager>({
    total: 0,
    pageNum: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    void fetchSidebarData();
    void fetchPosts(1);
  }, []);

  async function fetchSidebarData() {
    try {
      const [categoriesResponse, chronologyResponse] = await Promise.all([
        fetch(BLOG_API.postByCategory),
        fetch(BLOG_API.postChronology),
      ]);

      const categoriesData: BlogCategoriesResponse = await categoriesResponse.json();
      const chronologyData: BlogChronologyResponse = await chronologyResponse.json();

      const nextCategories = Array.isArray(categoriesData.data) ? categoriesData.data : [];
      const nextChronology = Array.isArray(chronologyData.data) ? chronologyData.data : [];

      setCategories(nextCategories);
      setChronology(nextChronology);
      setExpandedYears(getChronologyGroups(nextChronology).slice(0, 1).map((group) => group.year));
    } catch (error) {
      console.error('Failed to fetch blog sidebar data:', error);
      setCategories([]);
      setChronology([]);
      setExpandedYears([]);
    }
  }

  async function fetchPosts(
    pageNumber: number,
    chronologyFilter: string | null = activeChronology,
    categoryId: string | null = activeCategoryId
  ) {
    setPostsLoading(true);

    try {
      const formData = new FormData();
      formData.append('pageNumber', String(pageNumber));
      formData.append('pageSize', String(DEFAULT_PAGE_SIZE));

      const isChronologyFilterActive = Boolean(chronologyFilter);
      const isCategoryFilterActive = Boolean(categoryId);

      if (chronologyFilter) {
        formData.append('t', String(getChronologyTimestamp(chronologyFilter)));
      }

      const requestUrl = isChronologyFilterActive
        ? BLOG_API.postTime
        : isCategoryFilterActive
          ? `${BLOG_API.posts}/${categoryId}`
          : BLOG_API.posts;

      const response = await fetch(requestUrl, {
        method: 'POST',
        body: formData,
      });
      const data: BlogPostsResponse = await response.json();

      setPosts(Array.isArray(data.data) ? data.data : []);
      setPager(
        data.pager || {
          total: 0,
          pageNum: pageNumber,
          pageSize: DEFAULT_PAGE_SIZE,
        }
      );
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }

  function handlePageChange(_: React.ChangeEvent<unknown>, page: number) {
    void fetchPosts(page);
  }

  function handleChronologyClick(value: string) {
    const nextValue = activeChronology === value ? null : value;
    setActiveChronology(nextValue);

    const match = value.match(/^(\d{4})/);
    if (match) {
      setExpandedYears((current) =>
        current.includes(match[1]) ? current : [...current, match[1]]
      );
    }

    void fetchPosts(1, nextValue);
  }

  function clearChronologyFilter() {
    setActiveChronology(null);
    void fetchPosts(1, null, activeCategoryId);
  }

  function handleCategoryClick(categoryId: string) {
    const nextValue = activeCategoryId === categoryId ? null : categoryId;
    setActiveCategoryId(nextValue);
    setActiveChronology(null);
    void fetchPosts(1, null, nextValue);
  }

  function clearCategoryFilter() {
    setActiveCategoryId(null);
    void fetchPosts(1, activeChronology, null);
  }

  function toggleYear(year: string) {
    setExpandedYears((current) =>
      current.includes(year) ? current.filter((item) => item !== year) : [...current, year]
    );
  }

  const totalPages = Math.max(1, Math.ceil(pager.total / Math.max(1, pager.pageSize)));
  const chronologyGroups = getChronologyGroups(chronology);
  const activeCategory = categories.find((category) => category.id === activeCategoryId) || null;

  return (
    <Box>
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} lg={8.5}>
          <BlogPostsPane
            posts={posts}
            loading={postsLoading}
            totalPages={totalPages}
            currentPage={pager.pageNum}
            onPageChange={handlePageChange}
          />
        </Grid>

        <Grid item xs={12} lg={3.5}>
          <BlogSidebar
            categories={categories}
            chronologyGroups={chronologyGroups}
            activeCategory={activeCategory}
            activeCategoryId={activeCategoryId}
            activeChronology={activeChronology}
            expandedYears={expandedYears}
            chronologyCount={chronology.length}
            onCategoryClick={handleCategoryClick}
            onCategoryClear={clearCategoryFilter}
            onChronologyClick={handleChronologyClick}
            onChronologyClear={clearChronologyFilter}
            onYearToggle={toggleYear}
          />
        </Grid>
      </Grid>
    </Box>
  );
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

function getChronologyGroups(values: string[]) {
  const groups = new Map<string, Array<{ value: string; month: string; count: number }>>();

  values.forEach((value) => {
    const match = value.match(/^(\d{4})(\d{2})\((\d+)\)$/);
    if (!match) {
      return;
    }

    const [, year, month, count] = match;
    const months = groups.get(year) || [];
    months.push({ value, month, count: Number(count) });
    groups.set(year, months);
  });

  return Array.from(groups.entries())
    .map(([year, months]) => ({
      year,
      months: months.sort((a, b) => Number(b.month) - Number(a.month)),
      total: months.reduce((sum, item) => sum + item.count, 0),
    }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}
