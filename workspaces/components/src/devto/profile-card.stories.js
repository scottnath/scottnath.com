
import './profile-card';
import { snUserFixture, snPostFixture } from './devto.shared-spec';

export default {
  title: 'Profile Card',
  component: 'devto-profile-card',
  tags: ['autodocs'],
};

export const User = {
  args: {
    user: snUserFixture,
  },
}

export const UserWithLatestPost = {
  args: {
    user: snUserFixture,
    latest_post: snPostFixture,
  },
}

export const NoUser = {};
export const NoUsername = {
  args: {
    user: {
      ...snUserFixture,
      username: undefined,
    },
  },
};