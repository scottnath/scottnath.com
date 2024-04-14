// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.


import devLogo from '~/assets/logos/dev.svg';
import githubLogo from '~/assets/logos/github-inverse.svg';
import linkedinLogo from '~/assets/logos/linkedin.svg';
import mastodonLogo from '~/assets/logos/Mastodon.svg';

export const SITE_TITLE = 'Scott Nath';
export const SITE_SUBTITLE = 'Frontend Architect';
export const ALT_TITLES = ['Solutions Architect', 'Software Architect', 'Full Stack Developer', 'DevOps Architect', 'Design Engineer', 'Senior Software Engineer', 'Design System Architect', 'Developer Advocate'];
export const SCOTT_SHORT_DESC = 'Scott Nath is a senior web developer and actor living in New York State';
export const SITE_DESCRIPTION = `${SCOTT_SHORT_DESC} with extensive experience creating full-stack apps and design systems.`;


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
  title: `Blah blah blahg by Scott Nath`,
  description: `Articles and rambling-on by Scott Nath`,
  pageTitle: '',
  pageDesc: ''
}
BLAHG.pageTitle = `${BLAHG.title}: ${BLAHG.description}`
BLAHG.pageDesc = `Technical blog posts featuring articles about Storybook, user interface testing, frontend web development, shared testing, and web components.`

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