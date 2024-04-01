import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/**
 * @element dope-stripe
 * @attr {string} color - background color of the stripe
 * @cssprop --stripe-color - background color of the stripe
 * @cssprop --angle-x-start - The starting x position of the stripe
 * @cssprop --angle-width - The width of the stripe
 * @cssprop --angle-y-end - The ending y position of the stripe
 * @cssprop --stripe-height - The height of the stripe
 * @cssprop --top-margin - 0 adds top margin, -1 removes top margin
 */
export class DopeStripe extends LitElement {
  static properties = {
    color: { type: String },
  };
  static styles = css`
    :host {
      --angle-x-start: 35%;
      --angle-width: 5%;
      --angle-y-end: 40px;
      --stripe-height: 16px;
      --stripe-color:#ffe27a;
      --top-margin: var(--no-top-margin, 0);

      --angle-x-end: calc(var(--angle-x-start) + var(--angle-width));
      --stripe-box-height: calc(var(--angle-y-end) + var(--stripe-height));
      --angle-y-right-bottom: calc(var(--angle-y-end) + var(--stripe-height));

      --polygon-path: 
        0 0, 
        var(--angle-x-start) 0, 
        var(--angle-x-end) var(--angle-y-end), 
        100% var(--angle-y-end), 
        100% var(--stripe-box-height), 
        var(--angle-x-end) var(--stripe-box-height), 
        var(--angle-x-start) var(--stripe-height), 
        0 var(--stripe-height);

      width: 100%;
      position: relative;
      display: block;
      margin-top: calc((var(--angle-y-end) + 1px) * var(--top-margin));
      clip-path: polygon(var(--polygon-path));
    }

    [part=stripe] {
      background-color: var(--stripe-color);
      width: 100%;
      height: var(--stripe-box-height);
      position: relative;
    }
  `;
  
  constructor() {
    super();
  }
  render() {
    let style = this.getAttribute('style') || '';
    if (this.color !== 'undefined') {
      style += `--stripe-color: ${this.color}`;
    }
    const stripeElm = html`<div part="stripe" style="${style}"><slot></slot></div>`;
    return stripeElm;
  }
}

customElements.define('dope-stripe', DopeStripe);
