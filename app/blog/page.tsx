import BlogPageClient from '@/components/blog/BlogPageClient';
import { fetchBlogPosts, fetchBlogSidebarData } from '@/lib/blog/api';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const [sidebarData, postsData] = await Promise.all([
    fetchBlogSidebarData(),
    fetchBlogPosts(),
  ]);

  return (
    <BlogPageClient
      initialPosts={postsData.posts}
      initialPager={postsData.pager}
      initialCategories={sidebarData.categories}
      initialChronology={sidebarData.chronology}
    />
  );
}
