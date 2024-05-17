import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import lit from '@astrojs/lit';

// https://astro.build/config
export default defineConfig({
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
	integrations: [lit(), mdx(), react(), 
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  vite: {
    ssr: {
      // Example: Force a broken package to skip SSR processing, if needed
      noExternal: ['jsonresume-component'],
    }
  }
});
