import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import lit from '@astrojs/lit';
import AstroPWA from '@vite-pwa/astro'
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    logLevel: 'info',
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
    server: {
      fs: {
        // Allow serving files from hoisted root node_modules
        allow: ['../..']
      }
    },
  },
  devToolbar: {
    enabled: false
  },
  markdown: {
    shikiConfig: {
      theme: 'slack-dark'
    }
  },
  redirects: {
    '/about': '/whoami',
  },
	site: 'https://scottnath.com',
	integrations: [lit(), mdx(), sitemap(), react(), 
    AstroPWA({
      mode: 'development',
      base: '/',
      scope: '/',
      includeAssets: ['favicon.svg'],
      registerType: 'autoUpdate',
      manifest: {
        name: 'Scott Nath PWA',
        short_name: 'scottnath-pwa',
        theme_color: '#0a0c10',
      },
      pwaAssets: {
        config: true,
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\//],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      }
    }),
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
});
