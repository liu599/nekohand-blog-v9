import BlogDetailPage from '@/components/blog/BlogDetailPage';
import { fetchBlogPostById } from '@/lib/blog/api';

type BlogPostPageProps = {
  searchParams?: {
    id?: string;
  };
};

export default async function BlogPostPage({ searchParams }: BlogPostPageProps) {
  const id = searchParams?.id || null;
  const post = id ? await fetchBlogPostById(id) : null;

  return <BlogDetailPage id={id} post={post} />;
}
