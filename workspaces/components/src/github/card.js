import { LitElement, html, css, unsafeCSS } from 'lit';
import {when} from 'lit/directives/when.js';
import stylesVars from './styles-vars.css?inline';
import styles from './styles.css?inline';

import './repo';

export const githubLogoSvg = html`<svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32">
<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
</svg>`;
export const octiconPeople = html`<svg text="muted" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-people">
<path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"></path>
</svg>`;

/**
 * Render a user's avatar
 * @param {ForemUser} user - Content about a user
 */
const avatarImg = (user) => html`<img src="${user?.avatar_url}" alt="Avatar for ${user?.name}" loading="lazy" />`;

/**
 * GitHub user profile card component
 * @element github-profile-card
 * @prop {object} user - Content about a user
 * @prop {object} [repos] - Content about a set of repos
 */
export class GitHubProfileCard extends LitElement {
  static properties = {
    user: { type: Object },
    repos: { type: Object },
  };
  static styles = css`
  ${unsafeCSS(stylesVars)}
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
  }

  render() {
    if (this.error) {
      return html`
        <section part="card">
          <header>
            <span class="logo">
              ${githubLogoSvg}
            </span>
          </header>
          <div part="main">
            <p role="heading">
              <span part="name">${this.error}</span>
            </p>
          </div>
        </section>
      `;
    }

    return html`
      <section part="card">
        <header>
          <address>
            <a href="https://github.com/${this.user?.login}">
              <span class="logo">
                ${githubLogoSvg}
              </span>
              <span class="login">${this.user?.login}</span>
            </a>
          </address>
        </header>
        <div part="main" itemscope itemtype="http://schema.org/Person">
          <address>
            <a href="https://github.com/${this.user?.login}">
              <span class="avatar" itemprop="image">
                ${avatarImg(this.user)}
              </span>
              <span itemprop="creator">
                <span itemprop="name">${this.user?.name}</span>
                <span itemprop="alternativeName">${this.user?.login}</span>
              </span>
            </a>
          </address>
          ${when(this.user?.bio, () => html`<p itemprop="description">${this.user?.bio}</p>`)}
          <dl>
            <dt>Following</dt>
            <dd itemprop="follows">${this.user?.following}</dd>
            <dt>Followers</dt>
            <dd itemprop="followee">${this.user?.followers}</dd>
            <dd aria-hidden="true">${octiconPeople}</dd>
          </dl>
          ${when(this.repos?.length, () => html`
            <dl>
              <dt>Pinned repositories</dt>
              ${this.repos.map((repo) => html`
                <dd><github-repo-card .repo=${repo} .itemprop=${'maintainer'}></github-repo-card></dd>
              `)}
            </dl>
          `)}
        </div>
      </section>
    `;
  }
}

customElements.define('github-profile-card', GitHubProfileCard);