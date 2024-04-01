import styles from './style.css?inline';
// import stripes from './html.js';
import { LitElement, html, css, unsafeCSS } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import './stripe';

/**
 * @element dope-stripes
 * @attr {string[]} stripes - An array of colors to use for the stripes
 */
export class DopeStripes extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;
  static properties = {
    stripes: {
      type: Array,
      attribute: "stripes",
      converter: (value, type) => {
        return value.split(",");
      }
    }
  };
  

  get _slottedChildren() {
    const slot = this.shadowRoot.querySelector("slot");
    const childNodes = slot?.assignedNodes({ flatten: true });
    if (!childNodes) {
      return [];
    }
    return Array.prototype.filter.call(
      childNodes,
      (node) => node.nodeType == Node.ELEMENT_NODE
    );
  }

  get _colorChildren() {
    const children = this.shadowRoot.querySelectorAll(".color-stripe");
    if (!children) {
      return [];
    }
    return Array.prototype.filter.call(
      children,
      (node) => node.nodeType == Node.ELEMENT_NODE
    );
  }

  firstUpdated() {
    let zindex = 1;
    if (this._slottedChildren.length > 0) {
      this._slottedChildren.reverse().forEach((node) => {
        node.style.zIndex = zindex++;
      });
    }
    if (this._colorChildren.length > 0) {
      this._colorChildren.reverse().forEach((node) => {
        node.style.zIndex = zindex++;
      });
    }
  }
  
  constructor() {
    super();
    this.stripes = [];
  }
  render() {
    const colorStripes = this.stripes.filter(color => color !== 'undefined').map((color) => html`<dope-stripe class="color-stripe" color=${color}></dope-stripe>`);
    return html`<div class="stripes" part="stripes" exportparts="stripe">
      ${colorStripes}
      <slot></slot>
  </div>`;
  }
}

customElements.define('dope-stripes', DopeStripes);
