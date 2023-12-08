<template id="time-line">
  <dl>
    <slot></slot>
  </dl>
</template>
/**
 * @element time-line
 * @attr {string[]} items - An array of colors to use for the stripes
 */
export class TimeLine extends HTMLElement {
  constructor() {
    super();

    const template = document.querySelector("#time-line").content;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.cloneNode(true));
  }
}
customElements.define('time-line', TimeLine);