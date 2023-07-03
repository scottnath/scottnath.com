import React from "react"
import { render } from "@testing-library/react"

import ExperienceDetails from "../ExperienceDetails"

/**
 * Gets the elements from a rendered ExperienceDetails component
 * @param {DocumentFragment} docFrag - JavaScript document or JSDOM fragment
 * @param {linkElements} selectors
 * @returns {object} elements gathered from the selectors object
 */
const getExperienceDetails = (docFrag, selectors) => {
  const container = docFrag;
  const summary = container.querySelector('.summary');
  const description = container.querySelector('.description');

  return {
    summary,
    description,
  };
};

describe("ExperienceDetails", () => {
  it("renders correctly", () => {
    const { container } = render(<ExperienceDetails summary="Meow" />);
    const created = getExperienceDetails(container);

    expect(created.summary.innerHTML).toEqual("Meow");
    expect(created.description).toBeNull();
  })
  it("renders description correctly", () => {
    const { container } = render(<ExperienceDetails summary="Meow2" description="<p>Meow3</p>" />);
    const created = getExperienceDetails(container);

    expect(created.summary.innerHTML).toEqual("Meow2");
    expect(created.description.innerHTML).toEqual('<p>Meow3</p>');
    expect(created.description.querySelector('p').innerHTML).toEqual("Meow3");
  })
})
