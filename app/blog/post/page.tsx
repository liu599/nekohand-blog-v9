import BlogDetailPage from '@/components/blog/BlogDetailPage';
import { fetchBlogPostById } from '@/lib/blog/api';

export const dynamic = 'force-dynamic';

type BlogPostPageProps = {
  searchParams?: Promise<{
    id?: string;
  }>;
};

export default async function BlogPostPage({ searchParams }: BlogPostPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const id = resolvedSearchParams?.id || null;
  const post = id ? await fetchBlogPostById(id) : null;

  return <BlogDetailPage id={id} post={post} />;
}
