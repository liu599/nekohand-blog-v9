import BlogDetailPage from '@/components/blog/BlogDetailPage';
import { fetchBlogCategories, fetchBlogPostById } from '@/lib/blog/api';

export const dynamic = 'force-dynamic';

type BlogPostPageProps = {
  searchParams?: Promise<{
    id?: string;
  }>;
};

export default async function BlogPostPage({ searchParams }: BlogPostPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const id = resolvedSearchParams?.id || null;
  const [post, categories] = id
    ? await Promise.all([fetchBlogPostById(id), fetchBlogCategories()])
    : [null, []];
  const categoryName = post?.category
    ? categories.find((category) => category.id === post.category)?.cname ?? post.category
    : null;

  return <BlogDetailPage id={id} post={post} categoryName={categoryName} />;
}
