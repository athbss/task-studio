import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geistSans = Geist({
   variable: '--font-geist-sans',
   subsets: ['latin'],
});

const geistMono = Geist_Mono({
   variable: '--font-geist-mono',
   subsets: ['latin'],
});

const siteUrl = 'https://circle.lndev.me';

export const metadata: Metadata = {
   title: {
      template: '%s | Taskmaster Circle',
      default: 'Taskmaster Circle',
   },
   description:
      'A web-based interface for the Taskmaster CLI task management system. View and manage tasks from .taskmaster JSON files with real-time updates.',
   openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: 'Circle',
      images: [
         {
            url: `${siteUrl}/banner.png`,
            width: 2560,
            height: 1440,
            alt: 'lndev/ui',
         },
      ],
   },
   twitter: {
      card: 'summary_large_image',
      site: '@ln_dev7',
      creator: '@ln_dev7',
      images: [
         {
            url: `${siteUrl}/banner.png`,
            width: 2560,
            height: 1440,
            alt: 'Circle',
         },
      ],
   },
   authors: [{ name: 'Leonel NGOYA', url: 'https://lndev.me/' }],
   keywords: ['ui', 'lndev', 'components', 'template'],
};

import { ThemeProvider } from '@/components/layout/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { NuqsProvider } from '@/components/providers/nuqs-provider';

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
         </head>
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}>
            <NuqsProvider>
               <QueryProvider>
                  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                     {children}
                     <Toaster />
                  </ThemeProvider>
               </QueryProvider>
            </NuqsProvider>
         </body>
      </html>
   );
}
