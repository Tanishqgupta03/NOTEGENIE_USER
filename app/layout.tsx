import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from './context/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Meet Notes - Video to Notes Converter',
  description: 'Convert your meeting videos into actionable notes and tasks using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <AuthProvider>
          <body className={inter.className}>
            {children}
            <Toaster />
          </body>
        </AuthProvider>
      </html>
  );
}