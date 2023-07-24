
/**
 * Content about one post by dev.to (or Forem) user, sourced from the Forem API.
 * @see https://developers.forem.com/api/v1#tag/articles/operation/getLatestArticles
 * @typedef {Object} ForemPost
 * @property {string} title - The title of the post
 * @property {string} url - The URL of the post
 * @property {string} cover_image - The URL of the post's full-size cover image
 */

/**
 * Content about a dev.to (or Forem) user, sourced from the Forem API and combined with post data.
 * Only required properties from the api are defined.
 * @see https://developers.forem.com/api/v0#tag/users/operation/getUser
 * @typedef {Object} ForemUser
 * 
 * @property {string} username - The username of the user
 * @property {string} name - The name of the user
 * @property {string} summary - The user's bio
 * @property {string} joined_at - The date the user joined
 * @property {string} profile_image - The URL of the user's profile image
 * @property {number} post_count - The number of posts the user has published
 */

/**
 * @function Fetch a user's posts from the Forem API
 * @param {string} username 
 * @returns {ForemPost[]} - An array of posts
 */
export const fetchUserPosts = async (username) => {
  const articles = await fetch(`https://dev.to/api/articles/latest?per_page=1000&username=${username?.toLowerCase()}`);
  const articlesJson = await articles.json();
  return articlesJson;
}

/**
 * @function Fetch a user's data from the Forem API
 * @property {string} username - The username of the user
 * @property {string} id - the id of the user
 */
export const fetchUser = async (username, id) => {
  let response;
  if (!username && id) {
    response = await fetch(`https://dev.to/api/users/${id}`);
  } else {
    response = await fetch(`https://dev.to/api/users/by_username?url=${username?.toLowerCase()}`);
  }
  const userJson = await response.json();
  return userJson;
}

/**
 * Get a user's profile and posts
 * @param {string} username 
 * @param {string} id 
 * @returns {Promise<{user: ForemUser, posts: ForemPost[]}>}
 */
export const getUserContent = async (username, id) => {
  const user = await fetchUser(username, id);
  if (user.error) {
    return {
      error: user.error,
    }
  }
  if (!user.username) {
    return {
      error: 'no username found',
    }
  }
  const posts = await fetchUserPosts(user.username);
  user.post_count = posts.length;
  return {
    user,
    posts,
  }
}
