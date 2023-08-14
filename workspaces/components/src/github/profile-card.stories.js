
import { scottnath } from './user-data';
import { scottnathdotcom, storydocker } from './repo-data';
import './card';

export default {
  title: 'GitHub Card',
  component: 'github-profile-card',
  tags: ['autodocs'],
};

export const User = {
  args: {
    user: scottnath,
    repos: [scottnathdotcom, storydocker],
  },
}

export const NoRepos = {
  args: {
    user: scottnath,
  },
}

export const NoUser = {};