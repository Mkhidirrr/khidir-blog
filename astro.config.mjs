import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/static';
import react from '@astrojs/react';
import prefetch from '@astrojs/prefetch';
import robotsTxt from 'astro-robots-txt';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://khidir.dev',
  output: 'static',
  adapter: vercel(),
  integrations: [
    mdx({
      rehypePlugins: [
        'rehype-slug',
        ['rehype-autolink-headings', { behavior: 'append' }],
        ['rehype-external-links', { target: '_blank', rel: ['noopener', 'noreferrer'] }]
      ]
    }),
    tailwind(),
    sitemap(),
    react(),
    prefetch(),
    robotsTxt(),
    compress()
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'dracula',
      wrap: true
    }
  },
});
