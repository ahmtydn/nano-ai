
import './globals.css'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster, toast } from 'sonner'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'


export const metadata = {
  title: 'Nano AI - Nano Intelligence, Macro Success',
  description: 'AI-powered personalized education platform. We create big differences in the smallest details.',
  author: 'Nano AI Team',
  keywords: 'artificial intelligence, education, personalized learning, AI education, nano AI, macro success',
  creator: 'Nano AI',
  publisher: 'Nano AI',
  robots: 'index, follow',
  googlebot: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
  'google-site-verification': 'your-google-verification-code',
  'yandex-verification': 'your-yandex-verification-code',
  openGraph: {
    title: 'Nano AI - Nano Intelligence, Macro Success',
    description: 'AI-powered personalized education platform. We create big differences in the smallest details.',
    url: 'https://nanoai.com',
    siteName: 'Nano AI',
    locale: 'en_US',
    images: [
      {
        url: 'https://nano-ai-ten.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nano AI - Nano Intelligence, Macro Success',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@nanoai',
    title: 'Nano AI - Nano Intelligence, Macro Success',
    description: 'AI-powered personalized education platform. We create big differences in the smallest details.',
    images: ['https://nano-ai-ten.vercel.app/twitter-image.png'],
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: '192x192' },
    ],
  },
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#3B82F6',
  colorScheme: 'light',
}

// Create a global error handler
if (typeof window !== 'undefined') {
  window.handleError = (error) => {
    toast.error(error.message || 'An error occurred');
  };
}

export default function RootLayout({ children }) {
  
  return (
    <html lang="en" className="no-transition scroll-smooth">
      <body>
        <ThemeProvider>
          <ConvexClientProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster position="top-right" expand={true} richColors />
              <Analytics />
              <SpeedInsights />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}