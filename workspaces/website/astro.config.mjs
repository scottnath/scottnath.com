import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import lit from '@astrojs/lit';

import sitemap from '@astrojs/sitemap';

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
	site: 'https://scottnath.com',
	integrations: [lit(), mdx(), sitemap(), react(), 
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
});
