import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Antigravity — CRM that thinks with you',
  description: 'AI-native CRM built to surpass Salesforce. Real-time multiplayer, unified inbox, relationship intelligence.',
  keywords: ['CRM', 'AI', 'sales', 'pipeline', 'contacts'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-0 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
