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

export default defineConfig({
  site: 'https://khidir.dev',
  output: 'static',
  adapter: vercel(),
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
        'plaintext'
      ],
      wrap: true
    }
  }
});
