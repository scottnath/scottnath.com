import { LitElement, html } from 'lit';

const blankPng =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8DtXNJsAAAAASUVORK5CYII=';

export class MyFetcher extends LitElement {

  static get properties() {
    return {
      fox: { type: String },
      fox2: { type: String },
    };
  }
  constructor() {
    super();
    this.fox = blankPng;
  }

  async newfox() {
    console.log('this.fox', this.fox);
    this.fox = await this._fetchFox();
    console.log('this.fox', this.fox);
  }

  async firstUpdated() {
    this.fox = await this._fetchFox();
    console.log('this.fox', this.fox);
  }

  async _fetchFox() {
    const response = await fetch('https://randomfox.ca/floof/');
    const jsonResponse = await response.json();
    return jsonResponse.image;
    this.fox = jsonResponse.image;
  }

  render() {
    return html`
			<div>
				<p>fox: <img src="${this.fox}" width="100" height="auto" /></p>

				<button type="button" @click=${this.newfox}>new fox</button>
			</div>
		`;
  }
}

customElements.define('my-fetcher', MyFetcher);
