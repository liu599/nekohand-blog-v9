'use client';

import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Category, Pager, Post } from '@/types/blog';
import BlogPostsPane from '@/components/blog/BlogPostsPane';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { fetchBlogPosts } from '@/lib/blog/api';

type ChronologyGroup = {
  year: string;
  months: Array<{ value: string; month: string; count: number }>;
  total: number;
};

type BlogPageClientProps = {
  initialPosts: Post[];
  initialPager: Pager;
  initialCategories: Category[];
  initialChronology: string[];
};

export default function BlogPageClient({
  initialPosts,
  initialPager,
  initialCategories,
  initialChronology,
}: BlogPageClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [categories] = useState<Category[]>(initialCategories);
  const [chronology] = useState<string[]>(initialChronology);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeChronology, setActiveChronology] = useState<string | null>(null);
  const [expandedYears, setExpandedYears] = useState<string[]>(
    getChronologyGroups(initialChronology).slice(0, 1).map((group) => group.year)
  );
  const [pager, setPager] = useState<Pager>(initialPager);
  const [postsLoading, setPostsLoading] = useState(false);

  async function loadPosts(
    pageNumber: number,
    chronologyFilter: string | null = activeChronology,
    categoryId: string | null = activeCategoryId
  ) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPostsLoading(true);

    const result = await fetchBlogPosts({
      pageNumber,
      chronologyFilter,
      categoryId,
      cache: 'no-store',
    });

    setPosts(result.posts);
    setPager(result.pager);
    setPostsLoading(false);
  }

  function handlePageChange(_: React.ChangeEvent<unknown>, page: number) {
    void loadPosts(page);
  }

  function handleChronologyClick(value: string) {
    const nextValue = activeChronology === value ? null : value;
    setActiveChronology(nextValue);

    const match = value.match(/^(\d{4})/);
    if (match) {
      setExpandedYears((current) => (current.includes(match[1]) ? current : [...current, match[1]]));
    }

    void loadPosts(1, nextValue, activeCategoryId);
  }

  function clearChronologyFilter() {
    setActiveChronology(null);
    void loadPosts(1, null, activeCategoryId);
  }

  function handleCategoryClick(categoryId: string) {
    const nextValue = activeCategoryId === categoryId ? null : categoryId;
    setActiveCategoryId(nextValue);
    setActiveChronology(null);
    void loadPosts(1, null, nextValue);
  }

  function clearCategoryFilter() {
    setActiveCategoryId(null);
    void loadPosts(1, activeChronology, null);
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

function getChronologyGroups(values: string[]) {
  const groups = new Map<string, ChronologyGroup['months']>();

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
