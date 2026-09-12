import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://deadstock-gdg.vercel.app'),
  title: 'Deadstock Live Lab — Material-Grounded Fashion Co-Design',
  description:
    'An AI fashion studio that designs only from the materials physically available in front of it. Powered by Google Gemini multimodal intelligence and Vonage Video real-time collaboration.',
  keywords: [
    'Deadstock',
    'Circular Fashion',
    'Upcycling',
    'AI Fashion',
    'Gemini Multimodal',
    'Vonage Video',
    'Material Constraints',
  ],
  openGraph: {
    title: 'Deadstock Live Lab — Material-Grounded Fashion Co-Design',
    description:
      'An AI fashion studio that designs only from the materials physically available in front of it.',
    url: 'https://deadstock-gdg.vercel.app',
    siteName: 'Deadstock Live Lab',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-ink text-bone min-h-screen antialiased selection:bg-lime selection:text-ink">
        {children}
      </body>
    </html>
  );
}
