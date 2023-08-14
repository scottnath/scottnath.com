import { LitElement, html, css, unsafeCSS } from 'lit';
import {when} from 'lit/directives/when.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import stylesVars from './styles-vars.css?inline';
import styles from './styles-repo.css?inline';


export const githubLogoSvg = html`<svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32">
<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
</svg>`;

export const repoIcon = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>`;
export const forksIcon = html`<svg aria-label="forks" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16"  fill="currentColor">
<path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
</svg>`;
export const starIcon = html`<svg aria-label="stars" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16"  fill="currentColor">
<path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
</svg>`;
export const watchIcon = html`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"></path></svg>`;

/**
 * 
 * @param {string} language 
 * @returns hex code color from colors.json
 * @todo parse actual colors.json
 * @todo moar simple svg circle pls
 */
export const getCircle = (language) => {
  let fill = '#f1e05a';
  switch (language) {
    case "TypeScript":
      fill = '#3178c6'
    case "Shell":
      fill = '#89e051'
    case "JavaScript":
      fill = '#f1e05a'
    case "HTML":
      fill = '#e34c26'
    case "CSS":
      fill = '#563d7c'
    case "Java":
      fill = '#b07219'
    default:
      fill = '#f1e05a'
  }

  return html`<svg width="16" height="16" viewBox="0 0 16 16" fill="${fill}"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm11.333-2.167a.825.825 0 0 0-1.166-1.166l-5.5 5.5a.825.825 0 0 0 1.166 1.166Z"></path></svg>`
}

/**
 * GitHub repo card component
 * @element github-repo-card
 * @prop {tbd} repo - Content about a user
 * @prop {string} itemprop - Itemprop content to go on itemscope
 */
export class GitHubRepoCard extends LitElement {
  static properties = {
    repo: { type: Object },
    itemprop: { type: String }
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
    if (!this.repo) {
      this.error = 'No repo data provided';
      return;
    }
  }

  render() {
    if (this.error) {
      return html``;
    }

    return html`
      <section class="repo" itemscope itemtype="http://schema.org/SoftwareSourceCode" itemprop=${ifDefined(this.itemprop)}>
        <a href="https://github.com/${this.repo?.full_name}" itemprop="codeRepository">
          ${repoIcon}
          ${when(this.repo?.organization?.login, () => html`
            <span itemprop="maintainer">${this.repo?.organization?.login} /</span>
          `)}
          <span itemprop="name">${this.repo?.name}</span>
        </a>
        ${when(this.repo?.description, () => html`
          <p itemprop="about">${this.repo?.description}</p>
        `)}
        <dl>
          <dt>${getCircle(this.repo?.language)} <span>Language</span></dt>
          <dd itemprop="programmingLanguage">${this.repo?.language}</dd>
          <dt>${starIcon} <span>Stars</span></dt>
          <dd>${this.repo?.stargazers_count}</dd>
          <dt>${watchIcon} <span>Watchers</span></dt>
          <dd>${this.repo?.watchers_count}</dd>
          <dt>${forksIcon} <span>Forks</span></dt>
          <dd>${this.repo?.forks}</dd>
        </dl>
      </section>
    `;
  }
}

customElements.define('github-repo-card', GitHubRepoCard);