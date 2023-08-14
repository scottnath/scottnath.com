

// export interface IProfile {
//   html_url: string;
//   login: string;
//   name?: string;
//   avatar_url: string;
//   following: string;
//   followers: string;
//   location?: string;
//   public_repos: number;
//   public_gists: number;
//   bio?: string;
// }
/**
 * 
 * @param {*} username 
 * @returns 
 */
// export interface IRepository {
//   html_url: string;
//   name: string;
//   description: string;
//   language: string;
//   stargazers_count: number;
//   watchers?: number;
//   forks_count?: number;
//   default_branch?: string;
//   license?: Licence

// }

export const fetchUser = async (username) => {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const userJson = await response.json();
  return userJson;
}

export const fetchUserGraphQL = async (username) => {
  const response = await fetch(`https://api.github.com/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      query {
        user(login: "${username}") {
          name
          login
          avatarUrl
          bio
        }
      }
      `
    })
  });
  const userJson = await response.json();
  return userJson;
}

/**
 * Fetch a GitHub repository's content from the GitHub api
 */
export const fetchRepo = async (full_name) => {
  const response = await fetch(`https://api.github.com/repos/${full_name}`);
  const repoJson = await response.json();
  return repoJson;
}


/**
 * Get a user's profile and repos
 * @param {string} username 
 * @param {[string]} repos 
 * @returns {Promise<{user: object, repos: object[]}>}
 */
export const getGitHubContent = async (username, repos = []) => {
  const user = await fetchUser(username);
  if (user.error) {
    return {
      error: user.error,
    }
  }
  const repositories = [];
  if (repos.length) {
    let i = 0;
    while (i < repos.length) {
      repositories.push(await fetchRepo(repos[i]));
      i++;
    }
  }
  return {
    ghUser: user,
    repos: repositories,
  }
}
