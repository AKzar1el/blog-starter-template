import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Professional Blog | Insights & Articles",
    template: "%s | Professional Blog",
  },
  description: "A professional blog featuring insights, articles, and thoughts on technology, development, and innovation.",
  keywords: ["blog", "articles", "technology", "development", "insights"],
  authors: [{ name: "Professional Blog" }],
  creator: "Professional Blog",
  publisher: "Professional Blog",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Professional Blog",
    title: "Professional Blog | Insights & Articles",
    description: "A professional blog featuring insights, articles, and thoughts on technology, development, and innovation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Blog | Insights & Articles",
    description: "A professional blog featuring insights, articles, and thoughts on technology, development, and innovation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Critical inline CSS for immediate rendering - prevents FOUC and improves LCP */}
        <style dangerouslySetInnerHTML={{ __html: `
          *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
          html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,sans-serif}
          body{margin:0;line-height:inherit;background:#fff;color:#111827;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
          .dark body{background:#111827;color:#f3f4f6}
          h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}
          a{color:inherit;text-decoration:inherit}
          .flex{display:flex}
          .flex-col{flex-direction:column}
          .min-h-screen{min-height:100vh}
          .flex-grow{flex-grow:1}
          .font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,sans-serif}
          .bg-white{background-color:#fff}
          .dark .dark\\:bg-gray-900{background-color:#111827}
          .text-gray-900{color:#111827}
          .dark .dark\\:text-gray-100{color:#f3f4f6}
          .transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
        ` }} />
      </head>
      <body className="font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
