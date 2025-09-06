import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Build Streaks - Track Your Daily Progress',
  description: 'A Base Mini App for tracking your daily build streaks',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Build Streaks - Track Your Daily Progress',
    description: 'Track your daily build progress and maintain your streak on Base',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Build Streaks - Track Your Daily Progress',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
