/**
 * @fileoverview retrieves data from github api
 */

import { fetchRepo, parseFetchedRepo, fetchUser, parseFetchedUser } from 'profile-components/utils/github/github.js';

/**
 * Gets a github user and parses it for use in profile-components/github-user.js
 * @param {string} username - github username
 * @returns {GitHubUser} parsed github user
 */
export const getGitHubUser = async (username = 'scottnath') => {
  const user = await fetchUser(username);
  return parseFetchedUser(user);
}

/**
 * Gets a github repository and parses it for use in profile-components/github-user.js
 * @param {string} full_name - github repository full name as in [owner]/[repo]
 * @returns {GitHubRepository} parsed github repository
 */
export const getGitHubRepo = async (full_name = 'scottnath/profile-components') => {
  const repo = await fetchRepo(full_name);
  return parseFetchedRepo(repo);
}

/**
 * Gets a github repository and parses it for use in profile-components/github-user.js
 * @param {string[]} full_names - set of github repository full names as in [owner]/[repo]
 * @returns {GitHubRepository[]} set of parsed github repositories
 */
export const getGitHubRepos = async (full_names = ['scottnath/profile-components']) => {
  const repos = await Promise.all(full_names.map(full_name => fetchRepo(full_name)));
  return repos.map(repo => parseFetchedRepo(repo));
}
