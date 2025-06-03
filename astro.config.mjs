import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/static';
import react from '@astrojs/react';
import robotsTxt from 'astro-robots-txt';
import compress from 'astro-compress';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { securityHeaders } from './src/middleware/security';

export default defineConfig({
  site: 'https://khidir.dev',
  output: 'static',
  adapter: vercel({
    analytics: true,
    headers: [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'"
            ].join('; ')
          },
          ...Object.entries(securityHeaders().headers).map(([key, value]) => ({
            key,
            value: typeof value === 'string' ? value : value.join(', '),
          })),
        ],
      },
    ],
  }),
  integrations: [
    mdx({
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'append' }],
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
      ]
    }),
    tailwind(),
    sitemap(),
    react(),
    robotsTxt(),
    compress()
  ],
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      langs: [
        'bash',
        'javascript',
        'typescript',
        'json',
        'markdown',
        'yaml',
        'python',
        'sql',
        'plaintext'
      ],
      wrap: true
    }
  },
  vite: {
    build: {
      // Bundle optimization
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'chart': ['chart.js'],
          }
        }
      }
    },
    // Cache optimization
    ssr: {
      noExternal: ['@astrojs/*']
    }
  },
  image: {
    // Image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    domains: ['images.unsplash.com']
  }
});
