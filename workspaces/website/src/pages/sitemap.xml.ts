import { getCollection } from 'astro:content';
import { SitemapStream, streamToPromise } from 'sitemap';

const posts = (await getCollection('blahg')).sort(
	(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);

/**
 * @todo automate these using git lastmodified
 * @see https://github.com/eligundry/eligundry.com/blob/00b6898c39c910fa252a92dc6cf869440d531857/src/lib/lastModified.ts
 */
const sitepages = [
  {
    url: 'https://scottnath.com',
    updatedDate: new Date(),
  },
  {
    url: 'https://scottnath.com/whoami',
    updatedDate: new Date('2024-05-20'),
  },
  {
    url: 'https://scottnath.com/resume',
    updatedDate: new Date('2024-06-07'),
  },
  {
    url: 'https://scottnath.com/blahg',
    updatedDate: new Date('2024-06-07'),
  }
];

export async function GET() {
  // Create a stream to write to
  const stream = new SitemapStream({
    hostname: 'https://scottnath.com'
  });

  await Promise.all(
    sitepages.map(async ({url, updatedDate}) => {
      const lastmod = new Date(updatedDate).toISOString();
      stream.write({
        url,
        lastmod,
        changefreq: 'daily',
        priority: 0.7,
      })
    })
  )

  await Promise.all(
    posts.map(async (post) => {
      const url = `/${post.collection}/${post.slug}/`
      const lastmodDate = post.data.updatedDate || post.data.pubDate;
      const lastmod = new Date(lastmodDate).toISOString();
      stream.write({
        url,
        lastmod,
        changefreq: 'daily',
        priority: 0.7,
      })
    })
  )

  stream.end()

  const sitemap = await streamToPromise(stream)
  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}