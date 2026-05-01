import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import lit from '@semantic-ui/astro-lit';

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
	integrations: [lit(), mdx(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['jsonresume-component'],
    }
  }
});
