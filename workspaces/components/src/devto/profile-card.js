import { LitElement, html, css, unsafeCSS } from 'lit';
import {when} from 'lit/directives/when.js';

import styles from './styles.css?inline'

/**
 * Blank base64-encoded png
 * @see https://png-pixel.com/
 */
const blankPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8DtXNJsAAAAASUVORK5CYII=';

/**
 * dev.to logo
 * @see https://dev.to/brand
 */
const devLogoSvg = html`<svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 32 448 448">
<g stroke-width="0">
  <rect x="0" y="32" width="400" height="400" rx="49" fill="#ffffff" strokewidth="0"/>
</g><path fill="#000000" d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z"></path></svg>`;

/**
 * Forem icon for a cake (used with "Joined" date)
 * @see https://github.com/forem/forem/blob/main/app/assets/images/cake.svg?short_path=e3c7d41
 */
const joinedSvg = html`<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M8 6v3.999h3V6h2v3.999h3V6h2v3.999L19 10a3 3 0 012.995 2.824L22 13v1c0 1.014-.377 1.94-.999 2.645L21 21a1 1 0 01-1 1H4a1 1 0 01-1-1v-4.36a4.025 4.025 0 01-.972-2.182l-.022-.253L2 14v-1a3 3 0 012.824-2.995L5 10l1-.001V6h2zm11 6H5a1 1 0 00-.993.883L4 13v.971l.003.147a2 2 0 003.303 1.4c.363-.312.602-.744.674-1.218l.015-.153.005-.176c.036-1.248 1.827-1.293 1.989-.134l.01.134.004.147a2 2 0 003.992.031l.012-.282c.124-1.156 1.862-1.156 1.986 0l.012.282a2 2 0 003.99 0L20 14v-1a1 1 0 00-.883-.993L19 12zM7 1c1.32.871 1.663 2.088 1.449 2.888a1.5 1.5 0 11-2.898-.776C5.85 2.002 7 2.5 7 1zm5 0c1.32.871 1.663 2.088 1.449 2.888a1.5 1.5 0 01-2.898-.776C10.85 2.002 12 2.5 12 1zm5 0c1.32.871 1.663 2.088 1.449 2.888a1.5 1.5 0 01-2.898-.776C15.85 2.002 17 2.5 17 1z"/>
</svg>`;

/**
 * Forem icon for a post
 * @see https://github.com/forem/forem/blob/main/app/assets/images/post.svg?short_path=b79fa43
 */
const postSvg = html`<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M19 22H5a3 3 0 01-3-3V3a1 1 0 011-1h14a1 1 0 011 1v12h4v4a3 3 0 01-3 3zm-1-5v2a1 1 0 002 0v-2h-2zm-2 3V4H4v15a1 1 0 001 1h11zM6 7h8v2H6V7zm0 4h8v2H6v-2zm0 4h5v2H6v-2z"/>
</svg>`;

/**
 * Format a date for machine-readability
 * @param {string} dt 
 * @returns {string} - the machine-readable value of the date
 */
