import styles from './style.css?inline';
import html from './html.js';

/**
 * @element dope-stripes
 * @attr {string[]} stripes - An array of colors to use for the stripes
 */
export class DopeStripes extends HTMLElement {
  constructor() {
    super();
    this.attrs = {};
    this.attachShadow({ mode: "open" });
    this._getAttributes();
  }

  /**
   * Generate variables at `this.[attribute-name]` for each attribute on the element
   * @ignore
   */
  _getAttributes() {
    for (let name of this.getAttributeNames()) {
      if (this.getAttribute(name)) {
        this.attrs[name] = this.getAttribute(name);
      }
    }
    if (this.attrs.stripes && typeof this.attrs.stripes === 'string') {
      this.attrs.stripes = this.attrs.stripes.split(',');
    }
  }

  async connectedCallback() {
    this.setAttribute( 'exportparts', ['stripes'] );
    let view = `<style>${styles}</style>`;
    view += html(this.attrs.stripes);
    this.shadowRoot.innerHTML = view;
  }
}

customElements.define('dope-stripes', DopeStripes);
