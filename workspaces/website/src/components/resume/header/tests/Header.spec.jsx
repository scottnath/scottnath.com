import React from "react"
import { render } from "@testing-library/react"

import Header from "../Header"

const fixtures = {
  title: "Meowy McMeowerstein",
  subtitle: "Senior Fud Demander",
  summary: "I am meow, Meow I am.",
}

/**
 * Gets the elements from a rendere Header component
 * @param {DocumentFragment} docFrag - JavaScript document or JSDOM fragment
 * @param {linkElements} selectors
 * @returns {object} elements gathered from the selectors object
 */
const getHeader = (docFrag, selectors) => {
  const container = docFrag;

  return {
    container,
    title: container.querySelector('.title'),
    subtitle: container.querySelector('.subtitle'),
    summary: container.querySelector('.summary'),
    // @todo add headerNav exported tests
    // findme: container.querySelector('.find-me'),
  };
};

describe("Header", () => {
  it("renders correctly with defaults", () => {
    const { container } = render(<Header />);
    const created = getHeader(container);

    expect(created.title.innerHTML).toEqual(Header.defaultProps.title);
    expect(created.subtitle.innerHTML).toEqual(Header.defaultProps.subtitle);
    expect(created.summary.innerHTML).toEqual('');
  })
  it("renders with parameters", () => {
    const { container } = render(<Header {...fixtures}/>);
    const created = getHeader(container);

    expect(created.title.innerHTML).toEqual(fixtures.title);
    expect(created.subtitle.innerHTML).toEqual(fixtures.subtitle);
    expect(created.summary.innerHTML).toEqual(fixtures.summary);

  })
})
