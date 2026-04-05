'use client';

import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { BLOG_API } from '@/lib/api/config';

interface FriendLink {
  link: string;
  title: string;
}

interface FriendGroup {
  title: string;
  data: FriendLink[];
}

interface FriendsApiResponse {
  code: number;
  data?: {
    data?: FriendGroup[];
    description?: string;
    version?: string;
  };
  success?: boolean;
}

function normalizeFriendsResponse(payload: FriendsApiResponse): FriendGroup[] {
  if (!payload.success || payload.code !== 0) {
    return [];
  }

  return (payload.data?.data ?? []).filter((group) => Array.isArray(group.data));
}

export default function FriendsPage() {
  const [friendGroups, setFriendGroups] = useState<FriendGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
  }, []);

  async function fetchFriends() {
    try {
      const response = await fetch(BLOG_API.friends, { method: 'GET' });
      const data: FriendsApiResponse = await response.json();
      setFriendGroups(normalizeFriendsResponse(data));
    } catch (error) {
      console.error('Failed to fetch friends:', error);
      setFriendGroups([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ marginBottom: 4 }}>
        Friends
      </Typography>

      {friendGroups.map((group) => (
        <Box key={group.title} sx={{ marginBottom: 5 }}>
          <Typography variant="h5" gutterBottom sx={{ marginBottom: 2 }}>
            {group.title}
          </Typography>
          <Grid container spacing={3}>
            {group.data.map((friend) => (
              <Grid item xs={12} sm={6} md={4} key={`${group.title}-${friend.link}`}>
                <Card>
                  <CardActionArea
                    component="a"
                    href={friend.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}>
                          {friend.title.charAt(0)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="h6">{friend.title}</Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {friend.link}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {friendGroups.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          No friends links available.
        </Typography>
      )}
    </Box>
  );
}
