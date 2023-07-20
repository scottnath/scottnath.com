
import './';
import { snUserFixture, meowUserFixture } from './devto.shared-spec';

export default {
  title: 'DevTo',
  component: 'dev-user',
  tags: ['autodocs'],
};

export const Username = {
  args: {
    username: 'scottnath',
  },
};

export const NewUser = {
  args: {
    username: 'soyecoder',
  },
}

export const AltUserData = {
  args: {
    user: {
      ...snUserFixture,
      name: 'Someother Name',
      summary: 'Different summary content than what is from the dev.to api',
      joined_at: 'Jan 1, 1979',
      post_count: 1,
    },
  },
}

export const SkipFetch = {
  args: {
    user: meowUserFixture,
    skipFetch: true,
  },
}

export const SkipFetchJustUsername = {
  args: {
    user: {
      username: 'scottnath'
    },
    skipFetch: true,
  },
}

export const SkipFetchFail = {
  args: {
    skipFetch: true,
  },
}

export const UnknownUsername = {
  args: {
    username: 'NotAUserMeow',
  },
}
