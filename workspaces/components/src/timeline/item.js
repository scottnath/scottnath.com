<template id="timeline-item">
  <dt></dt>
  <dd></dd>
</template>
/**
 * @element time-line
 * @attr {string[]} items - An array of colors to use for the stripes
 */
export class TimelineItem extends HTMLElement {
  static get observedAttributes() {
    return ["datetime", "content"];
  }
  constructor() {
    super();
    const template = document.querySelector("#timeline-item").content;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.cloneNode(true));
  }

  attributeChangedCallback(e, oldValue, newValue) {
    const termElement = this.shadowRoot.querySelector("dt");
    const timeElement = document.createElement("time");
    timeElement.textContent = this.parentElement.getAttribute("datetime");
    termElement.appendChild(timeElement);
    
    const definitionElement = this.shadowRoot.querySelector("dd");
    definitionElement.textContent = this.parentElement.getAttribute("content");
  }
}
customElements.define('timeline-item', TimelineItem);