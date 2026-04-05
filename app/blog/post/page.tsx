'use client';

import { useSearchParams } from 'next/navigation';
import BlogDetailPage from '@/components/blog/BlogDetailPage';

export default function BlogPostPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return <BlogDetailPage id={id} />;
}
