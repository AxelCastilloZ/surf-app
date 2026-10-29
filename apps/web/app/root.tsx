import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import '../src/index.css'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/assets/icons/favicon-32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#030a07" />
        <link rel="preconnect" href="https://uwvnrmjhjlzdnggljkoo.supabase.co" />
        <link
          rel="preload"
          as="image"
          href="https://uwvnrmjhjlzdnggljkoo.supabase.co/storage/v1/object/public/gallery/site/hero-1600.webp"
          type="image/webp"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var l = document.createElement('link');
              l.rel = 'stylesheet';
              l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap';
              document.head.appendChild(l);
            `,
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          />
        </noscript>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                var s = document.createElement('script');
                s.src = 'https://www.googletagmanager.com/gtag/js?id=G-C3JG0F1W66';
                s.async = true;
                document.head.appendChild(s);
                s.onload = function() {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-C3JG0F1W66');
                };
              });
            `,
          }}
        />
      </body>
    </html>
  )
}

export default function Root() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}
