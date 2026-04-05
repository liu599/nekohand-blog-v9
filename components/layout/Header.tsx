'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
  { title: 'Status', url: '/' },
  { title: 'Blog', url: '/blog' },
  { title: 'Favorites', url: '/favorites' },
  { title: 'Gallery', url: '/gallery' },
  { title: 'About', url: '/about' },
  { title: 'Friends', url: '/friends' },
];

type IndicatorStyle = {
  opacity: number;
  width: number;
  x: number;
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState<IndicatorStyle>({
    opacity: 0,
    width: 48,
    x: 0,
  });
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const activeUrl = useMemo(() => {
    const normalizedPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;

    const activeSection = sections.find((section) => {
      const normalizedUrl =
        section.url.endsWith('/') && section.url !== '/' ? section.url.slice(0, -1) : section.url;

      if (normalizedUrl === '/') {
        return normalizedPath === '/';
      }

      return normalizedPath === normalizedUrl || normalizedPath.startsWith(`${normalizedUrl}/`);
    });

    return activeSection?.url ?? '/';
  }, [pathname]);

  useLayoutEffect(() => {
    function updateIndicator() {
      const activeButton = itemRefs.current[activeUrl];
      const nav = navRef.current;

      if (!activeButton || !nav) {
        setIndicator((current) => ({ ...current, opacity: 0 }));
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const width = Math.min(56, Math.max(36, buttonRect.width - 32));
      const x = buttonRect.left - navRect.left + (buttonRect.width - width) / 2;

      setIndicator({
        opacity: 1,
        width,
        x,
      });
    }

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeUrl]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
      <List>
        {sections.map((section) => (
          <ListItem key={section.title} disablePadding>
            <ListItemButton component={Link} href={section.url}>
              <ListItemText primary={section.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        color="primary"
        elevation={0}
        sx={{
          backgroundColor: '#3f51b5',
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: '#fff',
                fontWeight: 700,
                maxWidth: { xs: 84, sm: 'none' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Nekohand
            </Typography>

            <Box
              ref={navRef}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                position: 'relative',
                alignSelf: 'stretch',
              }}
            >
              {sections.map((section) => {
                const active = activeUrl === section.url;

                return (
                  <Box
                    key={section.title}
                    ref={(node: HTMLDivElement | null) => {
                      itemRefs.current[section.url] = node;
                    }}
                    sx={{ display: 'flex', height: '100%' }}
                  >
                    <Button
                      component={Link}
                      href={section.url}
                      sx={{
                        color: '#fff',
                        opacity: active ? 1 : 0.72,
                        borderRadius: 0,
                        px: 2,
                        py: 1.5,
                        minWidth: 88,
                        height: '100%',
                        position: 'relative',
                        transition: 'opacity 0.28s ease',
                        '&:hover': {
                          opacity: 1,
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      {section.title}
                    </Button>
                  </Box>
                );
              })}

              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: 4,
                  borderRadius: 999,
                  backgroundColor: '#fff',
                  opacity: indicator.opacity,
                  width: `${indicator.width}px`,
                  transform: `translateX(${indicator.x}px)`,
                  transition:
                    'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), width 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease',
                  pointerEvents: 'none',
                }}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            backgroundColor: '#3f51b5',
            color: '#fff',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
