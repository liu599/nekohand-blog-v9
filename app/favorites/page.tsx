import { Metadata } from 'next';
import FavoritesList from '@/components/favorites/FavoritesList';

export const metadata: Metadata = {
  title: 'Bookmarks & Favorites - Nekohand Blog',
  description: 'A collection of useful resources and bookmarks organized by category',
};

export default function FavoritesPage() {
  return <FavoritesList />;
}