export const formatDate = (dt) => {
  const x = new Date(dt);
  const year = x.getFullYear()
  const month = String(x.getMonth() + 1).padStart(2, '0')
  const day = String(x.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Container for the dev.to logo
 */
export const logoContainer = html`<div part="logo">${devLogoSvg}</div>`;

/**
 * Content about one post by dev.to (or Forem) user, sourced from the Forem API.
 * @see https://developers.forem.com/api/v1#tag/articles/operation/getLatestArticles
 * @typedef {Object} ForemPost
 * @property {string} title - The title of the post
 * @property {string} url - The URL of the post
 * @property {string} cover_image - The URL of the post's full-size cover image
 */

/**
 * Render a link to a post
 * @param {ForemPost} post - Content about a post
 */
const postLink = (post) => html`<a href="${post.url}" part="post">
<img src="${post.cover_image}" part="post-img" alt="Cover image for post ${post.title}" />
${post.title}</a>`;

/**
 * @function Render a post description term group
 * @param {string} term - the term to describe
 * @param {ForemPost} post - Content about a post
 */
const postDescription = (term, post) => post ? html`
<dt>${term}</dt>
<dd>${postLink(post)}</dd>
` : '';

/**
 * Content about a dev.to (or Forem) user, sourced from the Forem API and combined with post data.
 * Only the properties used in this component are defined.
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
 * Render a link to a user's profile
 * @param {ForemUser} user - Content about a user
 */
const profileLink = (user) => html`
<address>
  <a href="https://dev.to/${user?.username}" part="cta branded">View Profile on dev.to</a>
</address>
`;

/**
 * Render a user's avatar
 * @param {ForemUser} user - Content about a user
 */
const avatarImg = (user) => html`<img src="${user?.profile_image}" part="avatar" alt="Avatar for ${user?.name}" loading="lazy" />`;

/**
 * @function Render a user's summary content
 * @param {string} summary - the user's bio
 */
export const userSummary = (summary) => summary ? html`<p class="summary">${summary}</p>` : '';

/**
 * @function Render a user's joined date
 * @param {string} joined_at - date the user joined
 */
export const userJoined = (joined_at) => joined_at ? html`<p>
${joinedSvg} 
<span>Joined on 
  <time datetime="${formatDate(joined_at)}">${joined_at}</time>
</span>
</p>
` : '';

/**
 * @function Render a user's post count
 * @param {number} post_count - number of posts the user has published
 */
export const userPostCount = (post_count) => post_count !== undefined ? html`<p>
  ${postSvg} 
  <span>${post_count} posts published</span>
</p>
` : '';

/**
 * dev.to profile card component
 * @element devto-profile-card
 * @prop {ForemUser} user - Content about a user
 * @prop {ForemPost} [latest_post] - Content about a post
 */
export class DevToProfileCard extends LitElement {
  static properties = {
    user: { type: Object },
    latest_post: { type: Object },
  };
  static styles = css`
  ${unsafeCSS(styles)}
    `;

  constructor() {
    super();
    this.error = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._cleanUserData();
  }

  /**
   * Clean up data to conform to the HTML-expected content model
   */
  _cleanUserData() {
    if (!this.user) {
      this.error = 'No user data provided';
      return;
    }
    if (!this.user?.username) {
      this.error = 'Username (user.username) is required';
      return;
    }
    this.user.profile_image = this.user.profile_image || blankPng;
    this.user.name = this.user.name || `@${this.user.username}`;
    if (this.user.post_count && Number(this.user.post_count) !== NaN) {
      this.user.post_count = Number(this.user.post_count);
    } else {
      delete this.user?.post_count;
    }
    if (this.latest_post) {
      this.latest_post.cover_image = this.latest_post.cover_image || blankPng;
    }
  }

  render() {
    if (this.error) {
      return html`
        <section part="card">
          <header>
            ${logoContainer}
            
            <p role="heading">
              <span part="name">${this.error}</span>
            </p>
          </header>
        </section>
      `;
    }

    return html`
      <section part="card">
        <header>
          ${logoContainer}
          
          <address role="heading">
            <a href="https://dev.to/${this.user?.username}">
              <span part="avatar">
                ${avatarImg(this.user)}
              </span>
              <span part="name">${this.user?.name}</span>
            </a>
          </address>
        </header>
        <div part="main">
          ${userSummary(this.user?.summary)}
          ${userJoined(this.user?.joined_at)}
          ${userPostCount(this.user?.post_count)}
          ${when(this.latest_post, () => html`
            <dl>
              ${postDescription('Latest post', this.latest_post)}
            </dl>
          `)}
        </div>
        <footer>
          ${profileLink(this.user)}
        </footer>
      </section>
    `;
  }
}

customElements.define('devto-profile-card', DevToProfileCard);