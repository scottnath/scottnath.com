// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import devLogo from '~/assets/logos/dev.svg';
import githubLogo from '~/assets/logos/github-inverse.svg';
import linkedinLogo from '~/assets/logos/linkedin.svg';
import mastodonLogo from '~/assets/logos/Mastodon.svg';

export const SITE_TITLE = 'Scott Nath';
export const SITE_SUBTITLE = 'Frontend architect';
export const SITE_DESCRIPTION = `${SITE_SUBTITLE}, full-stack software engineer, and developer advocate. Extensive experience creating UI development systems with a focus on where developers and designers collaborate.`;
// image must be in root of public folder
export const PROFILE_PIC = '/scott-nath-profile-photo.avif';

export const STRIPE_COLORS = ['#ffd273', '#ffbf57', '#ffa43b', '#ff8920', '#ff6e05'];

export const RESUME_DEFUALTS = {
  name: SITE_TITLE,
  title: SITE_SUBTITLE,
  summary: '',
  places: {
    title: 'Also find me here:',
    urls: ["https://scottnath.com", "https://github.com/scottnath", "https://www.linkedin.com/in/scottnath"]
  },
};

export const BLAHG = {
  title: `Blah blah blahg by Scott Nath, ${SITE_SUBTITLE}`,
  description: `Articles and rambling-on by Scott Nath, ${SITE_DESCRIPTION}`,
}

export const SOCIALS = [
  {
    title: 'GitHub',
    url: 'https://github.com/scottnath',
    logo: githubLogo,
    label: 'Scott Nath on GitHub'
  },
  {
    title: 'dev.to',
    url: 'https://dev.to/scottnath',
    logo: devLogo,
    label: 'Scott Nath\'s articles on dev.to'
  },
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/scottnath',
    logo: linkedinLogo,
    label: 'Connect with Scott Nath on LinkedIn'
  },
  {
    title: 'Mastodon',
    url: 'https://mastodon.social/@scottnath',
    logo: mastodonLogo,
    label: 'Read Scott Nath blah on Mastodon'
  }
]