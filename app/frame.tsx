import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build Streaks - Track Your Daily Progress',
  description: 'A Farcaster mini-app for tracking your daily build streaks on Base',
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
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': '/api/og',
    'fc:frame:button:1': 'Start Streak',
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:2': 'Log Today',
    'fc:frame:button:2:action': 'post',
    'fc:frame:post_url': '/api/frame',
  },
};
