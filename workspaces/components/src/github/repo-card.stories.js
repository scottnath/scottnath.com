import { scottnathdotcom, storydocker } from './repo-data';

import './repo';

export default {
  title: 'GitHub Repo Card',
  component: 'github-repo-card',
  tags: ['autodocs'],
};

export const Repo = {
  args: {
    repo: scottnathdotcom,
  },
}

export const WithOrg = {
  args: {
    repo: storydocker,
  },
}

export const NoRepo = {};