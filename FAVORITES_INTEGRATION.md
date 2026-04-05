# Favorites/Bookmarks Integration Guide

## Overview
The favorites API provides categorized bookmarks organized by technology/topic areas. This feature displays useful resources, articles, and links for developers.

## API Endpoint
- **URL**: `https://api.ecs32.top/service/favorites`
- **Method**: GET
- **Response Format**: JSON

## Type Definitions

### Location: `types/favorites.ts`

```typescript
export interface FavoriteLink {
  link: string;
  title: string;
}

export interface FavoriteCategory {
  category: string;
  links: FavoriteLink[];
  tags: string;
}

export interface EventItem {
  name: string;
  time: string;
}

export interface TVItem {
  name: string;
  row: string;
  time: string;
}

export interface InfoData {
  data: EventItem[] | TVItem[];
  id: string;
  name: string;
  update: string;
}

export interface FavoritesResponse {
  code: number;
  data: {
    content: FavoriteCategory[];
    description: string;
    info: {
      data: InfoData[];
      meta: {
        app: string;
        description: string;
        version: string;
      };
    };
    version: string;
  };
  success: boolean;
}
```

## Response Structure

### Main Content
The `data.content` array contains categorized bookmarks:

```json
{
  "category": "Golang",
  "links": [
    {
      "link": "https://pandaychen.github.io/tags/#Kratos",
      "title": "go kratos源码分析"
    },
    {
      "link": "https://github.com/didi/gendry/blob/master/builder/README.md",
      "title": "Didi Sql Builder"
    }
  ],
  "tags": "Golang"
}
```

### Categories Include
- **Golang**: Go language resources and libraries
- **FEND**: Frontend development (JavaScript, frameworks)
- **ElasticSearch**: Search engine implementation
- **Devops**: DevOps tools and practices
- **nginx**: Nginx configuration and optimization
- **Note**: General development notes

### Additional Info Data
The `data.info.data` contains supplementary information:
- **Events**: Aimi event appearances with timestamps
- **TV**: Television appearances and radio shows

## Usage Example

### Component: `components/favorites/FavoritesList.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Link,
  Grid,
} from '@mui/material';
import { FavoritesResponse, FavoriteCategory } from '@/types/favorites';
import { BLOG_API } from '@/lib/api/config';

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteCategory[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      const response = await fetch(BLOG_API.favorites);
      const data: FavoritesResponse = await response.json();

      if (data.success && data.code === 0) {
        setFavorites(data.data.content);
      }
    }

    fetchFavorites();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Bookmarks & Favorites
      </Typography>

      <Grid container spacing={3}>
        {favorites.map((category, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5">{category.category}</Typography>

                <Box sx={{ mb: 2 }}>
                  {category.tags.split(', ').map((tag, i) => (
                    <Chip key={i} label={tag} size="small" />
                  ))}
                </Box>

                {category.links.map((link, i) => (
                  <Link key={i} href={link.link} target="_blank">
                    • {link.title}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
```

### Page: `app/favorites/page.tsx`

```tsx
import { Metadata } from 'next';
import FavoritesList from '@/components/favorites/FavoritesList';

export const metadata: Metadata = {
  title: 'Bookmarks & Favorites - Nekohand Blog',
  description: 'A collection of useful resources and bookmarks organized by category',
};

export default function FavoritesPage() {
  return <FavoritesList />;
}
```

## Styling Recommendations

### Material UI Components
- Use `Card` for each category container
- Use `Chip` for tag display
- Use `Link` with `target="_blank"` for external links
- Use `Grid` for responsive layout (2 columns on desktop, 1 on mobile)

### Color Scheme
- Tags: Use `color="primary"` with `variant="outlined"`
- Links: Default text color, hover to primary color
- Cards: White background with subtle shadow

## Error Handling

```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchFavorites() {
    try {
      const response = await fetch(BLOG_API.favorites);
      const data: FavoritesResponse = await response.json();

      if (data.success && data.code === 0) {
        setFavorites(data.data.content);
      } else {
        setError('Failed to load favorites');
      }
    } catch (err) {
      setError('Error fetching favorites');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  fetchFavorites();
}, []);
```

## Loading States

```tsx
if (loading) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  );
}

if (error) {
  return (
    <Container>
      <Alert severity="error">{error}</Alert>
    </Container>
  );
}
```

## Navigation Integration

Add favorites link to the navigation:

```tsx
// In Header.tsx
import Link from 'next/link';
import BookmarkIcon from '@mui/icons-material/Bookmark';

<Link href="/favorites" passHref>
  <Button color="inherit" startIcon={<BookmarkIcon />}>
    Favorites
  </Button>
</Link>
```

## Best Practices

1. **Client-side Fetching**: Favorites are fetched client-side since they're user-facing resources
2. **External Links**: All links should open in new tabs (`target="_blank"`)
3. **Tag Display**: Split tags by comma and display as individual chips
4. **Responsive Grid**: Use Material UI Grid for responsive layout
5. **Type Safety**: Always use TypeScript types for API responses
6. **Error Handling**: Provide user-friendly error messages
7. **Loading States**: Show loading indicator during data fetch

## Future Enhancements

- [ ] Add search/filter functionality
- [ ] Implement category filtering
- [ ] Add favorite link ratings
- [ ] Enable sorting by category name or tag
- [ ] Add pagination for large lists
- [ ] Implement local storage for user favorites
- [ ] Add export/import functionality

## Testing Checklist

- [ ] Favorites page renders correctly
- [ ] All categories display properly
- [ ] Tags are shown as chips
- [ ] Links open in new tabs
- [ ] Loading state displays during fetch
- [ ] Error state displays on failure
- [ ] Responsive layout works on mobile/desktop
- [ ] TypeScript types match API response
- [ ] Navigation includes favorites link

## Related Files

- `types/favorites.ts`: Type definitions
- `lib/api/config.ts`: API endpoint configuration
- `components/favorites/FavoritesList.tsx`: Main component
- `app/favorites/page.tsx`: Page route
- `CLAUDE.md`: Project documentation (includes favorites patterns)
