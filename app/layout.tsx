import type { Metadata } from 'next';
import Script from 'next/script';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/styles/theme';
import MainLayout from '@/components/layout/MainLayout';
import GlobalAudioPlayer from '@/components/music/GlobalAudioPlayer';

export const metadata: Metadata = {
  title: 'Nekohand Blog - Music & Life',
  description: 'A modern blog about music, games, and life',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Script src="/site-background.js" strategy="afterInteractive" />
            <MainLayout>
              {children}
              <GlobalAudioPlayer />
            </MainLayout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
